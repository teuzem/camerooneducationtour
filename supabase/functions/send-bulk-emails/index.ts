import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { nodemailer } from 'https://deno.land/x/nodemailer/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface CampaignPayload {
  campaignId: string;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  contact_person?: string;
  country?: string;
  city?: string;
}

// Helper to personalize content
const personalizeContent = (content: string, partner: Partner): string => {
  return content
    .replace(/\{\{contact_person\}\}/g, partner.contact_person || 'Cher Partenaire')
    .replace(/\{\{institution_name\}\}/g, partner.name)
    .replace(/\{\{country\}\}/g, partner.country || '')
    .replace(/\{\{city\}\}/g, partner.city || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { campaignId }: CampaignPayload = await req.json();
    if (!campaignId) {
      throw new Error('Un ID de campagne est requis.');
    }

    const supabaseAdmin: SupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error(`Campagne non trouvée : ${campaignError?.message || 'Erreur inconnue'}`);
    }

    const { data: partners, error: partnersError } = await supabaseAdmin
      .from('partners')
      .select('id, name, email, contact_person, country, city')
      .in('type', campaign.target_partner_types)
      .eq('is_active', true);

    if (partnersError) {
      throw new Error(`Échec de la récupération des partenaires : ${partnersError.message}`);
    }

    if (!partners || partners.length === 0) {
      await supabaseAdmin.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString(), total_recipients: 0 }).eq('id', campaignId);
      return new Response(JSON.stringify({ message: 'Aucun partenaire actif trouvé pour le public cible.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    const transporter = nodemailer.createTransport({
      host: Deno.env.get('IONOS_SMTP_HOST'),
      port: parseInt(Deno.env.get('IONOS_SMTP_PORT') ?? '587', 10),
      secure: parseInt(Deno.env.get('IONOS_SMTP_PORT') ?? '587', 10) === 465,
      auth: {
        user: Deno.env.get('IONOS_SMTP_USER'),
        pass: Deno.env.get('IONOS_SMTP_PASS'),
      },
    });

    let successful_sends = 0;
    let failed_sends = 0;
    const recipientRecords: any[] = [];

    for (const partner of partners) {
      try {
        await transporter.sendMail({
          from: `"Go2Skul Education Group" <${Deno.env.get('IONOS_SMTP_USER')}>`,
          to: partner.email,
          subject: campaign.subject,
          html: personalizeContent(campaign.html_content, partner),
        });
        successful_sends++;
        recipientRecords.push({ campaign_id: campaignId, partner_id: partner.id, email: partner.email, status: 'sent', sent_at: new Date().toISOString() });
      } catch (error) {
        failed_sends++;
        recipientRecords.push({ campaign_id: campaignId, partner_id: partner.id, email: partner.email, status: 'failed', sent_at: new Date().toISOString(), error_message: error.message });
        console.error(`Échec de l'envoi de l'e-mail à ${partner.email}:`, error);
      }
    }

    await supabaseAdmin.from('email_campaigns').update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      total_recipients: partners.length,
      successful_sends,
      failed_sends,
    }).eq('id', campaignId);

    if (recipientRecords.length > 0) {
      await supabaseAdmin.from('campaign_recipients').insert(recipientRecords);
    }

    return new Response(JSON.stringify({ message: `Campagne envoyée. Succès : ${successful_sends}, Échecs : ${failed_sends}`, successful_sends, failed_sends }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Partner {
  id: string
  name: string
  type: 'foreign_university' | 'local_school' | 'education_agent'
  email: string
  contact_person?: string
  phone?: string
  country?: string
  city?: string
  website?: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  variables: Record<string, string>
  template_type: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  html_content: string
  template_id?: string
  target_partner_types: string[]
  status: 'draft' | 'sending' | 'scheduled' | 'sent' | 'cancelled'
  scheduled_at?: string
  sent_at?: string
  total_recipients: number
  successful_sends: number
  failed_sends: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CampaignRecipient {
  id: string
  campaign_id: string
  partner_id: string
  email: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sent_at?: string
  error_message?: string
  personalized_content?: string
  created_at: string
}

export interface OrganizationProfile {
  id: string;
  name?: string;
  slogan?: string;
  mission?: string;
  logo_url?: string;
  address?: string;
  city?: string;
  country?: string;
  accreditation_details?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  updated_at: string;
}

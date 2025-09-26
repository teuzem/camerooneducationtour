/*
          # Seed Email Templates
          Inserts 5 professional, pre-made email templates into the `email_templates` table for immediate use in the admin portal.

          ## Query Description: This operation adds new data to the `email_templates` table. It is safe and does not affect any existing data. These templates provide a starting point for various communication needs related to the Cameroon Education Tour 2026.
          
          ## Metadata:
          - Schema-Category: "Data"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (can be deleted from the admin UI)
          
          ## Structure Details:
          - Table: `public.email_templates`
          - Columns affected: `name`, `subject`, `html_content`, `variables`, `template_type`
          
          ## Security Implications:
          - RLS Status: Enabled (as per previous migrations)
          - Policy Changes: No
          - Auth Requirements: None for this migration script.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible. A one-time insertion of a small number of rows.
          */

INSERT INTO public.email_templates (name, subject, html_content, variables, template_type)
VALUES
(
    'Invitation - Universités Étrangères',
    'Invitation à Participer au Cameroon Education Tour 2026',
    $$
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'); </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">CAMEROON EDUCATION TOUR 2026</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Connectez-vous avec les talents les plus brillants du Cameroun.</p>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Cher {{contact_person}},</h2>
                <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    Nous sommes ravis d'inviter <strong>{{institution_name}}</strong> à participer au <strong>Cameroon Education Tour 2026</strong>, un programme national de sensibilisation scolaire organisé par Go2Skul Education Group.
                </p>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #FFC72C;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Pourquoi Participer ?</h3>
                    <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li><strong>Engagez</strong> des discussions avec des milliers d'étudiants et parents motivés.</li>
                        <li><strong>Construisez</strong> des partenariats stratégiques avec des écoles et agents de premier plan.</li>
                        <li><strong>Augmentez</strong> votre visibilité et votre crédibilité sur le marché éducatif camerounais.</li>
                    </ul>
                </div>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://alpha.dualite.dev/#register" style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Inscrivez-vous Maintenant
                    </a>
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Cordialement,<br><strong>Go2Skul Education Group</strong></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    $$,
    '{"contact_person": "{{contact_person}}", "institution_name": "{{institution_name}}"}',
    'university_invitation'
),
(
    'Invitation - Écoles Locales',
    'Partenariat Stratégique - Cameroon Education Tour 2026',
    $$
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'); </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">CAMEROON EDUCATION TOUR 2026</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Offrez le monde à vos élèves.</p>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Cher {{contact_person}} de {{institution_name}},</h2>
                <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    Go2Skul Education Group a le plaisir de vous inviter à devenir un partenaire clé du <strong>Cameroon Education Tour 2026</strong>. Cet événement exclusif amènera des universités étrangères de renommée mondiale directement dans votre établissement.
                </p>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #00C49A;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Avantages pour votre École :</h3>
                    <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li><strong>Offrez</strong> à vos élèves un accès direct à des opportunités d'études à l'étranger.</li>
                        <li><strong>Renforcez</strong> le prestige de votre établissement en tant que leader en orientation internationale.</li>
                        <li><strong>Établissez</strong> des liens directs avec les responsables des admissions des universités.</li>
                    </ul>
                </div>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://alpha.dualite.dev/#register" style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Devenez Partenaire
                    </a>
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Cordialement,<br><strong>Go2Skul Education Group</strong></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    $$,
    '{"contact_person": "{{contact_person}}", "institution_name": "{{institution_name}}"}',
    'school_invitation'
),
(
    'Rappel amical - Inscription',
    'Rappel : Ne manquez pas le Cameroon Education Tour 2026',
    $$
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'); </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #3B82F6; padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Rappel Amical</h1>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Bonjour {{contact_person}},</h2>
                <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    Ceci est un rappel amical concernant votre invitation au <strong>Cameroon Education Tour 2026</strong> en Février. Les places pour les institutions partenaires sont limitées et se remplissent rapidement.
                </p>
                <p style="color: #475569; line-height: 1.6; margin: 20px 0;">
                    C'est une occasion unique de rencontrer des milliers d'étudiants camerounais prometteurs. Ne manquez pas cette opportunité de développer votre réseau.
                </p>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://alpha.dualite.dev/#register" style="background: #00C49A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Confirmer ma participation
                    </a>
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Cordialement,<br><strong>Go2Skul Education Group</strong></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    $$,
    '{"contact_person": "{{contact_person}}"}',
    'follow_up'
),
(
    'Dernière chance pour vous inscrire !',
    'Dernière Chance : Inscriptions au Cameroon Education Tour 2026',
    $$
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'); </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #EF4444; padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">DERNIÈRE CHANCE !</h1>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Bonjour {{contact_person}} de {{institution_name}},</h2>
                <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    Les inscriptions pour le <strong>Cameroon Education Tour 2026</strong> se terminent bientôt. C'est votre dernière opportunité de réserver votre place pour cet événement de recrutement incontournable.
                </p>
                <p style="color: #475569; line-height: 1.6; margin: 20px 0; font-weight: bold;">
                    Ne laissez pas passer cette chance de connecter votre institution avec les futurs leaders du Cameroun.
                </p>
                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://alpha.dualite.dev/#register" style="background: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        M'inscrire d'urgence
                    </a>
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Cordialement,<br><strong>Go2Skul Education Group</strong></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    $$,
    '{"contact_person": "{{contact_person}}", "institution_name": "{{institution_name}}"}',
    'announcement'
),
(
    'Remerciements - Cameroon Education Tour 2026',
    'Merci d''avoir participé au Cameroon Education Tour 2026',
    $$
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'); </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MERCI !</h1>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Cher {{contact_person}},</h2>
                <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    Au nom de toute l'équipe de Go2Skul Education Group, nous tenons à remercier sincèrement <strong>{{institution_name}}</strong> pour sa participation et sa contribution au succès du <strong>Cameroon Education Tour 2026</strong>.
                </p>
                <p style="color: #475569; line-height: 1.6; margin: 20px 0;">
                    Nous espérons que cet événement a été fructueux pour vous et nous sommes impatients de collaborer à nouveau pour de futures opportunités.
                </p>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Avec nos meilleures salutations,<br><strong>L'équipe Go2Skul</strong></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    $$,
    '{"contact_person": "{{contact_person}}", "institution_name": "{{institution_name}}"}',
    'follow_up'
);

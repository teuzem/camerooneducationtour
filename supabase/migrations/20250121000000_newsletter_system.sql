/*
# Newsletter Management System Setup
Creates the complete database schema for Go2Skul Newsletter system including partners management and email campaigns.

## Query Description:
This migration creates all necessary tables for managing newsletter subscribers, email campaigns, and partner institutions. This is a foundational setup with no existing data impact - safe to run on new or existing databases.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- partners: Stores foreign universities and local schools
- email_campaigns: Manages newsletter campaigns
- email_templates: Stores reusable email templates
- campaign_recipients: Tracks email delivery status

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Admin authentication required

## Performance Impact:
- Indexes: Added for efficient querying
- Triggers: None
- Estimated Impact: Minimal performance impact
*/

-- Create enum types
CREATE TYPE partner_type AS ENUM ('foreign_university', 'local_school', 'education_agent');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sent', 'cancelled');
CREATE TYPE recipient_status AS ENUM ('pending', 'sent', 'delivered', 'failed');

-- Partners table (foreign universities and local schools)
CREATE TABLE partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type partner_type NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates
CREATE TABLE email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    template_type VARCHAR(100) DEFAULT 'newsletter',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns
CREATE TABLE email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    template_id UUID REFERENCES email_templates(id),
    target_partner_types partner_type[],
    status campaign_status DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    successful_sends INTEGER DEFAULT 0,
    failed_sends INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign recipients tracking
CREATE TABLE campaign_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status recipient_status DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    personalized_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for additional admin info)
CREATE TABLE admin_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_partners_active ON partners(is_active);
CREATE INDEX idx_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_campaigns_created_by ON email_campaigns(created_by);
CREATE INDEX idx_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_recipients_status ON campaign_recipients(status);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admin access to all data
CREATE POLICY "Admin full access to partners" ON partners
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admin full access to email_templates" ON email_templates
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admin full access to email_campaigns" ON email_campaigns
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admin full access to campaign_recipients" ON campaign_recipients
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admin access to admin_users" ON admin_users
    FOR ALL TO authenticated
    USING (id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO admin_users (id, email, full_name, is_active)
SELECT id, email, raw_user_meta_data->>'full_name', true
FROM auth.users 
WHERE email = 'angwirhoda@go2skul.com'
ON CONFLICT (id) DO NOTHING;

-- Sample data for testing
INSERT INTO partners (name, type, email, contact_person, country, city, description) VALUES
('University of Toronto', 'foreign_university', 'admissions@utoronto.ca', 'John Smith', 'Canada', 'Toronto', 'Leading Canadian university offering diverse programs'),
('Harvard University', 'foreign_university', 'info@harvard.edu', 'Sarah Johnson', 'USA', 'Cambridge', 'Prestigious Ivy League institution'),
('Collège de la Retraite', 'local_school', 'info@retraite.cm', 'Marie Dupont', 'Cameroon', 'Yaoundé', 'Top secondary school in Yaoundé'),
('Lycée Général Leclerc', 'local_school', 'contact@lgl.cm', 'Paul Mbarga', 'Cameroon', 'Yaoundé', 'Excellence in secondary education'),
('Oxford University', 'foreign_university', 'admissions@ox.ac.uk', 'David Williams', 'United Kingdom', 'Oxford', 'World-renowned British university');

-- Default email template
INSERT INTO email_templates (name, subject, html_content, variables, template_type) VALUES
('Cameroon Education Tour 2026 - Universities', 'Join the Cameroon Education Tour 2026 - Connect with Bright Minds', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Go2Skul Education Tour</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Study Abroad Partner</p>
        </div>
        <div style="padding: 40px 20px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0;">Dear {{contact_person}},</h2>
            <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                We are excited to invite {{institution_name}} to participate in the <strong>Cameroon Education Tour 2026</strong>, 
                a nationwide school outreach program bringing foreign universities face-to-face with secondary school students, 
                parents, and counselors across Cameroon.
            </p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0;">Event Highlights:</h3>
                <ul style="color: #475569; margin: 0; padding-left: 20px;">
                    <li>Direct engagement with motivated students and parents</li>
                    <li>Partnership opportunities with premium secondary schools</li>
                    <li>Increase your visibility in the Cameroon education market</li>
                    <li>Showcase your scholarships and programs</li>
                </ul>
            </div>
            <p style="color: #475569; line-height: 1.6; margin: 20px 0;">
                The tour will take place in <strong>February 2026 during Youth Week</strong>, visiting top secondary schools 
                in Yaoundé and Douala with the highest tuition fees and most motivated student populations.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:angwirhoda@go2skul.com" style="background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Confirm Your Participation
                </a>
            </div>
            <p style="color: #475569; line-height: 1.6; margin: 20px 0;">
                For more information about participation details, booth setup, and networking opportunities, 
                please contact us directly.
            </p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px; margin: 0;">
                    Best regards,<br>
                    <strong>Go2Skul Education Group</strong><br>
                    Your Study Abroad Partner<br>
                    📧 angwirhoda@go2skul.com<br>
                    📞 +237 6 50 59 28 74<br>
                    🌐 www.go2skul.com
                </p>
            </div>
        </div>
    </div>
</body>
</html>',
'{"contact_person": "Contact Person", "institution_name": "Institution Name"}',
'university_invitation');

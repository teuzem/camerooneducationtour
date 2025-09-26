import emailjs from '@emailjs/browser'
import { Partner } from './supabase'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const adminTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN
const confirmationTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRMATION
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const sendRegistrationEmails = async (partner: Partner) => {
  if (!serviceId || !adminTemplateId || !confirmationTemplateId || !publicKey) {
    const message = "Les variables d'environnement EmailJS ne sont pas configurées. Veuillez les ajouter à votre fichier .env."
    console.error(message)
    throw new Error(message)
  }

  const templateParams = {
    institution_name: partner.name,
    contact_person: partner.contact_person,
    contact_email: partner.email,
    contact_phone: partner.phone,
    country: partner.country,
    city: partner.city,
    website: partner.website || 'N/A',
    institution_type: partner.type === 'foreign_university' ? 'Université Étrangère' : 'École Locale',
    description: partner.description || 'Aucune description fournie.',
    admin_email: 'angwirhoda@go2skul.com',
  }

  // Promise to send email to admin
  const sendAdminEmail = emailjs.send(serviceId, adminTemplateId, templateParams, publicKey)

  // Promise to send confirmation email to user
  const sendConfirmationEmail = emailjs.send(serviceId, confirmationTemplateId, templateParams, publicKey)

  await Promise.all([sendAdminEmail, sendConfirmationEmail])
}

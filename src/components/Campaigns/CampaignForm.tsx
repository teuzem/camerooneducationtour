import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, X, Send, Eye, Users, Loader2 } from 'lucide-react'
import { supabase, EmailCampaign, EmailTemplate, Partner } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import EmailEditor from './EmailEditor'
import EmailPreview from './EmailPreview'

interface CampaignFormProps {
  campaign?: EmailCampaign | null
  onSave: () => void
  onCancel: () => void
}

interface CampaignFormData {
  name: string
  subject: string
  target_partner_types: string[]
  template_id?: string
}

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSave, onCancel }) => {
  const { user } = useAuth()
  const isEditing = !!campaign
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [htmlContent, setHtmlContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recipientCount, setRecipientCount] = useState(0)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CampaignFormData>({
    defaultValues: campaign ? {
      name: campaign.name,
      subject: campaign.subject,
      target_partner_types: campaign.target_partner_types || [],
      template_id: campaign.template_id || '',
    } : {
      target_partner_types: [],
    }
  })

  const watchedTargetTypes = watch('target_partner_types')
  const watchedTemplateId = watch('template_id')

  useEffect(() => {
    fetchTemplates()
    fetchPartners()
  }, [])

  useEffect(() => {
    if (campaign?.html_content) {
      setHtmlContent(campaign.html_content)
    }
  }, [campaign])

  useEffect(() => {
    if (watchedTemplateId) {
      const template = templates.find(t => t.id === watchedTemplateId)
      if (template) {
        setHtmlContent(template.html_content)
        setValue('subject', template.subject)
      }
    }
  }, [watchedTemplateId, templates, setValue])

  useEffect(() => {
    calculateRecipientCount()
  }, [watchedTargetTypes, partners])

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false })
    if (error) console.error('Erreur lors de la récupération des modèles:', error)
    else setTemplates(data || [])
  }

  const fetchPartners = async () => {
    const { data, error } = await supabase.from('partners').select('*').eq('is_active', true)
    if (error) console.error('Erreur lors de la récupération des partenaires:', error)
    else setPartners(data || [])
  }

  const calculateRecipientCount = () => {
    if (!watchedTargetTypes || watchedTargetTypes.length === 0) {
      setRecipientCount(0)
      return
    }
    const count = partners.filter(partner => watchedTargetTypes.includes(partner.type)).length
    setRecipientCount(count)
  }

  const saveCampaign = async (data: CampaignFormData, status: EmailCampaign['status'] = 'draft'): Promise<EmailCampaign> => {
    const campaignData = {
      ...data,
      html_content: htmlContent,
      created_by: user?.id,
      total_recipients: recipientCount,
      status,
    }

    if (isEditing && campaign) {
      const { data: updatedCampaign, error } = await supabase
        .from('email_campaigns')
        .update(campaignData)
        .eq('id', campaign.id)
        .select()
        .single()
      if (error) throw error
      return updatedCampaign
    } else {
      const { data: newCampaign, error } = await supabase
        .from('email_campaigns')
        .insert([campaignData])
        .select()
        .single()
      if (error) throw error
      return newCampaign
    }
  }

  const onSaveDraft = async (data: CampaignFormData) => {
    setIsSubmitting(true)
    const toastId = toast.loading('Enregistrement du brouillon...')
    try {
      await saveCampaign(data, 'draft')
      toast.success('Brouillon enregistré avec succès', { id: toastId })
      onSave()
    } catch (error: any) {
      toast.error(`Échec de l'enregistrement: ${error.message}`, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendCampaign = async (data: CampaignFormData) => {
    if (!htmlContent.trim()) {
      toast.error("Veuillez ajouter du contenu à l'e-mail avant de l'envoyer")
      return
    }
    if (recipientCount === 0) {
      toast.error('Aucun destinataire sélectionné')
      return
    }
    if (!confirm(`Êtes-vous sûr de vouloir envoyer cette campagne à ${recipientCount} destinataires ? Cette action est irréversible.`)) {
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Préparation de l'envoi de la campagne...")

    try {
      const savedCampaign = await saveCampaign(data, 'sending')
      toast.success('Campagne enregistrée, démarrage du processus d\'envoi...', { id: toastId })

      const { error: functionError } = await supabase.functions.invoke('send-bulk-emails', {
        body: { campaignId: savedCampaign.id },
      })

      if (functionError) {
        await supabase.from('email_campaigns').update({ status: 'draft' }).eq('id', savedCampaign.id)
        throw new Error(`Échec du démarrage du processus d'envoi : ${functionError.message}`)
      }

      toast.success("Le processus d'envoi a été lancé avec succès. Le statut sera mis à jour automatiquement.", { duration: 6000 })
      onSave()

    } catch (error: any) {
      toast.error(`Une erreur est survenue : ${error.message}`, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showPreview) {
    return (
      <EmailPreview
        subject={watch('subject')}
        htmlContent={htmlContent}
        samplePartner={partners.find(p => watchedTargetTypes.includes(p.type)) || partners[0]}
        onClose={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Modifier la Campagne' : 'Créer une Nouvelle Campagne'}
          </h1>
          <p className="text-gray-600">
            Concevez et envoyez des newsletters à vos institutions partenaires
          </p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 p-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleSendCampaign)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Paramètres de la Campagne</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la Campagne *</label>
              <input {...register('name', { required: 'Le nom de la campagne est requis' })} type="text" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green" placeholder="Cameroon Education Tour 2026 - Universités" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modèle d'e-mail</label>
              <select {...register('template_id')} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green">
                <option value="">Partir de zéro</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sujet de l'e-mail *</label>
              <input {...register('subject', { required: "Le sujet de l'e-mail est requis" })} type="text" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green" placeholder="Rejoignez le Cameroon Education Tour 2026" />
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Public Cible *</label>
              <div className="space-y-2">
                <label className="flex items-center"><input {...register('target_partner_types')} type="checkbox" value="foreign_university" className="h-4 w-4 text-go2skul-green focus:ring-go2skul-green border-gray-300 rounded" /><span className="ml-2 text-sm text-gray-700">Universités Étrangères</span></label>
                <label className="flex items-center"><input {...register('target_partner_types')} type="checkbox" value="local_school" className="h-4 w-4 text-go2skul-green focus:ring-go2skul-green border-gray-300 rounded" /><span className="ml-2 text-sm text-gray-700">Écoles Locales</span></label>
                <label className="flex items-center"><input {...register('target_partner_types')} type="checkbox" value="education_agent" className="h-4 w-4 text-go2skul-green focus:ring-go2skul-green border-gray-300 rounded" /><span className="ml-2 text-sm text-gray-700">Agents Éducatifs</span></label>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-600"><Users className="w-4 h-4 mr-1" /><span>{recipientCount} destinataires recevront cette campagne</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Contenu de l'e-mail</h2>
            <button type="button" onClick={() => setShowPreview(true)} className="flex items-center space-x-2 px-3 py-2 text-go2skul-green hover:text-go2skul-green-700 border border-go2skul-green-200 hover:border-go2skul-green-300 rounded-lg transition-colors">
              <Eye className="w-4 h-4" /><span>Aperçu</span>
            </button>
          </div>
          <EmailEditor content={htmlContent} onChange={setHtmlContent} />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Annuler</button>
          <div className="flex space-x-4">
            <button type="button" onClick={handleSubmit(onSaveDraft)} disabled={isSubmitting} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50">
              <Save className="w-4 h-4" /><span>{isEditing ? 'Mettre à jour' : 'Enregistrer'} le Brouillon</span>
            </button>
            <button type="submit" disabled={isSubmitting || recipientCount === 0} className="px-4 py-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white rounded-lg hover:from-go2skul-green-600 hover:to-go2skul-blue-600 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isSubmitting ? 'Envoi...' : 'Envoyer la Campagne'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CampaignForm

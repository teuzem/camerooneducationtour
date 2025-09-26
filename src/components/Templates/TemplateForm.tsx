import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, X, Eye } from 'lucide-react'
import { supabase, EmailTemplate } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import EmailEditor from '../Campaigns/EmailEditor'
import TemplatePreview from './TemplatePreview'

interface TemplateFormProps {
  template?: EmailTemplate | null
  onSave: () => void
  onCancel: () => void
}

interface TemplateFormData {
  name: string
  subject: string
  template_type: string
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSave, onCancel }) => {
  const { user } = useAuth()
  const isEditing = !!template
  const [htmlContent, setHtmlContent] = useState(template?.html_content || '')
  const [showPreview, setShowPreview] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<TemplateFormData>({
    defaultValues: template ? {
      name: template.name,
      subject: template.subject,
      template_type: template.template_type,
    } : {
      template_type: 'newsletter',
    }
  })

  const extractVariables = (content: string) => {
    const variableRegex = /\{\{(\w+)\}\}/g
    const variables: Record<string, string> = {}
    let match

    while ((match = variableRegex.exec(content)) !== null) {
      const variableName = match[1]
      variables[variableName] = `{{${variableName}}}`
    }

    return variables
  }

  const onSubmit = async (data: TemplateFormData) => {
    try {
      const variables = extractVariables(htmlContent)
      
      const templateData = {
        ...data,
        html_content: htmlContent,
        variables,
        created_by: user?.id,
      }

      if (isEditing) {
        const { error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', template.id)

        if (error) throw error
        toast.success('Modèle mis à jour avec succès')
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert([templateData])

        if (error) throw error
        toast.success('Modèle créé avec succès')
      }

      onSave()
    } catch (error: any) {
      toast.error(`Échec de la ${isEditing ? 'mise à jour' : 'création'} du modèle`)
      console.error('Error:', error)
    }
  }

  if (showPreview) {
    const previewTemplate: EmailTemplate = {
      id: template?.id || 'preview',
      name: watch('name') || 'Modèle d\'aperçu',
      subject: watch('subject') || 'Sujet d\'aperçu',
      html_content: htmlContent,
      variables: extractVariables(htmlContent),
      template_type: watch('template_type') || 'newsletter',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return (
      <TemplatePreview
        template={previewTemplate}
        onClose={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Modifier le Modèle' : 'Créer un Nouveau Modèle'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Mettre à jour le modèle d\'e-mail' : 'Créer un modèle d\'e-mail réutilisable pour vos campagnes'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Paramètres du Modèle</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Modèle *
              </label>
              <input
                {...register('name', { required: 'Le nom du modèle est requis' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
                placeholder="Modèle d'invitation pour université"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Modèle
              </label>
              <select
                {...register('template_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              >
                <option value="newsletter">Newsletter</option>
                <option value="university_invitation">Invitation Université</option>
                <option value="school_invitation">Invitation École</option>
                <option value="follow_up">Suivi</option>
                <option value="announcement">Annonce</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet de l'e-mail *
              </label>
              <input
                {...register('subject', { required: 'Le sujet de l\'e-mail est requis' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
                placeholder="Rejoignez le Cameroon Education Tour 2026"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Contenu du Modèle</h2>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center space-x-2 px-3 py-2 text-go2skul-green hover:text-go2skul-green-700 border border-go2skul-green-200 hover:border-go2skul-green-300 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </button>
          </div>
          
          <EmailEditor
            content={htmlContent}
            onChange={setHtmlContent}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white rounded-lg hover:from-go2skul-green-600 hover:to-go2skul-blue-600 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Mettre à jour le Modèle' : 'Créer le Modèle'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default TemplateForm

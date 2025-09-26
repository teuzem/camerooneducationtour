import React from 'react'
import { X, Edit, Smartphone, Monitor } from 'lucide-react'
import { EmailTemplate } from '../../lib/supabase'

interface TemplatePreviewProps {
  template: EmailTemplate
  onClose: () => void
  onEdit: () => void
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose, onEdit }) => {
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'mobile'>('desktop')

  const sampleData = {
    contact_person: 'Dr. Sarah Johnson',
    institution_name: 'University of Toronto',
    country: 'Canada',
    city: 'Toronto',
    subject: template.subject,
  }

  const personalizeContent = (content: string) => {
    let personalizedContent = content
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      personalizedContent = personalizedContent.replace(regex, value)
    })
    return personalizedContent
  }

  const personalizedContent = personalizeContent(template.html_content)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aperçu du Modèle</h1>
          <p className="text-gray-600">{template.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-go2skul-blue text-white rounded-lg hover:bg-go2skul-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier le Modèle</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Type de Modèle:</div>
            <div className="font-medium text-gray-900 capitalize">{template.template_type.replace('_', ' ')}</div>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
            <div className="text-sm text-gray-600 mb-1">Sujet:</div>
            <div className="font-medium text-gray-900">{template.subject}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
            <div className="text-sm text-gray-600 mb-2">Variables Disponibles:</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(template.variables || {}).map((variable) => (
                <span
                  key={variable}
                  className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {`{{${variable}}}`}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
            <div className="text-sm text-gray-600 mb-2">Données d'exemple utilisées:</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(sampleData).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-500">{key}:</span> <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div 
              className={`bg-white shadow-lg overflow-hidden transition-all ${
                previewMode === 'mobile' 
                  ? 'w-[375px] rounded-xl border-8 border-gray-800' 
                  : 'w-full max-w-4xl rounded-lg'
              }`}
              style={{ height: '60vh' }}
            >
              <iframe
                srcDoc={personalizedContent}
                className="w-full h-full border-0"
                title="Aperçu du Modèle"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatePreview

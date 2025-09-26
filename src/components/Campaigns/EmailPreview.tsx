import React from 'react'
import { X, Smartphone, Monitor } from 'lucide-react'
import { Partner } from '../../lib/supabase'

interface EmailPreviewProps {
  subject: string
  htmlContent: string
  samplePartner?: Partner
  onClose: () => void
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, htmlContent, samplePartner, onClose }) => {
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'mobile'>('desktop')

  const personalizeContent = (content: string, partner?: Partner) => {
    if (!partner) return content

    return content
      .replace(/\{\{contact_person\}\}/g, partner.contact_person || 'Cher Partenaire')
      .replace(/\{\{institution_name\}\}/g, partner.name)
      .replace(/\{\{country\}\}/g, partner.country || '')
      .replace(/\{\{city\}\}/g, partner.city || '')
      .replace(/\{\{subject\}\}/g, subject)
  }

  const personalizedContent = personalizeContent(htmlContent, samplePartner)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Aperçu de l'e-mail</h2>
            {samplePartner && (
              <div className="text-sm text-gray-600">
                Aperçu pour: <span className="font-medium">{samplePartner.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
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
            
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex-grow overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
            <div className="text-sm text-gray-600 mb-1">Sujet:</div>
            <div className="font-medium text-gray-900">{subject}</div>
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
                title="Aperçu de l'e-mail"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {samplePartner ? (
                `Aperçu personnalisé pour ${samplePartner.name}`
              ) : (
                'Aucun partenaire d\'exemple disponible pour l\'aperçu de la personnalisation'
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailPreview

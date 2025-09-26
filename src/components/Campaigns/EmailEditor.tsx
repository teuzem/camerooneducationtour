import React, { useState } from 'react'
import { Code } from 'lucide-react'

interface EmailEditorProps {
  content: string
  onChange: (content: string) => void
}

const EmailEditor: React.FC<EmailEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'html'>('visual')

  const defaultTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">CAMEROON EDUCATION TOUR 2026</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Présentez votre institution. Connectez-vous avec les talents les plus brillants du Cameroun.</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Cher {{contact_person}},</h2>
            
            <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                Nous sommes ravis d'inviter <strong>{{institution_name}}</strong> à participer au <strong>Cameroon Education Tour 2026</strong>, 
                un programme national de sensibilisation scolaire organisé par Go2Skul Education Group, mettant en relation directe les universités étrangères avec les élèves du secondaire, 
                les parents et les conseillers d'orientation à travers le Cameroun.
            </p>

            <p style="color: #475569; line-height: 1.6; margin: 20px 0;">
                La tournée aura lieu en <strong>Février 2026 pendant la Semaine de la Jeunesse</strong>, visitant les meilleures écoles secondaires 
                de Yaoundé et Douala.
            </p>
            
            <!-- Highlights Box -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #FFC72C;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Pourquoi Participer ?</h3>
                <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li><strong>Engagez</strong> des discussions avec des étudiants et parents motivés</li>
                    <li><strong>Construisez</strong> des partenariats avec des écoles et agents de premier plan</li>
                    <li><strong>Augmentez</strong> votre visibilité sur le marché éducatif camerounais</li>
                    <li><strong>Présentez</strong> vos bourses d'études et programmes</li>
                </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="mailto:angwirhoda@go2skul.com?subject=Confirmation%20de%20Participation%20-%20Cameroon%20Education%20Tour%202026" style="background: linear-gradient(135deg, #00C49A 0%, #3B82F6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Confirmez Votre Participation
                </a>
            </div>
            
            <p style="color: #475569; line-height: 1.6; margin: 20px 0;">
                Pour plus d'informations sur les détails de participation, l'installation des stands et les opportunités de réseautage, 
                veuillez nous contacter directement.
            </p>
            
            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">
                    Cordialement,<br>
                    <strong>Go2Skul Education Group</strong><br>
                    Your Study Abroad Partner<br>
                    <a href="mailto:angwirhoda@go2skul.com" style="color: #3B82F6; text-decoration: none;">angwirhoda@go2skul.com</a> | 
                    +237 6 50 59 28 74 | 
                    <a href="https://www.go2skul.com" style="color: #3B82F6; text-decoration: none;">www.go2skul.com</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>`

  const handleContentChange = (newContent: string) => {
    onChange(newContent)
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('html-editor') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const before = text.substring(0, start)
      const after = text.substring(end, text.length)
      const newText = before + `{{${variable}}}` + after
      onChange(newText)
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4)
      }, 0)
    }
  }

  const loadDefaultTemplate = () => {
    if (confirm('Cela remplacera votre contenu actuel. Êtes-vous sûr ?')) {
      onChange(defaultTemplate)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'visual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Visuel
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'html'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            HTML
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadDefaultTemplate}
            className="px-3 py-1 text-sm text-go2skul-green hover:text-go2skul-green-700 border border-go2skul-green-200 hover:border-go2skul-green-300 rounded-md transition-colors"
          >
            Charger le modèle par défaut
          </button>
        </div>
      </div>

      {activeTab === 'visual' ? (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 bg-white min-h-[300px] max-h-[500px] overflow-y-auto">
            <iframe
              srcDoc={content || defaultTemplate}
              className="w-full h-full border-0"
              style={{height: '500px'}}
              title="Visual Editor Preview"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Insertion Rapide:</span>
            <button onClick={() => insertVariable('contact_person')} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">{`{{contact_person}}`}</button>
            <button onClick={() => insertVariable('institution_name')} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">{`{{institution_name}}`}</button>
            <button onClick={() => insertVariable('country')} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">{`{{country}}`}</button>
            <button onClick={() => insertVariable('city')} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">{`{{city}}`}</button>
          </div>

          <textarea
            id="html-editor"
            value={content || defaultTemplate}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
            placeholder="Entrez votre contenu d'e-mail HTML ici..."
          />
        </div>
      )}

      <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="font-medium">Variables Disponibles:</p>
        <ul className="mt-1 ml-4 list-disc">
          <li><code>{`{{contact_person}}`}</code> - Nom de la personne de contact du partenaire</li>
          <li><code>{`{{institution_name}}`}</code> - Nom de l'institution partenaire</li>
          <li><code>{`{{country}}`}</code> - Pays du partenaire</li>
          <li><code>{`{{city}}`}</code> - Ville du partenaire</li>
        </ul>
      </div>
    </div>
  )
}

export default EmailEditor

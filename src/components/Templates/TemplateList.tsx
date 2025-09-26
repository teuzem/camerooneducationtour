import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Copy, Eye, Frown } from 'lucide-react'
import { supabase, EmailTemplate } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import TemplateForm from './TemplateForm'
import TemplatePreview from './TemplatePreview'

const TemplateList: React.FC = () => {
  const { user } = useAuth()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error: any) {
      toast.error('Échec de la récupération des modèles')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) return

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setTemplates(templates.filter(t => t.id !== id))
      toast.success('Modèle supprimé avec succès')
    } catch (error: any) {
      toast.error('Échec de la suppression du modèle')
      console.error('Error:', error)
    }
  }

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([{
          name: `${template.name} (Copie)`,
          subject: template.subject,
          html_content: template.html_content,
          variables: template.variables,
          template_type: template.template_type,
          created_by: user?.id,
        }])

      if (error) throw error
      
      toast.success('Modèle dupliqué avec succès')
      fetchTemplates()
    } catch (error: any) {
      toast.error('Échec de la duplication du modèle')
      console.error('Error:', error)
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (showForm) {
    return (
      <TemplateForm
        template={editingTemplate}
        onSave={() => {
          setShowForm(false)
          setEditingTemplate(null)
          fetchTemplates()
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingTemplate(null)
        }}
      />
    )
  }

  if (previewTemplate) {
    return (
      <TemplatePreview
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onEdit={() => {
          setEditingTemplate(previewTemplate)
          setPreviewTemplate(null)
          setShowForm(true)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modèles d'e-mails</h1>
          <p className="text-gray-600">Créez et gérez des modèles d'e-mails réutilisables</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white px-4 py-2 rounded-lg hover:from-go2skul-green-600 hover:to-go2skul-blue-600 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Modèle</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des modèles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-go2skul-green-200 border-t-go2skul-green-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Frown className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Aucun modèle trouvé</h3>
              <p className="mt-1 text-sm">Créez votre premier modèle pour vos campagnes.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 flex mx-auto items-center space-x-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-px transition-all">
                <Plus className="w-4 h-4" /><span>Créer un Modèle</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{template.template_type.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button onClick={() => setPreviewTemplate(template)} className="p-1 text-gray-400 hover:text-go2skul-green transition-colors" title="Aperçu"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditingTemplate(template); setShowForm(true); }} className="p-1 text-gray-400 hover:text-go2skul-blue transition-colors" title="Modifier"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDuplicate(template)} className="p-1 text-gray-400 hover:text-purple-600 transition-colors" title="Dupliquer"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(template.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-grow">
                    <div>
                      <p className="text-xs text-gray-500">Sujet:</p>
                      <p className="text-sm text-gray-900 truncate">{template.subject}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Variables:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.keys(template.variables || {}).length > 0 ? Object.keys(template.variables).map((variable) => (
                          <span key={variable} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{`{{${variable}}}`}</span>
                        )) : <span className="text-xs text-gray-400">Aucune</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Créé le: {formatDate(template.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateList

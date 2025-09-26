import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Globe, Mail, Phone, Frown } from 'lucide-react'
import { supabase, Partner } from '../../lib/supabase'
import toast from 'react-hot-toast'
import PartnerForm from './PartnerForm'

const PartnerList: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPartners(data || [])
    } catch (error: any) {
      toast.error('Échec de la récupération des partenaires')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setPartners(partners.filter(p => p.id !== id))
      toast.success('Partenaire supprimé avec succès')
    } catch (error: any) {
      toast.error('Échec de la suppression du partenaire')
      console.error('Error:', error)
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (partner.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    
    const matchesFilter = filterType === 'all' || partner.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'foreign_university':
        return 'bg-blue-100 text-blue-800'
      case 'local_school':
        return 'bg-go2skul-green-100 text-go2skul-green-800'
      case 'education_agent':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'foreign_university':
        return 'Université Étrangère'
      case 'local_school':
        return 'École Locale'
      case 'education_agent':
        return 'Agent Éducatif'
      default:
        return type
    }
  }

  if (showForm) {
    return (
      <PartnerForm
        partner={editingPartner}
        onSave={() => {
          setShowForm(false)
          setEditingPartner(null)
          fetchPartners()
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingPartner(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h1>
          <p className="text-gray-600">Gérez les universités, les écoles et les agents éducatifs</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white px-4 py-2 rounded-lg hover:from-go2skul-green-600 hover:to-go2skul-blue-600 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un partenaire</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des partenaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              >
                <option value="all">Tous les types</option>
                <option value="foreign_university">Universités Étrangères</option>
                <option value="local_school">Écoles Locales</option>
                <option value="education_agent">Agents Éducatifs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-go2skul-green-200 border-t-go2skul-green-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Frown className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Aucun partenaire trouvé</h3>
              <p className="mt-1 text-sm">Ajoutez votre premier partenaire pour commencer.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 flex mx-auto items-center space-x-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-px transition-all">
                <Plus className="w-4 h-4" /><span>Ajouter un partenaire</span>
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partenaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                        {partner.contact_person && (
                          <div className="text-sm text-gray-500">{partner.contact_person}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(partner.type)}`}>
                        {getTypeLabel(partner.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {partner.email}
                        </div>
                        {partner.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {partner.phone}
                          </div>
                        )}
                        {partner.website && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Globe className="w-3 h-3 mr-1 text-gray-400" />
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:text-go2skul-green">
                              Site web
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.city && partner.country ? `${partner.city}, ${partner.country}` : partner.country || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        partner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {partner.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingPartner(partner)
                            setShowForm(true)
                          }}
                          className="text-go2skul-blue hover:text-go2skul-blue-700 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartnerList

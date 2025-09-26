import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Edit, Trash2, Mail, Calendar, Users, TrendingUp, RefreshCw, Loader2, Eye, Frown } from 'lucide-react'
import { supabase, EmailCampaign } from '../../lib/supabase'
import toast from 'react-hot-toast'
import CampaignForm from './CampaignForm'

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (error: any) {
      toast.error('Échec de la récupération des campagnes')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.')) return

    try {
      await supabase.from('campaign_recipients').delete().eq('campaign_id', id)
      const { error } = await supabase.from('email_campaigns').delete().eq('id', id)
      if (error) throw error
      setCampaigns(campaigns.filter(c => c.id !== id))
      toast.success('Campagne supprimée avec succès')
    } catch (error: any) {
      toast.error('Échec de la suppression de la campagne')
      console.error('Error:', error)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusInfo = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'draft': return { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' }
      case 'sending': return { label: 'En cours...', color: 'bg-blue-100 text-blue-800' }
      case 'scheduled': return { label: 'Planifiée', color: 'bg-yellow-100 text-yellow-800' }
      case 'sent': return { label: 'Envoyée', color: 'bg-green-100 text-green-800' }
      case 'cancelled': return { label: 'Annulée', color: 'bg-red-100 text-red-800' }
      default: return { label: status, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

  if (showForm) {
    return (
      <CampaignForm
        campaign={editingCampaign}
        onSave={() => { setShowForm(false); setEditingCampaign(null); fetchCampaigns(); }}
        onCancel={() => { setShowForm(false); setEditingCampaign(null); }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campagnes d'e-mails</h1>
          <p className="text-gray-600">Créez et gérez les campagnes pour l'Education Tour 2026</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center space-x-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-px transition-all">
          <Plus className="w-4 h-4" /><span>Nouvelle Campagne</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Rechercher des campagnes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green appearance-none">
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sending">En cours...</option>
              <option value="scheduled">Planifiée</option>
              <option value="sent">Envoyée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          <button onClick={fetchCampaigns} disabled={loading} className="p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"><RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-go2skul-green animate-spin" /></div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Frown className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Aucune campagne trouvée</h3>
              <p className="mt-1 text-sm">Créez votre première campagne pour commencer.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 flex mx-auto items-center space-x-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-px transition-all">
                <Plus className="w-4 h-4" /><span>Créer une Campagne</span>
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campagne</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => {
                  const status = getStatusInfo(campaign.status)
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div><div className="font-medium text-gray-900">{campaign.name}</div><div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>{status.label} {campaign.status === 'sending' && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.total_recipients || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">✓ {campaign.successful_sends} / ✗ {campaign.failed_sends}</div>
                        {campaign.total_recipients > 0 && <div className="text-xs text-gray-500">{Math.round((campaign.successful_sends / campaign.total_recipients) * 100)}% de succès</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{campaign.sent_at ? `Envoyée: ${formatDate(campaign.sent_at)}` : `Créée: ${formatDate(campaign.created_at)}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {campaign.status === 'sent' && (
                            <Link to={`/admin/campaigns/${campaign.id}`} className="p-1 text-gray-500 hover:text-go2skul-green" title="Voir les détails"><Eye className="w-4 h-4" /></Link>
                          )}
                          {(campaign.status === 'draft' || campaign.status === 'cancelled') && (
                            <button onClick={() => { setEditingCampaign(campaign); setShowForm(true); }} className="p-1 text-gray-500 hover:text-go2skul-blue" title="Modifier"><Edit className="w-4 h-4" /></button>
                          )}
                          {campaign.status !== 'sending' && (
                            <button onClick={() => handleDelete(campaign.id)} className="p-1 text-gray-500 hover:text-red-600" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignList

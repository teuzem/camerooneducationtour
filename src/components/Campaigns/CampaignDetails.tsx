import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, EmailCampaign, CampaignRecipient } from '../../lib/supabase'
import { Loader2, ArrowLeft, Mail, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

type CampaignWithRecipients = EmailCampaign & {
  recipients: CampaignRecipient[]
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [campaign, setCampaign] = useState<CampaignWithRecipients | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchCampaignDetails = async () => {
      setLoading(true)
      try {
        const { data: campaignData, error: campaignError } = await supabase
          .from('email_campaigns')
          .select('*')
          .eq('id', id)
          .single()

        if (campaignError) throw campaignError

        const { data: recipientsData, error: recipientsError } = await supabase
          .from('campaign_recipients')
          .select('*, partners(name)')
          .eq('campaign_id', id)
        
        if (recipientsError) throw recipientsError

        setCampaign({ ...campaignData, recipients: recipientsData || [] })
      } catch (error: any) {
        toast.error("Échec de la récupération des détails de la campagne.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignDetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-go2skul-green animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Campagne non trouvée</h2>
        <Link to="/admin/campaigns" className="mt-4 inline-block text-go2skul-blue hover:underline">
          Retour à la liste des campagnes
        </Link>
      </div>
    )
  }

  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleString('fr-FR') : '-'

  const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number | string, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
      <div className={`p-2 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/campaigns" className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux campagnes</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
        <p className="text-gray-600">{campaign.subject}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} title="Total Destinataires" value={campaign.total_recipients} color="bg-blue-100" />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-green-600" />} title="Envois Réussis" value={campaign.successful_sends} color="bg-green-100" />
        <StatCard icon={<XCircle className="w-5 h-5 text-red-600" />} title="Envois Échoués" value={campaign.failed_sends} color="bg-red-100" />
        <StatCard icon={<Clock className="w-5 h-5 text-gray-600" />} title="Date d'envoi" value={formatDate(campaign.sent_at)} color="bg-gray-100" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <h2 className="p-4 border-b text-lg font-semibold">Rapport de Livraison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message d'erreur</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaign.recipients.map(recipient => (
                <tr key={recipient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(recipient as any).partners?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recipient.status === 'sent' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Envoyé</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Échoué</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{recipient.error_message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails

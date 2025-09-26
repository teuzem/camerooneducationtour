import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Mail, Users, TrendingUp, Plus, Loader2, BarChart2, FileText, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface Stats {
  partners: number;
  campaigns: number;
  templates: number;
  totalSent: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const [partnersCount, campaignsData, templatesCount] = await Promise.all([
          supabase.from('partners').select('*', { count: 'exact', head: true }),
          supabase.from('email_campaigns').select('successful_sends'),
          supabase.from('email_templates').select('*', { count: 'exact', head: true }),
        ])

        if (partnersCount.error) throw partnersCount.error
        if (campaignsData.error) throw campaignsData.error
        if (templatesCount.error) throw templatesCount.error

        const totalSent = campaignsData.data.reduce((sum, c) => sum + (c.successful_sends || 0), 0)

        setStats({
          partners: partnersCount.count ?? 0,
          campaigns: campaignsData.data.length,
          templates: templatesCount.count ?? 0,
          totalSent: totalSent,
        })
      } catch (error: any) {
        toast.error("Échec de la récupération des statistiques du tableau de bord.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number | string, color: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  )

  const ActionCard = ({ icon, title, description, link, color }: { icon: React.ReactNode, title: string, description: string, link: string, color: string }) => (
    <Link to={link} className={`block p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all group`}>
      <div className={`p-3 rounded-full inline-block ${color}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-700">{description}</p>
    </Link>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="mt-1 text-gray-600">Bienvenue ! Voici un aperçu de votre activité.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="w-6 h-6 text-go2skul-blue" />} title="Partenaires" value={stats?.partners ?? 0} color="bg-go2skul-blue/10" />
        <StatCard icon={<Mail className="w-6 h-6 text-go2skul-green" />} title="Campagnes Créées" value={stats?.campaigns ?? 0} color="bg-go2skul-green/10" />
        <StatCard icon={<FileText className="w-6 h-6 text-go2skul-gold" />} title="Modèles" value={stats?.templates ?? 0} color="bg-go2skul-gold/10" />
        <StatCard icon={<Send className="w-6 h-6 text-purple-500" />} title="E-mails Envoyés" value={stats?.totalSent ?? 0} color="bg-purple-500/10" />
      </div>

      {/* Actions Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard 
            icon={<Plus className="w-6 h-6 text-go2skul-green" />} 
            title="Nouvelle Campagne"
            description="Créez et envoyez une nouvelle newsletter."
            link="/admin/campaigns"
            color="bg-go2skul-green/10"
          />
          <ActionCard 
            icon={<Users className="w-6 h-6 text-go2skul-blue" />} 
            title="Gérer les Partenaires"
            description="Ajoutez ou modifiez des institutions."
            link="/admin/partners"
            color="bg-go2skul-blue/10"
          />
          <ActionCard 
            icon={<FileText className="w-6 h-6 text-go2skul-gold" />} 
            title="Gérer les Modèles"
            description="Créez des modèles d'e-mails réutilisables."
            link="/admin/templates"
            color="bg-go2skul-gold/10"
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardHome

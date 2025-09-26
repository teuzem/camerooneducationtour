import React, { useState } from 'react'
import { Building, User } from 'lucide-react'
import OrganizationProfileForm from '../components/Profile/OrganizationProfileForm'
import AdminAccountForm from '../components/Profile/AdminAccountForm'

type Tab = 'organization' | 'account'

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('organization')

  const TabButton: React.FC<{ tabId: Tab; label: string; icon: React.ReactNode }> = ({ tabId, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId
          ? 'bg-go2skul-green-100 text-go2skul-green-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil et Paramètres</h1>
        <p className="mt-1 text-gray-600">Gérez les informations de votre organisation et de votre compte administrateur.</p>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 pb-4">
        <TabButton tabId="organization" label="Profil de l'Organisation" icon={<Building className="w-4 h-4" />} />
        <TabButton tabId="account" label="Mon Compte" icon={<User className="w-4 h-4" />} />
      </div>

      <div>
        {activeTab === 'organization' && <OrganizationProfileForm />}
        {activeTab === 'account' && <AdminAccountForm />}
      </div>
    </div>
  )
}

export default ProfilePage

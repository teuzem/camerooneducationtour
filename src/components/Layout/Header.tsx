import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Mail, Users, LogOut, Settings, GraduationCap, LayoutDashboard, User, ChevronDown, Building } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useOrganization } from '../../contexts/OrganizationContext'
import { motion, AnimatePresence } from 'framer-motion'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const { profile } = useOrganization()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'dashboard', label: "Tableau de bord", icon: LayoutDashboard, path: '/admin' },
    { id: 'campaigns', label: "Campagnes", icon: Mail, path: '/admin/campaigns' },
    { id: 'partners', label: 'Partenaires', icon: Users, path: '/admin/partners' },
    { id: 'templates', label: 'Modèles', icon: Settings, path: '/admin/templates' },
    { id: 'profile', label: 'Profil', icon: Building, path: '/admin/profile' },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-go2skul-green rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Go<span className="text-go2skul-green">2</span>Skul Newsletter</h1>
              <p className="text-sm text-go2skul-blue">Portail d'Administration</p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 hidden md:inline">{user?.user_metadata?.full_name || user?.email}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md bg-white border flex items-center justify-center">
                        {profile?.logo_url ? (
                          <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <Building className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'Admin'}</p>
                        <p className="text-xs text-gray-500 truncate">{profile?.name || 'Go2Skul Education'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="py-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <NavLink
                          key={tab.id}
                          to={tab.path}
                          end={tab.path === '/admin'}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-go2skul-green-50 text-go2skul-green-700'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                          }
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </NavLink>
                      )
                    })}
                  </nav>

                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

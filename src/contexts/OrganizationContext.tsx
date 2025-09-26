import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, OrganizationProfile } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface OrganizationContextType {
  profile: OrganizationProfile | null
  loading: boolean
  refetchProfile: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth()
  const [profile, setProfile] = useState<OrganizationProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('organization_profile')
        .select('*')
        .limit(1)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          console.warn("Aucun profil d'organisation trouvé. Veuillez en créer un.")
          setProfile(null)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil de l'organisation:", error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchProfile()
    } else {
      setLoading(false)
      setProfile(null)
    }
  }, [isAdmin, fetchProfile])

  const value = {
    profile,
    loading,
    refetchProfile: fetchProfile,
  }

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

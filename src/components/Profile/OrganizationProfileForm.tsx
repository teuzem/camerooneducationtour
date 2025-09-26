import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Loader2 } from 'lucide-react'
import { useOrganization } from '../../contexts/OrganizationContext'
import { supabase, OrganizationProfile } from '../../lib/supabase'
import toast from 'react-hot-toast'
import LogoUploader from './LogoUploader'

type FormData = Omit<OrganizationProfile, 'id' | 'updated_at'>

const OrganizationProfileForm: React.FC = () => {
  const { profile, loading, refetchProfile } = useOrganization()
  
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting, errors } } = useForm<FormData>()

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        slogan: profile.slogan || '',
        mission: profile.mission || '',
        logo_url: profile.logo_url || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        accreditation_details: profile.accreditation_details || '',
        social_links: {
          facebook: profile.social_links?.facebook || '',
          twitter: profile.social_links?.twitter || '',
          linkedin: profile.social_links?.linkedin || '',
          instagram: profile.social_links?.instagram || '',
        }
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: FormData) => {
    if (!profile) {
      toast.error("Le profil de l'organisation n'a pas été trouvé.")
      return
    }

    try {
      const { error } = await supabase
        .from('organization_profile')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      
      if (error) throw error

      await refetchProfile()
      toast.success('Profil de l\'organisation mis à jour avec succès !')
    } catch (error: any) {
      toast.error(`Échec de la mise à jour : ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-go2skul-green animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Informations Générales</h2>
        
        <LogoUploader
          currentLogoUrl={profile?.logo_url}
          onUploadSuccess={(url) => {
            setValue('logo_url', url)
            toast.success('Logo mis à jour. N\'oubliez pas d\'enregistrer les modifications.')
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'organisation</label>
            <input {...register('name')} className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
            <input {...register('slogan')} className="input-style" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
          <textarea {...register('mission')} rows={3} className="input-style" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Coordonnées et Localisation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input {...register('address')} className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input {...register('city')} className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <input {...register('country')} className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Détails d'agrément</label>
            <input {...register('accreditation_details')} className="input-style" />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Réseaux Sociaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input {...register('social_links.facebook')} type="url" className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
            <input {...register('social_links.twitter')} type="url" className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input {...register('social_links.linkedin')} type="url" className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input {...register('social_links.instagram')} type="url" className="input-style" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white rounded-lg hover:from-go2skul-green-600 hover:to-go2skul-blue-600 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Enregistrer les Modifications</span>
        </button>
      </div>
      <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          transition: box-shadow 0.15s ease-in-out, border-color 0.15s ease-in-out;
        }
        .input-style:focus {
          outline: none;
          border-color: #00C49A;
          box-shadow: 0 0 0 2px rgba(0, 196, 154, 0.3);
        }
      `}</style>
    </form>
  )
}

export default OrganizationProfileForm

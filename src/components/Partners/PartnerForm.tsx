import React from 'react'
import { useForm } from 'react-hook-form'
import { Save, X } from 'lucide-react'
import { supabase, Partner } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface PartnerFormProps {
  partner?: Partner | null
  onSave: () => void
  onCancel: () => void
}

interface PartnerFormData {
  name: string
  type: 'foreign_university' | 'local_school' | 'education_agent'
  email: string
  contact_person?: string
  phone?: string
  country?: string
  city?: string
  website?: string
  description?: string
  is_active: boolean
}

const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onSave, onCancel }) => {
  const isEditing = !!partner
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PartnerFormData>({
    defaultValues: partner ? {
      name: partner.name,
      type: partner.type,
      email: partner.email,
      contact_person: partner.contact_person || '',
      phone: partner.phone || '',
      country: partner.country || '',
      city: partner.city || '',
      website: partner.website || '',
      description: partner.description || '',
      is_active: partner.is_active,
    } : {
      is_active: true,
      type: 'foreign_university'
    }
  })

  const onSubmit = async (data: PartnerFormData) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('partners')
          .update(data)
          .eq('id', partner.id)

        if (error) throw error
        toast.success('Partenaire mis à jour avec succès')
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([data])

        if (error) throw error
        toast.success('Partenaire créé avec succès')
      }

      onSave()
    } catch (error: any) {
      toast.error(`Échec de la ${isEditing ? 'mise à jour' : 'création'} du partenaire`)
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Modifier le Partenaire' : 'Ajouter un Nouveau Partenaire'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Mettre à jour les informations du partenaire' : 'Ajouter une nouvelle université, école ou agent éducatif'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du Partenaire *
            </label>
            <input
              {...register('name', { required: 'Le nom du partenaire est requis' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="ex: University of Toronto"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Partenaire *
            </label>
            <select
              {...register('type', { required: 'Le type de partenaire est requis' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
            >
              <option value="">Sélectionnez un type</option>
              <option value="foreign_university">Université Étrangère</option>
              <option value="local_school">École Locale</option>
              <option value="education_agent">Agent Éducatif</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse E-mail *
            </label>
            <input
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Adresse e-mail invalide'
                }
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="contact@university.edu"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personne de Contact
            </label>
            <input
              {...register('contact_person')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de Téléphone
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <input
              {...register('country')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="Canada"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              {...register('city')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="Toronto"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Web
            </label>
            <input
              {...register('website')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="https://www.university.edu"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-go2skul-green focus:border-go2skul-green"
              placeholder="Brève description de l'institution partenaire..."
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                {...register('is_active')}
                type="checkbox"
                className="h-4 w-4 text-go2skul-green focus:ring-go2skul-green border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Partenaire actif (peut recevoir des newsletters)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white rounded-lg hover:from-go2skul-green-600 hover:to-go2skul-blue-600 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Mettre à jour' : 'Créer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default PartnerForm

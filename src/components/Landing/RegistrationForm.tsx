import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Loader2, Send } from 'lucide-react'
import { supabase, Partner } from '../../lib/supabase'
import { sendRegistrationEmails } from '../../lib/emailService'
import { generateRegistrationPDF } from '../../lib/pdfGenerator'

type PartnerType = 'foreign_university' | 'local_school'

interface FormData extends Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'is_active'> {
  type: PartnerType
}

const schema = yup.object().shape({
  type: yup.string().oneOf(['foreign_university', 'local_school']).required("Le type d'institution est requis"),
  name: yup.string().required("Le nom de l'institution est requis"),
  email: yup.string().email('Adresse e-mail invalide').required("L'e-mail est requis"),
  contact_person: yup.string().required('Le nom de la personne de contact est requis'),
  phone: yup.string().required('Le numéro de téléphone est requis'),
  country: yup.string().required('Le pays est requis'),
  city: yup.string().required('La ville est requise'),
  website: yup.string().url('URL de site web invalide').notRequired(),
  description: yup.string().notRequired(),
})

const RegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { control, register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'foreign_university',
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const toastId = toast.loading("Envoi de l'inscription...")

    try {
      const partnerData = { ...data, is_active: true }

      // 1. Save to Supabase
      const { data: newPartner, error: supabaseError } = await supabase
        .from('partners')
        .insert(partnerData)
        .select()
        .single()

      if (supabaseError) {
        throw new Error(`Erreur Supabase : ${supabaseError.message}`)
      }
      
      toast.success('Institution enregistrée avec succès !', { id: toastId })

      // 2. Send emails via EmailJS
      try {
        await sendRegistrationEmails(newPartner)
        toast.success('E-mails de confirmation envoyés !')
      } catch (emailError) {
        console.error("Erreur d'envoi d'e-mail:", emailError)
        toast.error("Échec de l'envoi des e-mails de confirmation.")
      }

      // 3. Generate and download PDF
      try {
        generateRegistrationPDF(newPartner)
        toast.success('Le PDF de confirmation est en cours de téléchargement.')
      } catch (pdfError) {
        console.error('Erreur de génération de PDF:', pdfError)
        toast.error('Échec de la génération du PDF.')
      }

      reset()
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error)
      toast.error(`Échec de l'inscription : ${error.message}`, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type d'institution *</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="flex space-x-4 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => field.onChange('foreign_university')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    field.value === 'foreign_university' ? 'bg-white shadow text-go2skul-blue' : 'text-gray-600'
                  }`}
                >
                  Université Étrangère
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('local_school')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    field.value === 'local_school' ? 'bg-white shadow text-go2skul-green' : 'text-gray-600'
                  }`}
                >
                  École Secondaire Locale
                </button>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'institution *</label>
            <input {...register('name')} placeholder={selectedType === 'foreign_university' ? 'ex: University of Toronto' : 'ex: Collège Vogt'} className="w-full input-style" />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personne de contact *</label>
            <input {...register('contact_person')} placeholder="ex: Jean Dupont" className="w-full input-style" />
            {errors.contact_person && <p className="error-message">{errors.contact_person.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de contact *</label>
            <input {...register('email')} type="email" placeholder="contact@institution.com" className="w-full input-style" />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
            <input {...register('phone')} type="tel" placeholder="+237 6XX XX XX XX" className="w-full input-style" />
            {errors.phone && <p className="error-message">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
            <input {...register('country')} placeholder={selectedType === 'foreign_university' ? 'Canada' : 'Cameroun'} className="w-full input-style" />
            {errors.country && <p className="error-message">{errors.country.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
            <input {...register('city')} placeholder={selectedType === 'foreign_university' ? 'Toronto' : 'Yaoundé'} className="w-full input-style" />
            {errors.city && <p className="error-message">{errors.city.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Web</label>
            <input {...register('website')} type="url" placeholder="https://www.institution.com" className="w-full input-style" />
            {errors.website && <p className="error-message">{errors.website.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brève description (Optionnel)</label>
            <textarea {...register('description')} rows={3} placeholder="Décrivez brièvement votre institution et vos programmes phares..." className="w-full input-style" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-go2skul-green to-go2skul-blue hover:from-go2skul-green-600 hover:to-go2skul-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-go2skul-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Soumettre l'inscription</>}
          </button>
        </div>
      </form>
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
        .error-message {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: #ef4444;
        }
      `}</style>
    </div>
  )
}

export default RegistrationForm

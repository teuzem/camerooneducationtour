import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface UserUpdateData {
  fullName: string
}

interface PasswordUpdateData {
  newPassword: ''
  confirmPassword: ''
}

const AdminAccountForm: React.FC = () => {
  const { user } = useAuth()
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors } } = useForm<UserUpdateData>({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || ''
    }
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch, reset: resetPasswordForm } = useForm<PasswordUpdateData>()

  const newPassword = watch('newPassword')

  const onUserSubmit = async (data: UserUpdateData) => {
    setIsUpdatingUser(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: data.fullName }
      })
      if (error) throw error
      toast.success('Nom mis à jour avec succès !')
    } catch (error: any) {
      toast.error(`Échec de la mise à jour : ${error.message}`)
    } finally {
      setIsUpdatingUser(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordUpdateData) => {
    setIsUpdatingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })
      if (error) throw error
      toast.success('Mot de passe mis à jour avec succès !')
      resetPasswordForm()
    } catch (error: any) {
      toast.error(`Échec de la mise à jour du mot de passe : ${error.message}`)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleUserSubmit(onUserSubmit)} className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Informations Personnelles</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input {...registerUser('fullName', { required: "Le nom complet est requis" })} className="input-style" />
          {userErrors.fullName && <p className="error-message">{userErrors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
          <input value={user?.email || ''} disabled className="input-style bg-gray-100 cursor-not-allowed" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isUpdatingUser} className="btn-primary">
            {isUpdatingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Enregistrer les Informations</span>
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Changer le Mot de Passe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input {...registerPassword('newPassword', { required: "Le nouveau mot de passe est requis", minLength: { value: 8, message: "Doit comporter au moins 8 caractères" } })} type="password" className="input-style" />
            {passwordErrors.newPassword && <p className="error-message">{passwordErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <input {...registerPassword('confirmPassword', { required: "Veuillez confirmer le mot de passe", validate: value => value === newPassword || "Les mots de passe ne correspondent pas" })} type="password" className="input-style" />
            {passwordErrors.confirmPassword && <p className="error-message">{passwordErrors.confirmPassword.message}</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isUpdatingPassword} className="btn-primary">
            {isUpdatingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Changer le Mot de Passe</span>
          </button>
        </div>
      </form>
      <style>{`
        .input-style { display: block; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
        .input-style:focus { outline: none; border-color: #00C49A; box-shadow: 0 0 0 2px rgba(0, 196, 154, 0.3); }
        .error-message { margin-top: 0.25rem; font-size: 0.875rem; color: #ef4444; }
        .btn-primary { display: inline-flex; items-center: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(to right, #00C49A, #3B82F6); color: white; border-radius: 0.5rem; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}

export default AdminAccountForm

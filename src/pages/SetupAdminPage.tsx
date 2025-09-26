import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react'

const SetupAdminPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Initialisation de la configuration de l\'administrateur...')

  useEffect(() => {
    const setupAdmin = async () => {
      setStatus('loading')
      const toastId = toast.loading('Configuration du compte administrateur...')

      try {
        const { data, error } = await supabase.auth.signUp({
          email: 'angwirhoda@go2skul.com',
          password: 'Success2025@&',
        })

        if (error) {
          // If user already exists, it's not a real error for our purpose.
          if (error.message.includes('User already registered')) {
            setStatus('success')
            setMessage('Le compte administrateur existe déjà. Aucune action n\'est requise. Vous pouvez vous connecter.')
            toast.success('Le compte administrateur existe déjà.', { id: toastId })
          } else {
            // A real database or other error occurred.
            throw error
          }
        } else if (data.session) {
          // User was created and is logged in (email confirmation is likely disabled)
          setStatus('success')
          setMessage('Compte administrateur créé avec succès ! Vous pouvez maintenant vous connecter.')
          toast.success('Compte administrateur créé !', { id: toastId })
        } else if (data.user) {
          // User was created but needs to confirm their email
          setStatus('success')
          setMessage('Compte administrateur créé ! Veuillez vérifier votre e-mail pour confirmer votre compte avant de vous connecter.')
          toast.success('Compte créé, confirmation requise.', { id: toastId })
        } else {
            throw new Error("Une réponse inattendue a été reçue lors de la création de l'utilisateur.")
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(`Erreur lors de la création du compte administrateur : ${error.message}. Assurez-vous que la migration de la base de données a été appliquée, puis réessayez.`)
        toast.error(`Échec de la création de l'administrateur: ${error.message}`, { id: toastId })
      }
    }

    setupAdmin()
  }, [])

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-go2skul-blue animate-spin" />
      case 'success':
        return <ShieldCheck className="w-16 h-16 text-go2skul-green" />
      case 'error':
        return <ShieldAlert className="w-16 h-16 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto mb-6 flex justify-center">{renderIcon()}</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuration du Compte Administrateur</h1>
        <p className="text-gray-600">{message}</p>
        {(status === 'success' || status === 'error') && (
          <a
            href="/login"
            className="mt-6 inline-block bg-go2skul-green text-white font-bold py-2 px-4 rounded hover:bg-go2skul-green-600 transition-colors"
          >
            Aller à la page de connexion
          </a>
        )}
      </div>
    </div>
  )
}

export default SetupAdminPage

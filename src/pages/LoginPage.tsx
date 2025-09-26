import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'
import { Loader2 } from 'lucide-react'

const LoginPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Une fois que l'état d'authentification est résolu et que l'utilisateur est un administrateur, naviguer.
    if (!loading && user && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [user, isAdmin, loading, navigate])

  // Afficher un indicateur de chargement pendant la vérification de la session pour éviter le clignotement du formulaire.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-go2skul-blue animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est déjà connecté en tant qu'administrateur, ne rien afficher pendant que useEffect s'occupe de la redirection.
  if (user && isAdmin) {
    return null
  }

  return <LoginForm />
}

export default LoginPage

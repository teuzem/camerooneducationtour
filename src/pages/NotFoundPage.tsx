import React from 'react'
import { Link } from 'react-router-dom'
import { Frown } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <Frown className="w-24 h-24 text-go2skul-gold mb-6" />
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page non trouvée</h2>
      <p className="text-gray-500 mt-4 max-w-sm">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        Retourner à l'accueil
      </Link>
    </div>
  )
}

export default NotFoundPage

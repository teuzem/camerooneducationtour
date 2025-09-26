import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Calendar, Target, Zap, Users, Award, LogIn } from 'lucide-react'
import RegistrationForm from '../components/Landing/RegistrationForm'

const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <div className="bg-slate-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-go2skul-green to-go2skul-blue rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Go<span className="text-go2skul-green">2</span>Skul</h1>
              <p className="text-sm text-go2skul-blue font-semibold">Cameroon Education Tour 2026</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#register"
              className="px-6 py-3 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all hidden sm:inline-block"
            >
              S'inscrire maintenant
            </a>
            <Link to="/login" className="p-3 text-gray-600 hover:text-go2skul-blue hover:bg-gray-100 rounded-full transition-colors" title="Accès Administrateur">
              <LogIn className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 text-center bg-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-go2skul-green-50 via-white to-go2skul-blue-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
            >
              Connectez-vous avec les leaders de demain au <span className="text-go2skul-green">Cameroon Education Tour 2026</span>
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Une opportunité unique pour les universités étrangères et les écoles locales de rencontrer les étudiants les plus brillants du Cameroun, leurs parents et les conseillers d'orientation.
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, delay: 0.6 }}
              className="mt-10"
            >
              <a
                href="#register"
                className="px-8 py-4 bg-gradient-to-r from-go2skul-green to-go2skul-blue text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                Réservez votre place
              </a>
            </motion.div>
          </div>
        </section>

        {/* Event Details */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <Calendar className="w-12 h-12 mx-auto text-go2skul-green" />
                <h3 className="mt-4 text-xl font-bold">Date</h3>
                <p className="mt-2 text-gray-600">Février 2026</p>
                <p className="text-sm text-gray-500">(Pendant la Fête de la Jeunesse)</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <MapPin className="w-12 h-12 mx-auto text-go2skul-blue" />
                <h3 className="mt-4 text-xl font-bold">Lieux</h3>
                <p className="mt-2 text-gray-600">Yaoundé & Douala</p>
                 <p className="text-sm text-gray-500">Les capitales économique et politique</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <Target className="w-12 h-12 mx-auto text-go2skul-gold" />
                <h3 className="mt-4 text-xl font-bold">Public Cible</h3>
                <p className="mt-2 text-gray-600">Écoles d'élite et élèves à fort potentiel</p>
                 <p className="text-sm text-gray-500">Accès exclusif via Go2Skul</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Participate */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pourquoi Participer ?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Le Cameroon Education Tour est plus qu'un simple salon. C'est une plateforme stratégique pour le développement de votre institution.
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
            >
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-go2skul-green mr-4" />
                  <h3 className="text-xl font-semibold">Accès Direct</h3>
                </div>
                <p className="mt-2 text-gray-600">Rencontrez en face à face des milliers d'élèves, parents et conseillers des meilleures écoles du pays.</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-go2skul-blue mr-4" />
                  <h3 className="text-xl font-semibold">Partenariats Stratégiques</h3>
                </div>
                <p className="mt-2 text-gray-600">Discutez avec les administrations des écoles pour des opportunités de partenariat et de recrutement continu.</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-go2skul-gold mr-4" />
                  <h3 className="text-xl font-semibold">Crédibilité Accrue</h3>
                </div>
                <p className="mt-2 text-gray-600">Augmentez la notoriété et la crédibilité de votre institution en tant que partenaire stratégique pour les études à l'étranger au Cameroun.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Registration Section */}
        <section id="register" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Inscrivez votre institution</h2>
              <p className="mt-4 text-lg text-gray-600">
                Remplissez le formulaire ci-dessous pour commencer. Un e-mail de confirmation avec les détails de votre inscription vous sera envoyé.
              </p>
            </div>
            <div className="mt-12">
              <RegistrationForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-bold">Go<span className="text-go2skul-green">2</span>Skul Education Group</h3>
          <p className="mt-2 text-gray-400">Your Study Abroad Partner</p>
          <p className="mt-4 text-gray-400">
            Pour toute question, contactez-nous : <a href="mailto:angwirhoda@go2skul.com" className="text-go2skul-green hover:underline">angwirhoda@go2skul.com</a>
          </p>
          <p className="mt-8 text-sm text-gray-500">&copy; {new Date().getFullYear()} Go2Skul Education Group. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

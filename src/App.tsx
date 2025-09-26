import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { OrganizationProvider } from './contexts/OrganizationContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import SetupAdminPage from './pages/SetupAdminPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'

// Admin Components
import DashboardHome from './components/Dashboard/DashboardHome'
import CampaignList from './components/Campaigns/CampaignList'
import CampaignDetails from './components/Campaigns/CampaignDetails'
import PartnerList from './components/Partners/PartnerList'
import TemplateList from './components/Templates/TemplateList'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/setup-admin-account" element={<SetupAdminPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            >
              <Route index element={<DashboardHome />} />
              <Route path="campaigns" element={<CampaignList />} />
              <Route path="campaigns/:id" element={<CampaignDetails />} />
              <Route path="partners" element={<PartnerList />} />
              <Route path="templates" element={<TemplateList />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
              maxWidth: '400px',
            },
            success: {
              style: {
                background: '#00C49A',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </OrganizationProvider>
    </AuthProvider>
  )
}

export default App

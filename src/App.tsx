import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Explorer from './pages/Explorer'
import StudentDashboard from './pages/StudentDashboard'
import StudentTransport from './pages/StudentTransport'
import LandlordDashboard from './pages/LandlordDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import Messages from './pages/Messages'
import ProviderMarketplace from './pages/ProviderMarketplace'
import PropertyAds from './pages/PropertyAds'
import Earnings from './pages/Earnings'
import Signup from './pages/Signup'
import PropertyDetail from './pages/PropertyDetail'
import StudentApplications from './pages/StudentApplications'
import StudentFavorites from './pages/StudentFavorites'
import TransportDashboard from './pages/TransportDashboard'
import { MobileTabs } from './components/MobileTabs'

function App() {
  return (
    <AuthProvider>
      <MobileTabs />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/property/:id" element={<PropertyDetail />} />

        {/* Gated Routes */}
        <Route 
          path="/explorer" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Explorer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentFavorites />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transport" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentTransport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/landlord" 
          element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <LandlordDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/provider" 
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute allowedRoles={['student', 'landlord', 'provider']}>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute allowedRoles={['landlord', 'provider']}>
              <ProviderMarketplace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ads" 
          element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <PropertyAds />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/earnings" 
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <Earnings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transport-hub" 
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <TransportDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback & Legacy Redirects */}
        <Route path="/handyman" element={<Navigate to="/provider" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

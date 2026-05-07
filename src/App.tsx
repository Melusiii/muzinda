import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { RoleGuard } from './components/RoleGuard'
import { LoadingScreen } from './components/LoadingScreen'
import { ScrollToTop } from './components/ScrollToTop'
import { ErrorBoundary } from 'react-error-boundary'

// Premium Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })))
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })))
const Explorer = lazy(() => import('./pages/Explorer').then(m => ({ default: m.Explorer })))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then(m => ({ default: m.StudentDashboard })))
const StudentTransport = lazy(() => import('./pages/StudentTransport').then(m => ({ default: m.StudentTransport })))
const LandlordDashboard = lazy(() => import('./pages/LandlordDashboard').then(m => ({ default: m.LandlordDashboard })))
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })))
const HandymanDashboard = lazy(() => import('./pages/HandymanDashboard').then(m => ({ default: m.HandymanDashboard })))
const Messages = lazy(() => import('./pages/Messages').then(m => ({ default: m.Messages })))
const ProviderMarketplace = lazy(() => import('./pages/ProviderMarketplace').then(m => ({ default: m.ProviderMarketplace })))
const PropertyAds = lazy(() => import('./pages/PropertyAds').then(m => ({ default: m.PropertyAds })))
const Earnings = lazy(() => import('./pages/Earnings').then(m => ({ default: m.Earnings })))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail').then(m => ({ default: m.PropertyDetail })))
const StudentApplications = lazy(() => import('./pages/StudentApplications').then(m => ({ default: m.StudentApplications })))
const StudentFavorites = lazy(() => import('./pages/StudentFavorites').then(m => ({ default: m.StudentFavorites })))
const TransportDashboard = lazy(() => import('./pages/TransportDashboard').then(m => ({ default: m.TransportDashboard })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))
const AccountSettings = lazy(() => import('./pages/AccountSettings').then(m => ({ default: m.AccountSettings })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { MobileBottomDock } from './components/MobileBottomDock'

function ErrorFallback({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bright p-6 text-center font-dm-sans">
      <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-primary/10 shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-primary-dark font-manrope uppercase italic tracking-tighter">Portal Error</h2>
          <p className="text-sm text-primary-dark/40 font-bold leading-relaxed px-4">
            {error.message || "We've encountered a minor performance regression. Our team is already stabilizing the experience."}
          </p>
        </div>
        <button 
          onClick={resetErrorBoundary}
          className="bg-primary text-white w-full py-4 rounded-2xl font-bold font-manrope shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase text-[10px] tracking-widest"
        >
          Restart Portal
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/property/:id" element={<PropertyDetail />} />

            {/* Student Gated Routes */}
            <Route path="/explorer" element={<Explorer />} />
            <Route 
              path="/dashboard" 
              element={
                <RoleGuard allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <RoleGuard allowedRoles={['student']}>
                  <StudentApplications />
                </RoleGuard>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <RoleGuard allowedRoles={['student']}>
                  <StudentFavorites />
                </RoleGuard>
              } 
            />
            <Route 
              path="/transport" 
              element={
                <RoleGuard allowedRoles={['student']}>
                  <StudentTransport />
                </RoleGuard>
              } 
            />

            {/* Landlord Gated Routes */}
            <Route 
              path="/landlord" 
              element={
                <RoleGuard allowedRoles={['landlord']}>
                  <LandlordDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <RoleGuard allowedRoles={['landlord', 'provider']}>
                  <ProviderMarketplace />
                </RoleGuard>
              } 
            />
            <Route 
              path="/ads" 
              element={
                <RoleGuard allowedRoles={['landlord']}>
                  <PropertyAds />
                </RoleGuard>
              } 
            />

            {/* Provider Specialized Routes */}
            <Route 
              path="/provider" 
              element={
                <RoleGuard allowedRoles={['provider']}>
                  <ProviderDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/handyman" 
              element={
                <RoleGuard allowedRoles={['provider']}>
                  <HandymanDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/transport-hub" 
              element={
                <RoleGuard allowedRoles={['provider']}>
                  <TransportDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/earnings" 
              element={
                <RoleGuard allowedRoles={['provider']}>
                  <Earnings />
                </RoleGuard>
              } 
            />

            {/* Shared Utility Routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute allowedRoles={['student', 'landlord', 'provider']}>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student', 'landlord', 'provider']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['student', 'landlord', 'provider']}>
                  <AccountSettings />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navbar />
          <Sidebar />
          <MobileBottomDock />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

import { Component, type ReactNode, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { LoadingScreen } from './components/LoadingScreen'

// Premium Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })))
const Explorer = lazy(() => import('./pages/Explorer').then(m => ({ default: m.Explorer })))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then(m => ({ default: m.StudentDashboard })))
const StudentTransport = lazy(() => import('./pages/StudentTransport').then(m => ({ default: m.StudentTransport })))
const LandlordDashboard = lazy(() => import('./pages/LandlordDashboard').then(m => ({ default: m.LandlordDashboard })))
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })))
const Messages = lazy(() => import('./pages/Messages').then(m => ({ default: m.Messages })))
const ProviderMarketplace = lazy(() => import('./pages/ProviderMarketplace').then(m => ({ default: m.ProviderMarketplace })))
const PropertyAds = lazy(() => import('./pages/PropertyAds').then(m => ({ default: m.PropertyAds })))
const Earnings = lazy(() => import('./pages/Earnings').then(m => ({ default: m.Earnings })))
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail').then(m => ({ default: m.PropertyDetail })))
const StudentApplications = lazy(() => import('./pages/StudentApplications').then(m => ({ default: m.StudentApplications })))
const StudentFavorites = lazy(() => import('./pages/StudentFavorites').then(m => ({ default: m.StudentFavorites })))
const TransportDashboard = lazy(() => import('./pages/TransportDashboard').then(m => ({ default: m.TransportDashboard })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-bright p-6 text-center font-dm-sans">
          <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-primary/10 shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-primary-dark font-manrope">Initialization Error</h2>
              <p className="text-sm text-primary-dark/40 font-bold leading-relaxed px-4">
                We've encountered a minor performance regression. Our team is already stabilizing the experience.
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white w-full py-4 rounded-2xl font-bold font-manrope shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Restart Portal
            </button>
            <p className="text-[10px] font-black uppercase text-primary-dark/20 tracking-tighter pt-4">
              Error Hash: {this.state.error?.message.substring(0, 16)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
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

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student', 'landlord', 'provider']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Fallback & Legacy Redirects */}
            <Route path="/handyman" element={<Navigate to="/provider" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

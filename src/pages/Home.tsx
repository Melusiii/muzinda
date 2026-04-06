import { Layout } from '../components/Layout'
import { Hero } from '../components/Hero'
import { VerifiedListings } from '../components/VerifiedListings'
import { BentoServices } from '../components/BentoServices'
import { Neighborhoods } from '../components/Neighborhoods'
import { StudentFavorites } from '../components/StudentFavorites'
import { motion } from 'framer-motion'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Home = () => {
  const { isAuthenticated, user, loading } = useAuth()

  // Redirect authenticated users to their dashboard immediately
  if (!loading && isAuthenticated && user) {
    if (user.role === 'student') return <Navigate to="/dashboard" replace />
    if (user.role === 'landlord') return <Navigate to="/landlord" replace />
    if (user.role === 'provider') {
      return <Navigate to={user.category === 'transport' ? '/transport-hub' : '/provider'} replace />
    }
  }

  return (
    <Layout>
      <Hero />
      
      <VerifiedListings />

      <Neighborhoods />

      <BentoServices />
      
      <StudentFavorites />

      {/* Final CTA */}
      <section className="py-32 px-6 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          <h2 className="font-manrope text-5xl md:text-7xl font-extrabold text-primary-dark tracking-tighter">
            Ready to find your <br />
            <span className="text-[#4F7C2C] italic">perfect home?</span>
          </h2>
          <p className="text-primary-dark/50 text-xl font-dm-sans max-w-2xl mx-auto leading-relaxed">
            Join the most trusted student network in Mutare. Secure your stay, book repairs, and ride with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="bg-[#1E3011] text-white px-12 py-5 rounded-2xl font-bold font-manrope text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Get Started Now
            </Link>
            <Link 
              to="/explorer"
              className="bg-white text-primary-dark border border-primary/10 px-12 py-5 rounded-2xl font-bold font-manrope text-lg hover:bg-[#F8F9F8] transition-all"
            >
              Browse Homes
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  )
}

export default Home

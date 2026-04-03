import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { SettingsModal } from './SettingsModal'

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Browse Home', path: '/' },
        { name: 'Explore Housing', path: '/explorer' },
      ]
    }
    
    // Auth-only links
    if (user?.role === 'student') {
      return [
        { name: 'Home', path: '/dashboard' },
        { name: 'Applications', path: '/applications' },
        { name: 'Favorites', path: '/favorites' },
        { name: 'Find Housing', path: '/explorer' },
        { name: 'Messages', path: '/messages' },
        { name: 'Shuttle', path: '/transport' },
        { name: 'Settings', action: 'settings' },
      ]
    }
    
    if (user?.role === 'landlord') {
      return [
        { name: 'Home', path: '/landlord' },
        { name: 'Property Ads', path: '/ads' },
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Messages', path: '/messages' },
        { name: 'Settings', action: 'settings' },
      ]
    }

    if (user?.role === 'provider') {
      return [
        { name: 'Home', path: '/provider' },
        { name: 'Gig Finder', path: '/marketplace' },
        { name: 'Earnings', path: '/earnings' },
        { name: 'Messages', path: '/messages' },
        { name: 'Settings', action: 'settings' },
      ]
    }

    return []
  }

  const navLinks = getNavLinks()

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-primary/5" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={user ? (user.role === 'student' ? '/dashboard' : (user.role === 'landlord' ? '/landlord' : '/provider')) : '/'}>
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.action === 'settings' ? (
              <button
                key={link.name}
                onClick={() => setIsSettingsOpen(true)}
                className="text-primary-dark/70 hover:text-primary font-bold text-sm tracking-tight transition-colors"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path || '#'}
                className="text-primary-dark/70 hover:text-primary font-bold text-sm tracking-tight transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <>
              {/* Desktop Profile & Logout */}
              <div className="hidden md:flex items-center gap-3 pl-4">
                <div className="text-right">
                   <p className="text-xs font-bold text-primary-dark leading-none">{user?.name}</p>
                   <p className="text-[10px] font-bold text-primary-dark/40 uppercase tracking-widest mt-1">{user?.role}</p>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-3 bg-accent-amber/5 text-accent-amber rounded-xl hover:bg-accent-amber/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>

              {/* Mobile Profile Thumbnail beside Hamburger */}
              <div className="md:hidden flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden shadow-sm">
                   {user?.avatar_url ? (
                     <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-primary font-black uppercase">{user?.name.charAt(0)}</span>
                   )}
                 </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Get Started
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden p-3 bg-surface-bright rounded-xl text-primary-dark/70 transition-all active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-primary/5 p-8 flex flex-col gap-6 origin-top"
          >
            {isAuthenticated && (
              <div className="pb-4 border-b border-primary/5 mb-2">
                 <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">Welcome,</p>
                 <h3 className="text-2xl font-black font-manrope text-primary-dark truncate">{user?.name}</h3>
              </div>
            )}

            {navLinks.map((link) => (
              link.action === 'settings' ? (
                <button
                  key={link.name}
                  onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-primary-dark/70 hover:text-primary text-xl font-extrabold tracking-tight text-left"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path || '#'}
                  className="text-primary-dark/70 hover:text-primary text-xl font-extrabold tracking-tight text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {isAuthenticated ? (
               <div className="pt-6 mt-4 border-t border-primary/5 flex flex-col">
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }}
                    className="flex items-center gap-3 text-accent-amber font-extrabold tracking-tight text-xl transition-all"
                  >
                    <LogOut size={24} /> Log Out
                  </button>
               </div>
            ) : (
               <div className="pt-6 border-t border-primary/5 flex flex-col gap-4">
                  <Link to="/auth" className="text-center py-4 bg-primary text-white rounded-2xl font-bold text-lg" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  )
}

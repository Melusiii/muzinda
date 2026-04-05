import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { LogOut, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { SettingsModal } from './SettingsModal'
import { NotificationsModal } from './NotificationsModal'
import { useNotifications } from '../hooks/useSupabase'

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { unreadCount } = useNotifications()
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
      "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 md:py-6",
      isScrolled 
        ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-primary/5 py-3 md:py-4" 
        : "bg-white/40 backdrop-blur-md border-b border-white/10"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={user?.role === 'student' ? '/dashboard' : (user?.role === 'landlord' ? '/landlord' : (user?.role === 'provider' ? '/provider' : '/'))}>
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
                    <p className="text-xs font-bold text-primary-dark leading-none">{user?.name || 'User'}</p>
                    <p className="text-[10px] font-bold text-primary-dark/40 uppercase tracking-widest mt-1">{user?.role}</p>
                 </div>
                 <button 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="p-2 text-primary-dark/40 hover:text-primary relative transition-colors"
                 >
                   <Bell size={20} />
                   {unreadCount > 0 && (
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-white" />
                   )}
                 </button>
                 <button 
                   onClick={() => { logout(); navigate('/'); }}
                   className="p-3 bg-accent-amber/5 text-accent-amber rounded-xl hover:bg-accent-amber/10 transition-all"
                   title="Logout"
                 >
                   <LogOut size={20} />
                 </button>
               </div>

              {/* Mobile Profile Indicator */}
              <div className="md:hidden flex items-center gap-3">
                  <button 
                   onClick={() => setIsSettingsOpen(true)}
                   className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden shadow-sm"
                  >
                    {user?.avatar_url ? (
                     <img src={user.avatar_url} alt={user.name || 'User'} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-primary font-black uppercase text-xs">{((user as any)?.name || (user as any)?.email || 'U').charAt(0)}</span>
                   )}
                  </button>
               </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth" className="bg-primary text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
       <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </nav>
  )
}

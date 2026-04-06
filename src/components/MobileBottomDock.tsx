import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, DollarSign, Compass, MessageSquare, Bus, Wrench, CreditCard, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

export const MobileBottomDock = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (location.pathname === '/messages') {
      setIsVisible(true)
      return
    }

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY - 10) {
          setIsVisible(true)
        }
        setLastScrollY(currentScrollY)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, location.pathname])

  if (!isAuthenticated) return null

  const getDockLinks = () => {
    if (user?.role === 'student') {
      return [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Explore', path: '/explorer', icon: Compass },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        { name: 'Shuttle', path: '/transport', icon: Bus },
        { name: 'Profile', path: '/profile', icon: User },
      ]
    }

    if (user?.role === 'landlord') {
      return [
        { name: 'Home', path: '/landlord', icon: LayoutDashboard },
        { name: 'Applicants', path: '/landlord?tab=applications', icon: Users },
        { name: 'Earnings', path: '/landlord?tab=finance', icon: DollarSign },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        { name: 'Profile', path: '/profile', icon: User },
      ]
    }

    if (user?.role === 'provider') {
      return [
        { name: 'Home', path: '/provider', icon: LayoutDashboard },
        { name: 'Gigs', path: '/marketplace', icon: Wrench },
        { name: 'Earnings', path: '/earnings', icon: CreditCard },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        { name: 'Profile', path: '/profile', icon: User },
      ]
    }

    return []
  }

  const links = getDockLinks()
  if (links.length === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-3 bg-white/90 backdrop-blur-2xl border border-primary/5 shadow-2xl rounded-full px-2 py-2 flex items-center justify-around">
            {links.map((link) => {
              // Active check: exact match for most, startsWith for base paths
              // Active check: exact match for most, startsWith for base paths
              const isActive = (location.pathname + location.search) === link.path ||
                (link.path !== '/' && (location.pathname + location.search).startsWith(link.path) &&
                  !links.some(l => l.path !== link.path && (location.pathname + location.search).startsWith(l.path) && l.path.length > link.path.length))

              return (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={cn(
                    'flex flex-col items-center gap-1 flex-1 py-2 px-1 transition-all relative rounded-full min-h-[44px] justify-center',
                    isActive ? 'text-primary' : 'text-primary-dark/40'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDock"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <link.icon
                    size={20}
                    className={cn(
                      'transition-transform',
                      isActive ? 'scale-110' : ''
                    )}
                  />
                  <span className="text-[10px] font-bold tracking-tight leading-none">{link.name}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

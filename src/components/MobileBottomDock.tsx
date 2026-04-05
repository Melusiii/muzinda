import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Compass, MessageSquare, Bus, Check, ShieldCheck, Wrench, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

export const MobileBottomDock = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false) // Scrolling down
      } else {
        setIsVisible(true) // Scrolling up
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  if (!isAuthenticated) return null

  const getDockLinks = () => {
    if (user?.role === 'student') {
      return [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Explore', path: '/explorer', icon: Compass },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        { name: 'Shuttle', path: '/transport', icon: Bus },
        { name: 'Apps', path: '/applications', icon: Check },
      ]
    }
    
    if (user?.role === 'landlord') {
      return [
        { name: 'Home', path: '/landlord', icon: LayoutDashboard },
        { name: 'Ads', path: '/ads', icon: ShieldCheck },
        { name: 'Market', path: '/marketplace', icon: Wrench },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
      ]
    }

    if (user?.role === 'provider') {
      return [
        { name: 'Home', path: '/provider', icon: LayoutDashboard },
        { name: 'Gigs', path: '/marketplace', icon: Wrench },
        { name: 'Earnings', path: '/earnings', icon: CreditCard },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[40] md:hidden w-[90%] max-w-sm"
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-primary/5 shadow-2xl rounded-full px-4 py-3 flex items-center justify-between gap-1 overflow-hidden">
            {links.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex flex-col items-center gap-1 flex-1 py-1 transition-all relative group",
                    isActive ? "text-primary" : "text-primary-dark/40"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDock"
                      className="absolute -top-3 w-8 h-1 bg-primary rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <link.icon 
                    size={20} 
                    className={cn(
                      "transition-transform",
                      isActive ? "scale-110" : "group-active:scale-90"
                    )} 
                  />
                  <span className="text-[10px] font-bold tracking-tight">{link.name}</span>
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

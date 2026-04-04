import { motion, AnimatePresence } from 'framer-motion'
import { Home, Compass, Bus, User, Building, MessageSquare, Wrench, ShieldCheck, FileText, Star, LogOut, X, Settings, ArrowRight, Bell, Shield } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { SettingsModal } from './SettingsModal'
import { useState } from 'react'

export const MobileTabs = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  if (!isAuthenticated || !user) return null

  const getTabs = () => {
    switch (user.role) {
      case 'student':
        return [
          { id: 'home', icon: Home, label: 'Hub', path: '/dashboard' },
          { id: 'explore', icon: Compass, label: 'Search', path: '/explorer' },
          { id: 'apps', icon: FileText, label: 'Apps', path: '/applications' },
          { id: 'transport', icon: Bus, label: 'Shuttle', path: '/transport' },
          { id: 'profile', icon: User, label: 'Profile', action: () => setIsMoreOpen(true) },
        ]
      case 'landlord':
        return [
          { id: 'home', icon: Home, label: 'Hub', path: '/landlord' },
          { id: 'ads', icon: Building, label: 'Ads', path: '/ads' },
          { id: 'messages', icon: MessageSquare, label: 'Chat', path: '/messages' },
          { id: 'market', icon: Compass, label: 'Market', path: '/marketplace' },
          { id: 'profile', icon: User, label: 'Profile', action: () => setIsMoreOpen(true) },
        ]
      case 'provider':
        return [
          { id: 'home', icon: Home, label: 'Hub', path: '/provider' },
          { id: 'earnings', icon: Wrench, label: 'Income', path: '/earnings' },
          { id: 'control', icon: ShieldCheck, label: 'Fleet', path: '/transport-hub' },
          { id: 'messages', icon: MessageSquare, label: 'Chat', path: '/messages' },
          { id: 'profile', icon: User, label: 'Profile', action: () => setIsMoreOpen(true) },
        ]
      default:
        return []
    }
  }

  const tabs = getTabs()
  if (tabs.length === 0) return null

  const moreLinks = [
    { label: 'Favorites', icon: Star, path: '/favorites', roles: ['student'] },
    { label: 'Messages', icon: MessageSquare, path: '/messages', roles: ['student'] },
    { label: 'Notifications', icon: Bell },
    { label: 'Security', icon: ShieldCheck },
    { label: 'Applications', icon: FileText, path: '/applications', roles: ['landlord'] },
    { label: 'Settings', icon: Settings, action: () => { setIsSettingsOpen(true); setIsMoreOpen(false); } },
  ].filter(link => !link.roles || link.roles.includes(user.role))

  return (
    <>
      {/* Premium Compact Tab Bar - FIXED HEIGHT & CENTERING */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-[60] px-6 pointer-events-none flex justify-center">
        <nav className="bg-[#1E3011]/98 backdrop-blur-3xl border border-white/10 h-16 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex justify-around items-center pointer-events-auto max-w-[360px] w-full relative overflow-hidden">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path
            
            const content = (
              <div className="flex flex-col items-center justify-center gap-0.5 relative h-full px-2 min-w-[56px] transition-all duration-300">
                <tab.icon 
                  size={18} 
                  className={cn(
                    "transition-all duration-300 relative z-10",
                    isActive ? "text-white scale-110" : "text-white/30"
                  )} 
                />
                <span className={cn(
                  "text-[7px] font-black uppercase tracking-[0.1em] transition-all duration-300 relative z-10",
                  isActive ? "text-white opacity-100" : "text-white/20 opacity-0 h-0 scale-75 overflow-hidden"
                )}>
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white/5 rounded-xl mx-1 my-1"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            )

            return tab.path ? (
              <Link 
                key={tab.id} 
                to={tab.path} 
                className="h-full flex items-center justify-center"
              >
                {content}
              </Link>
            ) : (
              <button 
                key={tab.id} 
                onClick={tab.action}
                className="h-full flex items-center justify-center"
              >
                {content}
              </button>
            )
          })}
        </nav>
      </div>

      {/* More Hub Drawer (Stays Full Width for Mobile Ergonomics) */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[80] bg-[#F8F9F8] rounded-t-[3.5rem] p-8 md:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="w-12 h-1.5 bg-primary-dark/10 rounded-full mx-auto mb-10" />
              
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary/5 p-1 border border-primary/10 shadow-inner">
                    <div className="w-full h-full rounded-[1.7rem] bg-white flex items-center justify-center overflow-hidden">
                       {user.avatar_url ? (
                         <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-2xl font-black text-primary">{user.name.charAt(0)}</span>
                       )}
                    </div>
                 </div>
                 <div className="flex-1">
                    <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tight leading-none">{user.name}</h3>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2">Muzinda {user.role} Member</p>
                 </div>
                 <button 
                   onClick={() => setIsMoreOpen(false)}
                   className="p-4 bg-primary-dark/5 rounded-2xl hover:bg-primary-dark/10 transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-10">
                {moreLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (link.path) {
                        navigate(link.path)
                        setIsMoreOpen(false)
                      } else if (link.action) {
                        link.action()
                      }
                    }}
                    className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-primary/5 hover:border-primary/10 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <link.icon size={22} />
                       </div>
                       <span className="text-lg font-black text-primary-dark tracking-tight">{link.label}</span>
                    </div>
                    <ArrowRight size={18} className="text-primary-dark/20 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { logout(); navigate('/'); setIsMoreOpen(false); }}
                className="w-full py-6 flex items-center justify-center gap-3 text-accent-amber font-black tracking-tight text-lg bg-accent-amber/5 rounded-[2rem] hover:bg-accent-amber/10 transition-all border border-accent-amber/10"
              >
                <LogOut size={20} /> Log Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}

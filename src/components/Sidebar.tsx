import { LayoutDashboard, Users, DollarSign, Compass, Bus, MessageSquare, Settings, LogOut, Wrench, Heart, Check, Bell } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { NotificationsModal } from './NotificationsModal'
import { useNotifications } from '../hooks/useSupabase'

export const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const location = useLocation()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  if (!isAuthenticated) return null

  const getMenuSections = () => {
    const primary = [
      { icon: LayoutDashboard, label: 'Home', href: user?.role === 'student' ? '/dashboard' : `/${user?.role === 'provider' ? 'provider' : user?.role}` },
      { icon: MessageSquare, label: 'Messages', href: '/messages' },
    ]

    const platform: any[] = []
    if (user?.role === 'student') {
      platform.push(
        { icon: Check, label: 'Applications', href: '/applications' },
        { icon: Heart, label: 'Favorites', href: '/favorites' },
        { icon: Compass, label: 'Explorer', href: '/explorer' },
        { icon: Bus, label: 'Shuttle', href: '/transport' }
      )
    } else if (user?.role === 'landlord') {
      platform.push(
        { icon: Users, label: 'Applications', href: '/landlord?tab=applications' },
        { icon: DollarSign, label: 'Finance', href: '/landlord?tab=finance' }
      )
    } else if (user?.role === 'provider') {
      platform.push(
        { icon: Bus, label: 'Transport Hub', href: '/transport-hub' },
        { icon: Wrench, label: 'Earnings', href: '/earnings' }
      )
    }

    return { primary, platform }
  }

  const { primary, platform } = getMenuSections()

  const renderLink = (item: any, idx: number) => {
    const isActive = item.href && (location.pathname + location.search) === item.href;
    return (
      <Link
        key={idx}
        to={item.href || '#'}
        className={cn(
          "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group",
          isActive
            ? "bg-primary text-white shadow-lg shadow-primary/20" 
            : "text-primary-dark/40 hover:bg-primary/5 hover:text-primary"
        )}
      >
        <item.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary-dark/40 group-hover:text-primary")} />
        {item.label}
      </Link>
    )
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-primary/5 h-screen fixed left-0 top-0 z-40">
        <div className="p-8 h-full flex flex-col">
          <div className="mb-8">
            <Link to={user?.role === 'student' ? '/dashboard' : (user?.role === 'landlord' ? '/landlord' : (user?.role === 'provider' ? '/provider' : '/'))}>
              <Logo />
            </Link>
          </div>

          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="flex items-center justify-between w-full p-4 bg-primary/5 rounded-[1.5rem] border border-primary/10 hover:bg-primary/10 transition-all group mb-8 relative"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-primary-dark tracking-tight">Notifications</p>
                <p className="text-[8px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Institutional Alerts</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">
                {unreadCount}
              </span>
            )}
          </button>

          <nav className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-hide">
            {/* PRIMARY SECTION */}
            <div className="space-y-3">
               <p className="px-6 text-[9px] font-black text-primary-dark/20 uppercase tracking-[0.2em]">Primary</p>
               <div className="space-y-1">
                 {primary.map((item, idx) => renderLink(item, idx))}
               </div>
            </div>

            {/* PLATFORM SECTION */}
            <div className="space-y-3">
               <p className="px-6 text-[9px] font-black text-primary-dark/20 uppercase tracking-[0.2em]">Platform</p>
               <div className="space-y-1">
                 {platform.map((item, idx) => renderLink(item, idx))}
               </div>
            </div>
          </nav>

          <div className="mt-auto pt-8 border-t border-primary/5 space-y-6">
            <div className="space-y-3">
               <p className="px-6 text-[9px] font-black text-primary-dark/20 uppercase tracking-[0.2em]">Account</p>
               <div className="space-y-1">
                  <Link 
                    to="/settings"
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group",
                      location.pathname === '/settings' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-primary-dark/40 hover:bg-surface-bright"
                    )}
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-accent-amber hover:bg-accent-amber/5 transition-all text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
               </div>
            </div>
          </div>
        </div>
      </aside>

      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  )
}

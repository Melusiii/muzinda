import { LayoutDashboard, Compass, Bus, Map, MessageSquare, Settings, LogOut, Wrench, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { SettingsModal } from './SettingsModal'
import { MapModal } from './MapModal'

export const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  const getMenuItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: 'Overview', href: user?.role === 'student' ? '/dashboard' : `/${user?.role === 'provider' ? 'provider' : user?.role}` },
      { icon: MessageSquare, label: 'Messages', href: '/messages' },
    ]

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { icon: CheckCircle2, label: 'Applications', href: '/applications' },
        { icon: Heart, label: 'Favorites', href: '/favorites' },
        { icon: Compass, label: 'Explorer', href: '/explorer' },
        { icon: Bus, label: 'Shuttle', href: '/transport' },
        { icon: Map, label: 'AU Map', onClick: () => setIsMapOpen(true) },
      ]
    }

    if (user?.role === 'landlord') {
      return [
        ...baseItems,
        { icon: ShieldCheck, label: 'Property Ads', href: '/ads' },
        { icon: Wrench, label: 'Marketplace', href: '/marketplace' },
      ]
    }

    if (user?.role === 'provider') {
      return [
        ...baseItems,
        { icon: Compass, label: 'Gig Finder', href: '/marketplace' },
        { icon: Wrench, label: 'Earnings', href: '/earnings' },
      ]
    }

    return baseItems
  }

  const menuItems = getMenuItems()

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-primary/5 h-screen fixed left-0 top-0 z-40">
        <div className="p-8 h-full flex flex-col">
          <div className="mb-12">
            <Link to={user ? (user.role === 'student' ? '/dashboard' : (user.role === 'landlord' ? '/landlord' : '/provider')) : '/'}>
              <Logo />
            </Link>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item: any, idx) => {
              const isActive = item.href && location.pathname === item.href;
              const content = (
                <>
                  <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary-dark/40 group-hover:text-primary")} />
                  {item.label}
                </>
              );

              if (item.onClick) {
                return (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-primary-dark/40 hover:bg-primary/5 hover:text-primary transition-all group text-left"
                  >
                    {content}
                  </button>
                )
              }

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
                  {content}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-primary/5 space-y-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-primary-dark/40 hover:bg-surface-bright transition-all text-left"
            >
              <Settings size={20} />
              Settings
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-accent-amber hover:bg-accent-amber/5 transition-all text-left"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </>
  )
}

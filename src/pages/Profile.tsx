import { motion } from 'framer-motion'
import { Sidebar } from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { 
  User, 
  Settings, 
  Bell, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Calendar,
  ClipboardList
} from 'lucide-react'
import { useState } from 'react'
import { SettingsModal } from '../components/SettingsModal'
import { NotificationsModal } from '../components/NotificationsModal'
import { useNotifications } from '../hooks/useSupabase'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { PageHeader } from '../components/PageHeader'

export const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  if (!user) return null

  const menuItems = [
    { label: 'Favorites', icon: Star, path: '/favorites', color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
    { label: 'My Applications', icon: ClipboardList, path: '/applications', color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Messages', icon: MessageSquare, path: '/messages', color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Notifications', icon: Bell, action: () => setIsNotificationsOpen(true), badge: unreadCount, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Security', icon: ShieldCheck, path: '/settings', color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
    { label: 'Account Settings', icon: Settings, path: '/settings', color: 'text-primary-dark/60', bg: 'bg-gray-100' },
  ]

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-32 md:pt-32 md:p-8 min-h-screen relative z-10 pb-32">
        {/* Header Section */}
        <PageHeader 
          title="Digital Identity" 
          subtitle="Official Institutional Credentials"
          className="max-w-2xl"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl space-y-12"
        >
          {/* Identity Card */}
          <div className="text-center space-y-6">
             <div className="relative inline-block">
                <div className="w-32 h-32 rounded-[3.5rem] bg-white p-1 shadow-2xl shadow-primary/20 border border-primary/10">
                   <div className="w-full h-full rounded-[3.2rem] bg-primary/5 flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-primary/20" />
                      )}
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary border border-primary/5">
                   <Sparkles size={18} />
                </div>
             </div>

             <div className="space-y-2">
                <h1 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter uppercase">{user.name}</h1>
                <div className="flex items-center justify-center gap-3">
                   <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                      Muzinda {user.role}
                   </span>
                   {user.gender && (
                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-primary-dark/40 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {user.gender === 'male' ? <span className="text-blue-500">♂</span> : <span className="text-pink-500">♀</span>}
                        {user.gender}
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Institutional Status Snapshot */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-2">
                   <Calendar size={18} />
                </div>
                <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-widest leading-none">Member Since</p>
                <p className="text-sm font-manrope font-black text-primary-dark capitalize italic">April 2026</p>
             </div>
             <div className="bg-primary-dark p-6 rounded-[2.5rem] shadow-xl space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-transform" />
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary mb-2">
                   <ShieldCheck size={18} />
                </div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">Trust Level</p>
                <p className="text-sm font-manrope font-black text-white italic">Institutional</p>
             </div>
          </div>

          {/* Premium Bento Menu */}
          <div className="space-y-4">
             <h3 className="text-xs font-black text-primary-dark/20 uppercase tracking-[0.3em] font-manrope pl-4">Account Navigator</h3>
             <div className="grid grid-cols-1 gap-3">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.path) {
                         if (item.path === '#') return
                         navigate(item.path)
                      } else if (item.action) {
                         item.action()
                      }
                    }}
                    className={cn(
                      "group flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-primary/5 hover:border-primary/20 transition-all shadow-sm active:scale-[0.98] outline-none",
                      item.path === '#' && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-5">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center relative shadow-sm", item.bg, item.color)}>
                          <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                               {item.badge}
                            </span>
                          )}
                       </div>
                       <div>
                         <p className="text-lg font-black text-primary-dark tracking-tight">{item.label}</p>
                         {item.path === '#' && <p className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-0.5">Coming Soon</p>}
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-primary-dark/10 group-hover:text-primary transition-colors group-active:translate-x-1" />
                  </button>
                ))}
             </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 space-y-6">
             <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full py-6 bg-red-500/5 text-red-500 border-2 border-dashed border-red-500/10 rounded-[2.5rem] font-manrope font-black text-xs uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl shadow-red-500/5"
             >
                <LogOut size={18} /> Kill Session / Log Out
             </button>
             
             <p className="text-center text-[10px] font-bold text-primary-dark/20 uppercase tracking-widest">
                Muzinda Protocol v2.5 • Institutional Release
             </p>
          </div>
        </motion.div>

        {/* Modals */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      </main>
    </div>
  )
}

export default Profile

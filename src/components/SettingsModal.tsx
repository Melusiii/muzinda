import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Bell, Shield, Palette, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-dark/40 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-surface-bright border-r border-primary/5 p-8 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-manrope font-extrabold text-primary-dark">Settings</h2>
              <p className="text-xs text-primary-dark/40 font-dm-sans mt-1">Manage your Muzinda account</p>
            </div>

            <nav className="flex-1 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-primary-dark/40 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <button 
              onClick={() => { logout(); onClose(); }}
              className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-accent-amber hover:bg-accent-amber/5 transition-all text-left"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 md:p-12 relative overflow-y-auto">
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 hover:bg-surface-bright rounded-xl transition-all text-primary-dark/20 hover:text-primary-dark"
            >
              <X size={20} />
            </button>

            <div className="max-w-xl">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <header>
                    <h3 className="text-xl font-manrope font-extrabold text-primary-dark">Profile Information</h3>
                    <p className="text-sm text-primary-dark/40 font-dm-sans">Update your personal details and how others see you.</p>
                  </header>

                  <div className="flex items-center gap-6">
                    <img 
                      src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-surface-bright"
                    />
                    <button 
                      onClick={async () => {
                        const newUrl = prompt("Enter new profile picture URL (e.g. from unsplash or imgur):");
                        if (newUrl && user) {
                          // Quick client-side implementation; update logic needed in AuthContext for a complete fix,
                          // but direct update for UX verification:
                          import('../lib/supabase').then(async ({ supabase }) => {
                             await supabase.from('profiles').update({ avatar_url: newUrl }).eq('id', user.id);
                             alert("Profile picture updated! Please refresh to see changes.");
                          });
                        }
                      }}
                      className="text-xs font-bold text-primary px-4 py-2 bg-primary/5 rounded-xl hover:bg-primary hover:text-white transition-all">
                      Change Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.name}
                        className="w-full p-4 rounded-xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-dm-sans text-sm font-bold text-primary-dark"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest ml-1">Email Address</label>
                       <input 
                        type="email" 
                        defaultValue={user?.email}
                        disabled
                        className="w-full p-4 rounded-xl bg-surface-bright border border-primary/5 outline-none font-dm-sans text-sm font-bold text-primary-dark/40 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold font-manrope shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab !== 'profile' && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-bright flex items-center justify-center text-primary/20">
                     {tabs.find(t => t.id === activeTab)?.icon && (
                       <div className="scale-150 transform">
                         {(() => {
                           const Icon = tabs.find(t => t.id === activeTab)!.icon
                           return <Icon size={24} />
                         })()}
                       </div>
                     )}
                  </div>
                  <div>
                    <h4 className="text-lg font-manrope font-bold text-primary-dark">{tabs.find(t => t.id === activeTab)?.label} Settings Coming Soon</h4>
                    <p className="text-sm text-primary-dark/30 font-dm-sans">This module is currently being optimized for the Africa University branch.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

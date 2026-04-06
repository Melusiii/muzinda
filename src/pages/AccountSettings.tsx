import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Smartphone, 
  Moon, 
  LogOut, 
  Camera, 
  CreditCard,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Languages,
  Monitor
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { PageHeader } from '../components/PageHeader'
import { Sidebar } from '../components/Sidebar'
import { 
  useProfile, 
  updateProfile, 
  uploadAvatar, 
  changePassword, 
  globalLogout
} from '../hooks/useSupabase'
import type { Profile } from '../hooks/useSupabase'

export const AccountSettings = () => {
  const { user, logout } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const navigate = useNavigate()
  const [activeSegment, setActiveSegment] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  if (!user) return null

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const updates = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
    }

    try {
      await updateProfile(updates)
      showFeedback('success', 'Identity synchronized successfully!')
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsSaving(true)
    try {
      await uploadAvatar(file)
      showFeedback('success', 'Avatar protocol updated!')
    } catch (err: any) {
      showFeedback('error', err.message || 'Transmission failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      return showFeedback('error', 'Passwords do not match')
    }
    setIsSaving(true)
    try {
      await changePassword(passwordData.new)
      showFeedback('success', 'Gate sequence hardened!')
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (err: any) {
      showFeedback('error', err.message || 'Security update failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKillSessions = async () => {
    if (confirm("Disconnect all other active terminals?")) {
      try {
        await globalLogout()
        navigate('/')
      } catch (err: any) {
        showFeedback('error', 'Protocol override failed')
      }
    }
  }

  const toggleNotification = async (key: string) => {
    if (!profile) return;
    
    const currentSettings = profile.notification_settings || {
      push: true,
      email: true,
      messages: true,
      updates: true
    };
    
    const newSettings = { 
      ...currentSettings, 
      [key]: !((currentSettings as any)[key]) 
    };

    try {
      await updateProfile({ 
        notification_settings: newSettings as Profile['notification_settings'] 
      })
    } catch (err) {
      showFeedback('error', 'Toggle sync failed')
    }
  }

  const sections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'payments', label: 'Billing', icon: CreditCard },
    { id: 'general', label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-h-screen relative z-10 pb-32 pt-28 md:pt-28">
        <div className="max-w-4xl space-y-10">
          
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-primary-dark/40 hover:text-primary transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-primary/5 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChevronLeft size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Back to Profile</span>
            </button>

            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl",
                    feedback.type === 'success' ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  )}
                >
                  {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {feedback.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PageHeader 
            title="Account Settings"
            subtitle="Manage your institutional presence and security protocol"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation (Desktop) / Horizontal Scroll (Mobile) */}
            <div className="lg:col-span-1 space-y-2">
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSegment(section.id)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap lg:w-full",
                      activeSegment === section.id 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "bg-white text-primary-dark/40 hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <section.icon size={18} />
                    {section.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => logout()}
                className="hidden lg:flex items-center gap-3 px-5 py-4 w-full rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-500/5 transition-all mt-10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* SECTION: PERSONAL */}
              {activeSegment === 'personal' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-[2.2rem] bg-primary/5 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative text-primary">
                           {profile?.avatar_url ? (
                             <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                           ) : (
                             <User size={32} className="text-primary/20" />
                           )}
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="absolute inset-0 bg-primary-dark/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Camera size={24} className="text-white" />
                           </button>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleAvatarUpload} 
                          className="hidden" 
                          accept="image/*" 
                        />
                      </div>
                      <div className="text-center md:text-left space-y-2">
                        <h3 className="text-xl font-manrope font-black text-primary-dark tracking-tight italic uppercase">Identity Card</h3>
                        <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest"> institutional avatar and visual presence</p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                        <input 
                          name="full_name"
                          defaultValue={profile?.full_name || user.name || ''}
                          className="w-full p-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:border-primary/20 outline-none text-xs font-bold text-primary-dark"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
                        <div className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent text-xs font-bold text-primary-dark/40 flex items-center gap-3 cursor-not-allowed">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.2em] ml-2">Contact Number</label>
                        <input 
                          name="phone"
                          defaultValue={profile?.phone || user.phone || ''}
                          placeholder="+263..."
                          className="w-full p-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:border-primary/20 outline-none text-xs font-bold text-primary-dark"
                        />
                      </div>
                       <div className="space-y-2">
                        <label className="text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.2em] ml-2">Profile Bio</label>
                        <textarea 
                          name="bio"
                          defaultValue={profile?.bio || user.bio || ''}
                          className="w-full p-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:border-primary/20 outline-none text-xs font-bold text-primary-dark resize-none h-24"
                          placeholder="Your professional mission message..."
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button 
                          disabled={isSaving || profileLoading}
                          className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                          {isSaving ? 'Synchronizing...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* SECTION: SECURITY */}
              {activeSegment === 'security' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6">
                    <h3 className="text-md font-manrope font-black text-primary-dark uppercase tracking-tight italic">Access Protocol</h3>
                    
                    <div className="space-y-4">
                      <form onSubmit={handlePasswordUpdate} className="space-y-4 bg-[#F8F9F8] p-6 rounded-2xl border border-primary/5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Lock size={18} /></div>
                          <div className="text-left">
                            <p className="text-xs font-black text-primary-dark">Update Password</p>
                            <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Minimum 8 characters required</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input 
                             type="password"
                             placeholder="New Password"
                             value={passwordData.new}
                             onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                             className="w-full p-4 rounded-xl bg-white border border-primary/5 outline-none text-xs font-bold"
                           />
                           <input 
                             type="password"
                             placeholder="Confirm Password"
                             value={passwordData.confirm}
                             onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                             className="w-full p-4 rounded-xl bg-white border border-primary/5 outline-none text-xs font-bold"
                           />
                        </div>
                        <button 
                          disabled={isSaving || !passwordData.new || passwordData.new !== passwordData.confirm}
                          className="w-full py-4 bg-primary text-white rounded-xl font-black text-[9px] uppercase tracking-widest disabled:opacity-30 transition-all"
                        >
                           हार्डन गेटवे (Hardence Gateway)
                        </button>
                      </form>

                      <button className="w-full flex items-center justify-between p-6 rounded-2xl bg-[#F8F9F8] border border-primary/5 hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600"><Shield size={18} /></div>
                          <div className="text-left">
                            <p className="text-xs font-black text-primary-dark">Two-Factor Authentication</p>
                            <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Enhanced biometric secondary check</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-[8px] font-black uppercase text-gray-400 rounded-full">Inactive</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-manrope font-black text-primary-dark uppercase tracking-tight italic">Session Terminal</h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full tracking-widest">1 Active</span>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Smartphone size={18} /></div>
                            <div>
                               <p className="text-xs font-black text-primary-dark tracking-tight">Active Terminal • iPhone 15</p>
                               <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Zimbabwe • Connected Now</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       </div>

                       <button 
                         onClick={handleKillSessions}
                         className="w-full py-5 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-dashed border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all mt-4"
                       >
                         Kill All Other Sessions
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION: NOTIFICATIONS */}
              {activeSegment === 'notifications' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
                     <h3 className="text-md font-manrope font-black text-primary-dark uppercase tracking-tight italic">Communications Protocol</h3>
                     
                      <div className="space-y-6">
                        {[
                          { key: 'push', title: 'Push Notifications', desc: 'Real-time alerts for critical updates' },
                          { key: 'messages', title: 'Message Alerts', desc: 'Notify when you receive a message' },
                          { key: 'updates', title: 'Service Updates', desc: 'Transport and Housing status changes' },
                          { key: 'email', title: 'Email Context', desc: 'Weekly highlights and new property drops' },
                        ].map((pref, i) => {
                          const isActive = profile?.notification_settings?.[pref.key as keyof typeof profile.notification_settings] ?? true;
                          return (
                            <div key={i} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-black text-primary-dark tracking-tight">{pref.title}</p>
                                <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest">{pref.desc}</p>
                              </div>
                              <button 
                                onClick={() => toggleNotification(pref.key)}
                                className={cn(
                                  "w-12 h-6 rounded-full p-1 transition-all",
                                  isActive ? "bg-primary" : "bg-gray-200"
                                )}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded-full bg-white transition-all transform",
                                  isActive ? "translate-x-6" : "translate-x-0"
                                )} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION: PAYMENTS */}
              {activeSegment === 'payments' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
                     <div className="flex justify-between items-center">
                        <h3 className="text-md font-manrope font-black text-primary-dark uppercase tracking-tight italic">Treasury Control</h3>
                        <button className="text-[9px] font-black text-primary uppercase tracking-widest">View History</button>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary-dark to-black text-white relative overflow-hidden group shadow-2xl">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                           <div className="relative z-10 space-y-12">
                              <div className="flex justify-between items-start">
                                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary border border-white/5"><CreditCard size={24} /></div>
                                 <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 italic">Muzinda Pass</span>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-2xl font-manrope font-bold tracking-[0.2em]">**** **** **** 4022</p>
                                 <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                                    <span>{user.name}</span>
                                    <span>EXP 08/25</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <button className="w-full py-5 bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary/20 rounded-2xl text-primary font-black text-[10px] uppercase tracking-widest transition-all">
                           Add Payment Method
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION: GENERAL */}
              {activeSegment === 'general' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                   <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-10">
                     <h3 className="text-md font-manrope font-black text-primary-dark uppercase tracking-tight italic">Global Directives</h3>
                     
                     <div className="space-y-8">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Languages size={18} /></div>
                               <div>
                                  <p className="text-xs font-black text-primary-dark tracking-tight">Display Language</p>
                                  <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Choose your linguistic region</p>
                               </div>
                           </div>
                           <select className="bg-gray-50 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:border-primary/20">
                              <option>English</option>
                              <option disabled>Shona (Coming Soon)</option>
                           </select>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-600"><Moon size={18} /></div>
                               <div>
                                  <p className="text-xs font-black text-primary-dark tracking-tight">Dark Protocol</p>
                                  <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Night Vision Interface</p>
                               </div>
                           </div>
                           <button 
                             onClick={() => setIsDarkMode(!isDarkMode)}
                             className={cn(
                               "w-12 h-6 rounded-full p-1 transition-all",
                               isDarkMode ? "bg-primary" : "bg-gray-200"
                             )}
                           >
                             <div className={cn(
                               "w-4 h-4 rounded-full bg-white transition-all transform",
                               isDarkMode ? "translate-x-6" : "translate-x-0"
                             )} />
                           </button>
                        </div>
                     </div>
                   </div>

                   <div className="text-center space-y-4 pt-10">
                      <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.5em]">Muzinda Engineering • Build v2.5.0-Release</p>
                      <p className="text-[8px] font-bold text-primary-dark/20 uppercase tracking-tighter">Built for Africa University • Mutare, Zimbabwe</p>
                   </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AccountSettings; 

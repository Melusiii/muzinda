import { Sidebar } from '../components/Sidebar'
import { Bus, ArrowRight, Star, Loader2, Sparkles, MapPin, Building, X, Clock, Zap, Users, CreditCard, Bell, Check, ShieldCheck, Wrench } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useUserApplications, useUserTickets, cancelTransportBooking, useProperties, useNotifications } from '../hooks/useSupabase'
import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/supabase-helpers'
import { NotificationsModal } from '../components/NotificationsModal'
import { Navbar } from '../components/Navbar'
import { SettingsModal } from '../components/SettingsModal'
import { PageHeader } from '../components/PageHeader'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { properties, loading: loadingProps } = useProperties()
  const { applications: apps } = useUserApplications()
  const { tickets, refetch: refetchTickets } = useUserTickets()
  const { unreadCount } = useNotifications()
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [pulseIndex, setPulseIndex] = useState(0)
  
  const hasSecuredHousing = user?.hasSecuredHousing || false
  const featuredProperties = properties?.slice(0, 4) || []

  const pulses = [
    "14 Students exploring near Campus",
    "3 Properties secured today",
    "5.2k+ Verified Members",
    "Muzinda • Mutare's Trusted Network"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % pulses.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleCancelTicket = async (id: string) => {
    try {
      setCancellingId(id)
      await cancelTransportBooking(id)
      refetchTickets()
    } catch (err) {
      console.error("Failed to cancel ticket", err)
    } finally {
      setCancellingId(null)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans overflow-x-hidden">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar />
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-12 overflow-y-auto h-screen relative z-10 pb-32">
        <PageHeader 
          title={hasSecuredHousing ? `Your Oasis, ${user?.name?.split(' ')[0] || 'Resident'}` : "Student Home"}
          subtitle="Muzinda Concierge • The Independent Housing Authority"
          className="pt-20 md:pt-4"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                   </span>
                   <AnimatePresence mode="wait">
                     <motion.span 
                       key={pulseIndex}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -5 }}
                       className="text-[10px] font-black uppercase tracking-[0.2em]"
                     >
                       {pulses[pulseIndex]}
                     </motion.span>
                   </AnimatePresence>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsNotificationsOpen(true)}
                 className="p-3 bg-white rounded-2xl border border-primary/5 text-primary-dark/40 hover:text-primary transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 relative"
               >
                 <Bell size={20} className="md:w-6 md:h-6" />
                 {unreadCount > 0 && (
                   <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white shadow-sm" />
                 )}
               </button>
               <div className="h-12 w-12 md:h-16 md:w-16 rounded-[1.2rem] md:rounded-[2rem] bg-white p-1 shadow-xl shadow-primary/5 border border-primary/10">
                  <div className="w-full h-full rounded-[1rem] md:rounded-[1.7rem] bg-primary/5 flex items-center justify-center overflow-hidden">
                   {user?.avatar_url ? (
                     <img src={user.avatar_url} alt={user.name || 'User'} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-primary font-black uppercase text-xl">{(user?.name || 'U').charAt(0)}</span>
                   )}
                  </div>
               </div>
             </div>
          </div>
        </PageHeader>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {hasSecuredHousing ? (
            /* RESIDENT VIEW (OASIS) */
            <>
              {/* PRIMARY ROW */}
              <motion.section variants={itemVariants} className="lg:col-span-8 space-y-8">
                {/* Digital Rent Card */}
                <div className="bg-primary-dark p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group min-h-[320px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/10 rounded-full -ml-32 -mb-32 blur-[60px] pointer-events-none" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-fit">
                          <CreditCard size={14} className="text-accent-gold" />
                          <span className="text-[10px] font-black uppercase tracking-widest font-manrope">Muzinda Resident Pass</span>
                       </div>
                       <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] pt-4 px-1">Managed Security & Utilities</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <ShieldCheck className="text-primary/40" />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Account Balance</p>
                      <h2 className="text-7xl font-manrope font-black tracking-tighter leading-none">$0.00</h2>
                      <div className="flex items-center gap-4 mt-6">
                         <div className="flex -space-x-3">
                            {[1,2].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary-dark backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                                {i === 1 ? '⚡' : '💧'}
                              </div>
                            ))}
                         </div>
                         <span className="text-[10px] font-bold uppercase text-white/60 tracking-widest">Active Services</span>
                      </div>
                    </div>
                    <button className="group/btn px-12 py-6 bg-white text-primary-dark rounded-3xl font-black font-manrope transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/40 flex items-center gap-3">
                      Add Funds <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Home Manager Bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent-amber/10 transition-colors" />
                    <div className="w-16 h-16 rounded-2xl bg-accent-amber/10 flex items-center justify-center mb-8 text-accent-amber group-hover:scale-110 transition-transform shadow-inner">
                      <Wrench size={28} />
                    </div>
                    <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tight">Maintenance Hub</h3>
                    <p className="text-xs text-primary-dark/40 font-bold uppercase mt-2 tracking-widest">Synced • 0 Active Requests</p>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform shadow-inner">
                      <Building size={28} />
                    </div>
                    <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tight">Lease Details</h3>
                    <p className="text-xs text-primary-dark/40 font-bold uppercase mt-2 tracking-widest">Expires June 2026</p>
                  </div>
                </div>
              </motion.section>

              {/* ASIDE ROW */}
              <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-8">
                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm space-y-10">
                   <div className="flex justify-between items-center">
                    <h3 className="text-xl font-manrope font-black text-primary-dark tracking-tight">Quick Services</h3>
                    <div className="w-10 h-1 bg-primary/10 rounded-full" />
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                    <button onClick={() => navigate('/transport')} className="flex items-center gap-6 p-6 bg-[#F8F9F8] rounded-[2rem] hover:bg-primary/5 transition-all text-left group border border-transparent hover:border-primary/10">
                       <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-black/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Bus size={24} /></div>
                       <div>
                          <p className="text-md font-black text-primary-dark tracking-tight">Book Shuttle</p>
                          <p className="text-[10px] text-primary-dark/40 font-bold uppercase mt-0.5">To Campus • 07:15</p>
                       </div>
                    </button>
                    <button className="flex items-center gap-6 p-6 bg-[#F8F9F8] rounded-[2rem] hover:bg-accent-gold/5 transition-all text-left group border border-transparent hover:border-accent-gold/10">
                       <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-black/5 text-accent-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Sparkles size={24} /></div>
                       <div>
                          <p className="text-md font-black text-primary-dark tracking-tight">Concierge</p>
                          <p className="text-[10px] text-primary-dark/40 font-bold uppercase mt-0.5">Help Desk • Online</p>
                       </div>
                    </button>
                   </div>
                </div>

                {/* Active Tickets Peek */}
                <AnimatePresence>
                  {tickets.length > 0 && (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-8">
                           <h4 className="text-lg font-manrope font-black text-primary-dark tracking-tight flex items-center gap-3">
                              <Bus size={20} className="text-primary" /> Active Trips
                           </h4>
                           <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[9px] font-black uppercase">{tickets.length}</span>
                        </div>
                        <div className="space-y-4">
                           {tickets.map((ticket: any) => (
                             <div key={ticket.id} className="group/ticket relative p-6 bg-[#F8F9F8] rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all">
                                <button 
                                  onClick={() => handleCancelTicket(ticket.id)}
                                  disabled={cancellingId === ticket.id}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-primary/5 rounded-full flex items-center justify-center text-primary-dark/20 hover:text-red-500 hover:border-red-100 shadow-sm opacity-0 group-hover/ticket:opacity-100 transition-all"
                                >
                                  {cancellingId === ticket.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                </button>
                                <p className="text-sm font-black text-primary-dark tracking-tight mb-2 truncate pr-4">{ticket.trips?.routes?.name}</p>
                                <div className="flex justify-between items-center text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.1em]">
                                   <div className="flex items-center gap-1.5"><Clock size={10} /> {ticket.trips?.departure_time}</div>
                                   <div className="flex items-center gap-1.5"><MapPin size={10} /> {ticket.pickup_point}</div>
                                </div>
                             </div>
                           ))}
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.aside>
            </>
          ) : (
            /* APPLICANT VIEW (THE HUB - GENUINE REDESIGN) */
            <>
              {/* PRIMARY BENTO: MARKETPLACE PULSE */}
              <motion.section variants={itemVariants} className="lg:col-span-8 space-y-10">
                <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-end mb-10 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Marketplace Pulse</p>
                       <h3 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter italic leading-none">Featured Houses</h3>
                    </div>
                    <Link to="/explorer" className="flex items-center gap-2 text-xs font-black text-primary-dark/40 hover:text-primary transition-all uppercase tracking-widest group/link">
                      View All <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {loadingProps ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                       {[1,2].map(i => (
                         <div key={i} className="aspect-video bg-primary/5 rounded-[2.5rem] animate-pulse" />
                       ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {featuredProperties.map((prop) => (
                        <motion.div 
                          key={prop.id}
                          layout
                          whileHover={{ y: -8 }}
                          onClick={() => navigate(`/property/${prop.id}`)}
                          className="group/prop cursor-pointer space-y-4"
                        >
                           <div className="relative aspect-[4/3] sm:aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 bg-gray-100">
                             <img 
                               src={getImageUrl(prop.image_url)} 
                               alt={prop.title} 
                               // @ts-ignore
                               fetchPriority="high"
                               decoding="async"
                               className="w-full h-full object-cover transition-transform duration-1000 group-hover/prop:scale-110"
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                               }}
                             />
                             <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-white/20">
                               <Star size={12} className="text-accent-gold fill-accent-gold" />
                               <span className="text-[10px] font-black text-primary-dark tracking-tighter">{prop.rating || '4.8'}</span>
                             </div>
                             <div className="absolute bottom-4 right-4 bg-primary-dark/80 backdrop-blur-lg px-4 py-2 rounded-2xl border border-white/10">
                               <span className="text-[11px] font-black text-white italic">${prop.price}</span>
                             </div>
                           </div>
                           <div className="px-2">
                             <h4 className="text-lg font-black text-primary-dark tracking-tight leading-none truncate">{prop.name || prop.title}</h4>
                             <p className="text-[10px] font-bold text-primary-dark/40 uppercase mt-1 tracking-widest">{prop.location}</p>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Tiles Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2">
                  {[
                    { icon: Bus, label: 'Shuttle Hub', desc: 'Secure reliable transport', color: 'bg-primary/5 text-primary' },
                    { icon: ShieldCheck, label: 'Certified', desc: 'Verified status ranking', color: 'bg-accent-gold/5 text-accent-gold' },
                    { icon: Check, label: 'Applications', desc: 'View your status', color: 'bg-[#F2F4F2] text-primary-dark' },
                  ].map((service, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -5 }}
                      className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all"
                    >
                      <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner", service.color)}>
                        <service.icon size={26} />
                      </div>
                      <h4 className="text-md font-black text-primary-dark tracking-tight leading-none">{service.label}</h4>
                      <p className="text-[10px] text-primary-dark/30 font-bold uppercase mt-2 tracking-widest leading-none h-4">{service.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* SIDEBAR ASIDE: RESIDENT PATH */}
              <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-8">
                 <div className="bg-primary-dark p-12 rounded-[4rem] text-white relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[500px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-10">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Institutional Path</p>
                             <h3 className="text-2xl font-manrope font-black text-white tracking-tighter italic">Resident Journey</h3>
                          </div>
                          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center"><Zap size={20} className="text-accent-gold" /></div>
                       </div>
                       
                       <div className="space-y-10">
                           {[
                             { step: 'Preference Sync', desc: 'Configure search criteria', status: apps.length > 0 ? 'complete' : 'active', icon: MapPin },
                             { step: 'Secure Oasis', desc: 'Sign your first lease', status: 'lock', icon: Building }
                           ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 group/step">
                               <div className="relative flex flex-col items-center">
                                  <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 shadow-xl",
                                    item.status === 'complete' ? "bg-primary border-primary text-white" :
                                    item.status === 'active' ? "bg-white border-primary text-primary-dark animate-pulse scale-110" :
                                    "bg-white/5 border-white/10 text-white/20"
                                  )}>
                                     {item.status === 'complete' ? <Check size={20} /> : <item.icon size={20} />}
                                  </div>
                                  {idx < 2 && <div className={cn("w-0.5 h-10 my-2", item.status === 'complete' ? "bg-primary" : "bg-white/5")} />}
                               </div>
                               <div className="pt-1.5">
                                  <p className={cn(
                                    "text-sm font-black tracking-tight leading-none",
                                    item.status === 'lock' ? "text-white/20" : "text-white"
                                  )}>{item.step}</p>
                                  <p className="text-[9px] font-bold text-white/30 uppercase mt-1.5 tracking-widest">{item.desc}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <button className="relative z-10 w-full mt-10 py-5 bg-white text-primary-dark font-black rounded-3xl text-[10px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                       Complete Handshake <ArrowRight size={14} />
                    </button>
                 </div>

                 {/* Active Tickets Peek for Hub View (Restored & Functional) */}
                 <AnimatePresence>
                   {tickets.length > 0 && (
                     <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white p-10 rounded-[4rem] border border-primary/5 shadow-sm"
                     >
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-12 h-12 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner"><Bus size={22} /></div>
                           <div>
                              <h4 className="text-md font-black text-primary-dark uppercase tracking-widest leading-none">Active Tickets</h4>
                              <p className="text-[9px] font-bold text-primary-dark/30 uppercase mt-1 tracking-widest">{tickets.length} Rides Booked</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           {tickets.map((ticket: any) => (
                             <div key={ticket.id} className="group/ticket relative p-6 bg-[#F8F9F8] rounded-[2.5rem] border border-primary/5 hover:border-primary/10 transition-all">
                                <button 
                                  onClick={() => handleCancelTicket(ticket.id)}
                                  disabled={cancellingId === ticket.id}
                                  className="absolute -top-1 -right-1 w-8 h-8 bg-white border border-primary/10 rounded-full flex items-center justify-center text-primary-dark/20 hover:text-red-500 hover:border-red-100 shadow-sm opacity-0 group-hover/ticket:opacity-100 transition-all scale-90"
                                >
                                  {cancellingId === ticket.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                </button>
                                <p className="text-sm font-black text-primary-dark tracking-tight truncate pr-4 mb-1.5">{ticket.trips?.routes?.name}</p>
                                <div className="flex justify-between items-center text-[10px] font-bold text-primary-dark/40 uppercase tracking-widest">
                                   <div className="flex items-center gap-1"><Clock size={10} /> {ticket.trips?.departure_time}</div>
                                   <div className="flex items-center gap-1"><Check size={10} className="text-primary" /> Active</div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {/* Social Proof Stats */}
                 <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner"><Users size={24} /></div>
                       <div>
                          <p className="text-xs font-black text-primary-dark leading-none uppercase tracking-widest">Active Community</p>
                          <p className="text-[9px] font-black text-primary-dark/30 uppercase mt-1 tracking-widest">5,200+ Verified Students</p>
                       </div>
                    </div>
                    <div className="flex -space-x-3 pt-2">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-primary/10 overflow-hidden shadow-sm">
                           <img 
                             src={`https://i.pravatar.cc/150?u=${i+10}`} 
                             alt="user" 
                             loading="lazy"
                             decoding="async"
                             className="w-full h-full object-cover filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair" 
                           />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-lg">+14</div>
                    </div>
                 </div>
              </motion.aside>
            </>
          )}
        </motion.div>
        <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </main>
    </div>
  )
}

export default StudentDashboard

import { Sidebar } from '../components/Sidebar'
import { Bus, ArrowRight, Star, Sparkles, MapPin, Building, Clock, Zap, Users, CreditCard, Check, ShieldCheck, Wrench } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useUserApplications, useUserTickets, useProperties } from '../hooks/useSupabase'
import { useState } from 'react'
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
  const { tickets } = useUserTickets()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const hasSecuredHousing = user?.hasSecuredHousing || false
  const featuredProperties = properties?.slice(0, 4) || []

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
    <div className="flex bg-[#F4F8F5] min-h-screen font-dm-sans overflow-x-hidden">
      <Navbar />
      <Sidebar />
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-h-screen relative z-10 pb-32 pt-28 md:pt-8">
        <PageHeader 
          title={hasSecuredHousing ? `Your Oasis, ${user?.name?.split(' ')[0] || 'Resident'}` : "Student Home"}
          subtitle="Muzinda Concierge • Your Independent Housing Partner"
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
        >
          {hasSecuredHousing ? (
            /* RESIDENT VIEW (OASIS) */
            <>
              {/* PRIMARY ROW */}
              <motion.section variants={itemVariants} className="lg:col-span-8 space-y-6 md:space-y-8">
                {/* Digital Rent Card */}
                <div className="bg-primary-dark p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group min-h-[280px] md:min-h-[320px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/10 rounded-full -ml-32 -mb-32 blur-[60px] pointer-events-none" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-fit">
                          <CreditCard size={14} className="text-accent-gold" />
                          <span className="text-[10px] font-black uppercase tracking-widest font-manrope">Resident Pass</span>
                       </div>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <ShieldCheck className="text-primary/40" />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Account Balance</p>
                      <h2 className="text-5xl md:text-7xl font-manrope font-black tracking-tighter leading-none">$0.00</h2>
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
                    <button className="w-full md:w-auto px-10 py-5 bg-white text-primary-dark rounded-2xl md:rounded-3xl font-black font-manrope transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20 flex items-center justify-center gap-3">
                      Add Funds <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Home Manager Bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="w-14 h-14 rounded-2xl bg-accent-amber/10 flex items-center justify-center mb-6 text-accent-amber shadow-inner">
                      <Wrench size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-manrope font-black text-primary-dark tracking-tight">Maintenance Hub</h3>
                    <p className="text-[10px] text-primary-dark/40 font-bold uppercase mt-2 tracking-widest leading-none">0 Active Requests</p>
                  </div>

                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
                        <Building size={24} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-manrope font-black text-primary-dark tracking-tight">Lease Details</h3>
                      <p className="text-[10px] text-primary-dark/40 font-bold uppercase mt-2 tracking-widest leading-none">Expires June 2026</p>
                    </div>
                  </div>

                {/* NEW: Campus Status Bulletin to fill space */}
                <div className="mt-8 bg-primary/5 p-8 rounded-[3rem] border border-primary/10 relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><ShieldCheck size={18} /></div>
                    <div>
                      <h4 className="text-sm font-black text-primary-dark uppercase tracking-tight">Institutional Alert</h4>
                      <p className="text-[9px] text-primary-dark/40 font-bold uppercase tracking-widest">Network Status: Nominal</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-primary-dark/60 font-medium leading-relaxed italic">
                    All institutional housing facilities are currently operating at 100% capacity. No maintenance outages reported for your zone.
                  </p>
                </div>
              </motion.section>

              {/* ASIDE ROW */}
              <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6 md:space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm space-y-8">
                   <div className="flex justify-between items-center">
                    <h3 className="text-xl font-manrope font-black text-primary-dark tracking-tight">Quick Services</h3>
                    <div className="w-10 h-1 bg-primary/10 rounded-full" />
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => navigate('/transport')} className="flex items-center gap-5 p-5 bg-[#F8F9F8] rounded-[2rem] hover:bg-primary/5 transition-all text-left border border-transparent hover:border-primary/10 group">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-md text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Bus size={20} /></div>
                       <div>
                          <p className="text-sm font-black text-primary-dark tracking-tight">Book Shuttle</p>
                          <p className="text-[9px] text-primary-dark/40 font-bold uppercase mt-0.5">To Campus • 07:15</p>
                       </div>
                    </button>
                    <button className="flex items-center gap-5 p-5 bg-[#F8F9F8] rounded-[2rem] hover:bg-accent-gold/5 transition-all text-left border border-transparent hover:border-accent-gold/10 group">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-md text-accent-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Sparkles size={20} /></div>
                       <div>
                          <p className="text-sm font-black text-primary-dark tracking-tight">Concierge</p>
                          <p className="text-[9px] text-primary-dark/40 font-bold uppercase mt-0.5">Help Desk • Online</p>
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
                      className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="text-md font-manrope font-black text-primary-dark tracking-tight flex items-center gap-2">
                              <Bus size={18} className="text-primary" /> Active Trips
                           </h4>
                           <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase">{tickets.length}</span>
                        </div>
                        <div className="space-y-4">
                           {tickets.map((ticket: any) => (
                             <div key={ticket.id} className="relative p-5 bg-[#F8F9F8] rounded-[2rem] border border-primary/5">
                                <p className="text-xs font-black text-primary-dark tracking-tight mb-2 truncate pr-6">{ticket.trips?.routes?.name}</p>
                                <div className="flex justify-between items-center text-[8px] font-black text-primary-dark/30 uppercase tracking-widest">
                                   <div className="flex items-center gap-1"><Clock size={10} /> {ticket.trips?.departure_time}</div>
                                   <div className="flex items-center gap-1"><MapPin size={10} /> {ticket.pickup_point}</div>
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
            /* APPLICANT VIEW (THE HUB - MOBILE OPTIMIZED) */
            <>
              {/* PRIMARY BENTO: MARKETPLACE PULSE */}
              <motion.section variants={itemVariants} className="lg:col-span-8 space-y-6 md:space-y-10">
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-end mb-8 md:mb-10 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">House Explorer</p>
                       <h3 className="text-3xl md:text-4xl font-manrope font-black text-primary-dark tracking-tighter italic leading-none">Featured Stays</h3>
                    </div>
                    <Link to="/explorer" className="flex items-center gap-2 text-[10px] font-black text-primary-dark/40 hover:text-primary transition-all uppercase tracking-[0.2em]">
                      Explore <ArrowRight size={14} />
                    </Link>
                  </div>


                  {loadingProps ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {[1,2].map(i => (
                         <div key={i} className="aspect-video bg-primary/5 rounded-[2rem] animate-pulse" />
                       ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {featuredProperties.map((prop) => (
                        <motion.div 
                          key={prop.id}
                          whileHover={{ y: -5 }}
                          onClick={() => navigate(`/property/${prop.id}`)}
                          className="group/prop cursor-pointer space-y-4"
                        >
                           <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden shadow-sm">
                             <img 
                               src={getImageUrl(prop.image_url)} 
                               alt={prop.title} 
                               className="w-full h-full object-cover transition-transform duration-700 group-hover/prop:scale-105"
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                               }}
                             />
                             <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
                               <Star size={10} className="text-accent-gold fill-accent-gold" />
                               <span className="text-[9px] font-black text-primary-dark uppercase tracking-tighter">{prop.rating || '4.8'}</span>
                             </div>
                             <div className="absolute bottom-3 right-3 bg-primary-dark/80 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
                               <span className="text-[10px] font-black text-white italic">${prop.price}</span>
                             </div>
                           </div>
                           <div className="px-1">
                             <h4 className="text-md font-black text-primary-dark tracking-tight leading-none truncate">{prop.name || prop.title}</h4>
                             <p className="text-[9px] font-bold text-primary-dark/30 uppercase mt-1.5 tracking-widest">{prop.location}</p>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Tiles Row (Responsive Grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 pt-2">
                  {[
                    { icon: Bus, label: 'Shuttle', color: 'bg-primary/5 text-primary' },
                    { icon: ShieldCheck, label: 'Certified', color: 'bg-accent-gold/5 text-accent-gold' },
                    { icon: Check, label: 'Active Stats', color: 'bg-[#F2F4F2] text-primary-dark' },
                  ].map((service, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -3 }}
                      className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm flex flex-col items-center text-center group transition-all"
                    >
                      <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 shadow-inner", service.color)}>
                        <service.icon size={idx === 1 ? 22 : 24} className="md:w-7 md:h-7" />
                      </div>
                      <h4 className="text-xs md:text-md font-black text-primary-dark tracking-tight leading-none whitespace-nowrap">{service.label}</h4>
                    </motion.div>
                  ))}
                </div>

                {/* NEW: Institutional Bulletin for Applicants */}
                <div className="bg-[#4F7C2C]/5 p-8 rounded-[3.5rem] border border-[#4F7C2C]/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                   <div className="flex-1 space-y-4 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F7C2C]/10 text-[#4F7C2C] text-[8px] font-black uppercase tracking-widest">Institutional Bulletin</div>
                      <h4 className="text-xl font-manrope font-black text-primary-dark tracking-tight leading-tight italic">Secure your oasis before the seasonal transition.</h4>
                      <p className="text-xs text-primary-dark/50 font-medium leading-relaxed max-w-lg">
                        94% of verified properties near Main Campus are now under active negotiation. Complete your profile to gain priority status.
                      </p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary-dark border border-primary/5 hover:scale-110 transition-transform cursor-pointer"><Zap size={24} /></div>
                   </div>
                </div>
              </motion.section>

              {/* SIDEBAR ASIDE: RESIDENT PATH (MOBILE OPTIMIZED) */}
              <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6 md:space-y-8">
                 <div className="bg-primary-dark p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-8 md:mb-10">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Lifecycle</p>
                             <h3 className="text-xl md:text-2xl font-manrope font-black text-white tracking-tighter italic uppercase">My Journey</h3>
                          </div>
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5"><Zap size={20} className="text-accent-gold" /></div>
                       </div>
                       
                       <div className="space-y-8 md:space-y-10">
                           {[
                             { step: 'Preferences', status: apps.length > 0 ? 'complete' : 'active', icon: MapPin },
                             { step: 'Secure Oasis', status: 'lock', icon: Building }
                           ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 md:gap-6 items-center">
                               <div className="relative flex flex-col items-center">
                                  <div className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-xl",
                                    item.status === 'complete' ? "bg-primary border-primary text-white" :
                                    item.status === 'active' ? "bg-white border-primary text-primary-dark animate-pulse scale-105" :
                                    "bg-white/5 border-white/10 text-white/20"
                                  )}>
                                     {item.status === 'complete' ? <Check size={20} /> : <item.icon size={20} />}
                                  </div>
                               </div>
                               <div>
                                  <p className={cn(
                                    "text-sm font-black tracking-tight leading-none uppercase",
                                    item.status === 'lock' ? "text-white/20" : "text-white"
                                  )}>{item.step}</p>
                                  <p className="text-[8px] font-bold text-white/30 uppercase mt-1.5 tracking-widest">In Progress</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <button className="relative z-10 w-full mt-8 py-5 bg-white text-primary-dark font-black rounded-2xl text-[10px] shadow-2xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95">
                       Join Registry <ArrowRight size={14} />
                    </button>
                 </div>

                 {/* Social Proof Stats (Hidden on smallest mobile if needed, or simplified) */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shadow-inner"><Users size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black text-primary-dark leading-none uppercase tracking-widest">Active Community</p>
                          <p className="text-[8px] font-black text-primary-dark/20 uppercase mt-1.5 tracking-widest font-dm-sans">5K+ Verified AU Students</p>
                       </div>
                    </div>
                    <div className="flex -space-x-3 pt-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-primary/10 overflow-hidden">
                           <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" className="w-full h-full object-cover grayscale opacity-50" />
                        </div>
                      ))}
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[8px] font-black shadow-lg">+14</div>
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

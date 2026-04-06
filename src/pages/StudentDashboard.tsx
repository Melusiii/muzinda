import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { 
  Bus, 
  ArrowRight, 
  Star, 
  Sparkles, 
  MapPin, 
  Building, 
  Clock, 
  Zap, 
  Users, 
  CreditCard, 
  Check, 
  ShieldCheck, 
  Wrench, 
  X, 
  AlertCircle,
  Heart
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useUserApplications, useUserTickets, useProperties, useFavorites } from '../hooks/useSupabase'
import { useMaintenance, submitMaintenanceRequest, useStudentResidency } from '../hooks/supabase/useMaintenance'
import { getImageUrl } from '../utils/supabase-helpers'
import { PageHeader } from '../components/PageHeader'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { properties, loading: loadingProps } = useProperties()
  const { residency } = useStudentResidency()
  const { favorites } = useFavorites()
  const { applications: apps } = useUserApplications()
  const { tickets } = useUserTickets()
  const { tickets: maintTickets } = useMaintenance()
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false)
  
  const hasSecuredHousing = !!residency
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
      <Sidebar />
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-h-screen relative z-10 pb-safe md:pb-8 pt-28 md:pt-28">
        <PageHeader 
          title={hasSecuredHousing ? `Your House, ${(user?.name || 'Resident').split(' ')[0]}` : "Student Home"}
          subtitle="Muzinda Concierge • Your Independent Housing Partner"
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
        >
          {hasSecuredHousing ? (
            /* RESIDENT VIEW (HOUSE) */
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
                  <div 
                    onClick={() => setIsMaintModalOpen(true)}
                    className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="w-14 h-14 rounded-2xl bg-accent-amber/10 flex items-center justify-center mb-6 text-accent-amber shadow-inner">
                      <Wrench size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-manrope font-black text-primary-dark tracking-tight">Maintenance <span className="italic text-primary">Hub</span></h3>
                    <p className="text-[10px] text-primary-dark/40 font-bold uppercase mt-2 tracking-widest leading-none">
                      {(maintTickets || []).filter(t => t.status !== 'resolved').length} Active Requests
                    </p>
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

                {/* Saved Houses Horizontal Carousel */}
                {(favorites || []).length > 0 && (
                  <div className="space-y-6 pt-4">
                    <div className="flex justify-between items-end px-2">
                       <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Curated</p>
                          <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tight">Saved <span className="italic text-primary text-3xl font-serif">Houses</span></h3>
                       </div>
                       <Link to="/explorer" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4">
                       {favorites.map((fav: any) => (
                         <Link 
                          key={fav.id} 
                          to={`/property/${fav.property_id}`}
                          className="min-w-[280px] bg-white p-4 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group"
                         >
                            <div className="relative aspect-video rounded-3xl overflow-hidden mb-4">
                               <img src={getImageUrl(fav.property?.image_url)} alt={fav.property?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                               <div className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg">
                                 <Heart size={12} className="fill-current" />
                               </div>
                            </div>
                            <h4 className="text-sm font-black text-primary-dark tracking-tight px-2 truncate">{fav.property?.title}</h4>
                            <div className="flex justify-between items-center px-2 mt-2">
                               <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest flex items-center gap-1">
                                 <MapPin size={10} /> {fav.property?.location?.split(',')[0]}
                               </p>
                               <span className="text-[11px] font-black text-primary">${fav.property?.price}</span>
                            </div>
                         </Link>
                       ))}
                    </div>
                  </div>
                )}
              </motion.section>

              {/* ASIDE ROW */}
              <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6 md:space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm space-y-8">
                   <div className="flex justify-between items-center">
                    <h3 className="text-xl font-manrope font-black text-primary-dark tracking-tight">Quick <span className="italic text-primary">Services</span></h3>
                    <div className="w-10 h-1 bg-primary/10 rounded-full" />
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => navigate('/transport')} className="flex items-center gap-5 p-5 bg-[#F8F9F8] rounded-[2rem] hover:bg-primary/5 transition-all text-left border border-transparent hover:border-primary/10 group">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-md text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Bus size={20} /></div>
                       <div>
                          <p className="text-sm font-black text-primary-dark tracking-tight">Book Shuttle</p>
                          <p className="text-[11px] text-primary-dark/40 font-bold uppercase mt-0.5">To Campus • 07:15</p>
                       </div>
                    </button>
                    <button className="flex items-center gap-5 p-5 bg-[#F8F9F8] rounded-[2rem] hover:bg-accent-gold/5 transition-all text-left border border-transparent hover:border-accent-gold/10 group">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-md text-accent-gold flex items-center justify-center group-hover:scale-110 transition-transform"><Sparkles size={20} /></div>
                       <div>
                          <p className="text-sm font-black text-primary-dark tracking-tight">Concierge</p>
                          <p className="text-[11px] text-primary-dark/40 font-bold uppercase mt-0.5">Help Desk • Online</p>
                       </div>
                    </button>
                   </div>
                </div>

                {/* Active Tickets Peek */}
                <AnimatePresence>
                  {(tickets || []).length > 0 && (
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
                           <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase">{(tickets || []).length}</span>
                        </div>
                        <div className="space-y-4">
                           {(tickets || []).map((ticket: any) => (
                             <div key={ticket.id || Math.random()} className="relative p-5 bg-[#F8F9F8] rounded-[2rem] border border-primary/5">
                                <p className="text-xs font-black text-primary-dark tracking-tight mb-2 truncate pr-6">{ticket.trips?.routes?.name || 'Scheduled Service'}</p>
                                <div className="flex justify-between items-center text-[11px] font-black text-primary-dark/30 uppercase tracking-widest">
                                   <div className="flex items-center gap-1"><Clock size={10} /> {ticket.trips?.departure_time || 'TBD'}</div>
                                   <div className="flex items-center gap-1"><MapPin size={10} /> {ticket.pickup_point || 'Pickup point'}</div>
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
                       <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">House Explorer</p>
                       <h3 className="text-3xl md:text-4xl font-manrope font-black text-primary-dark tracking-tighter leading-none">Featured <span className="italic text-primary">Stays</span></h3>
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
                           <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-sm">
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
                               <span className="text-[11px] font-black text-primary-dark uppercase tracking-tighter">{prop.rating || '4.8'}</span>
                             </div>
                             <div className="absolute bottom-3 right-3 bg-primary-dark/80 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
                               <span className="text-[10px] font-black text-white italic">${prop.price}</span>
                             </div>
                           </div>
                           <div className="px-1">
                             <h4 className="text-md font-black text-primary-dark tracking-tight leading-none truncate">{prop.name || prop.title}</h4>
                             <p className="text-[11px] font-bold text-primary-dark/30 uppercase mt-1.5 tracking-widest">{prop.location}</p>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Houses Section for Applicants */}
                {favorites.length > 0 && (
                  <div className="space-y-6 pt-4">
                    <div className="flex justify-between items-end px-2">
                       <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Personal Collection</p>
                          <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tight">Saved <span className="italic text-primary text-3xl font-serif">Houses</span></h3>
                       </div>
                       <Link to="/explorer" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">See Hearted</Link>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4">
                       {favorites.map((fav: any) => (
                         <Link 
                          key={fav.id} 
                          to={`/property/${fav.property_id}`}
                          className="min-w-[280px] bg-white p-4 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group"
                         >
                            <div className="relative aspect-video rounded-3xl overflow-hidden mb-4">
                               <img src={getImageUrl(fav.property?.image_url)} alt={fav.property?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                               <div className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg">
                                 <Heart size={12} className="fill-current" />
                               </div>
                            </div>
                            <h4 className="text-sm font-black text-primary-dark tracking-tight px-2 truncate">{fav.property?.title}</h4>
                            <div className="flex justify-between items-center px-2 mt-2 text-[10px] font-bold uppercase tracking-widest">
                               <span className="text-primary-dark/30">{fav.property?.location?.split(',')[0]}</span>
                               <span className="text-primary font-black">${fav.property?.price}</span>
                            </div>
                         </Link>
                       ))}
                    </div>
                  </div>
                )}

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

              </motion.section>

              {/* SIDEBAR ASIDE: RESIDENT PATH (MOBILE OPTIMIZED) */}
              <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6 md:space-y-8">
                 <div className="bg-primary-dark p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-8 md:mb-10">
                          <div className="space-y-1">
                             <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Lifecycle</p>
                             <h3 className="text-xl md:text-2xl font-manrope font-black text-white tracking-tighter uppercase">My Journey</h3>
                          </div>
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5"><Zap size={20} className="text-accent-gold" /></div>
                       </div>
                       
                       <div className="space-y-8 md:space-y-10">
                           {[
                             { step: 'Preferences', status: apps.length > 0 ? 'complete' : 'active', icon: MapPin },
                             { step: 'Secure House', status: 'lock', icon: Building }
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
                                  <p className="text-[11px] font-bold text-white/30 uppercase mt-1.5 tracking-widest">In Progress</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <button className="relative z-10 w-full mt-8 py-5 bg-white text-primary-dark font-black rounded-2xl text-[10px] shadow-2xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95">
                       Join Registry <ArrowRight size={14} />
                    </button>
                 </div>

                 {/* Social Proof Stats */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shadow-inner"><Users size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black text-primary-dark leading-none uppercase tracking-widest">Active Community</p>
                          <p className="text-[11px] font-black text-primary-dark/20 uppercase mt-1.5 tracking-widest font-dm-sans">5K+ Verified AU Students</p>
                       </div>
                    </div>
                    <div className="flex -space-x-3 pt-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-primary/10 overflow-hidden">
                           <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" className="w-full h-full object-cover grayscale opacity-50" />
                        </div>
                      ))}
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[11px] font-black shadow-lg">+14</div>
                    </div>
                 </div>
              </motion.aside>
            </>
          )}
        </motion.div>

        {/* Maintenance Request Overlay */}
        <AnimatePresence>
          {isMaintModalOpen && (
            <MaintenanceModal 
              onClose={() => setIsMaintModalOpen(false)} 
              tickets={maintTickets}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// PREMIUM MAINTENANCE MODAL COMPONENT
const MaintenanceModal = ({ onClose, tickets }: { onClose: () => void, tickets: any[] }) => {
  const [step, setStep] = useState<'list' | 'create'>('list')
  const [formData, setFormData] = useState<{ category: string, priority: 'low' | 'medium' | 'high' | 'emergency', description: string }>({ 
    category: 'plumbing', 
    priority: 'medium', 
    description: '' 
  })
  const [submitting, setSubmitting] = useState(false)
  const { applications } = useUserApplications()
  
  // Get active property for the current resident
  const activePropertyId = applications.find(a => a.status === 'secured')?.property_id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePropertyId) return
    setSubmitting(true)
    try {
      await submitMaintenanceRequest(activePropertyId, formData)
      setStep('list')
    } catch (err) {
      alert("Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass w-full max-w-2xl bg-white/95 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 md:p-10 flex justify-between items-center border-b border-primary/5">
          <div>
            <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">Maintenance <span className="text-primary italic">Hub</span></h3>
            <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.4em] mt-1">Status Tracking • Request Repairs</p>
          </div>
          <button onClick={onClose} className="p-3 bg-primary/5 text-primary-dark/40 hover:text-primary transition-all rounded-2xl"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10">
          {step === 'list' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h4 className="text-md font-black text-primary-dark uppercase tracking-wide">Active Tickets</h4>
                 <button 
                  onClick={() => setStep('create')}
                  className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   New Request
                 </button>
              </div>

              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="p-12 text-center space-y-4 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary/20 mx-auto"><Wrench size={24} /></div>
                     <p className="text-[10px] font-black text-primary-dark/30 uppercase tracking-[0.3em]">No active maintenance issues</p>
                  </div>
                ) : (
                  tickets.map((t) => (
                    <div key={t.id} className="p-6 bg-white rounded-[2rem] border border-primary/5 shadow-sm group hover:shadow-md transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary capitalize font-black text-[10px]">{t.category[0]}</div>
                             <div>
                                <p className="text-sm font-black text-primary-dark uppercase tracking-tight italic font-manrope">{t.category}</p>
                                <p className="text-[9px] font-bold text-primary-dark/30 uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                            t.status === 'resolved' ? "bg-green-50 text-green-600 border-green-100" :
                            t.status === 'in_progress' ? "bg-primary/5 text-primary border-primary/10" :
                            "bg-accent-amber/5 text-accent-amber border-accent-amber/10"
                          )}>
                            {t.status}
                          </div>
                       </div>
                       <p className="text-xs text-primary-dark/60 line-clamp-2 italic leading-relaxed">{t.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-[0.3em] ml-2">Category</label>
                    <div className="grid grid-cols-2 gap-4">
                       {['plumbing', 'electrical', 'security', 'fittings'].map(cat => (
                         <button 
                          key={cat}
                          type="button"
                          onClick={() => setFormData({...formData, category: cat})}
                          className={cn(
                            "p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-center",
                            formData.category === cat ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-white border-primary/10 text-primary-dark/40 hover:border-primary/20"
                          )}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-[0.3em] ml-2">Priority</label>
                    <div className="flex gap-4">
                       {['low', 'medium', 'high', 'emergency'].map(prio => (
                         <button 
                          key={prio}
                          type="button"
                          onClick={() => setFormData({...formData, priority: prio as any})}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center",
                            formData.priority === prio ? "bg-primary-dark text-white border-primary-dark" : "bg-white border-primary/10 text-primary-dark/40"
                          )}
                         >
                           {prio}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-[0.3em] ml-2">Description</label>
                    <textarea 
                      placeholder="Describe the issue in detail..."
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full h-32 p-6 glass bg-white/50 rounded-[2rem] border border-primary/10 outline-none focus:border-primary/30 transition-all text-sm font-medium italic"
                    />
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep('list')}
                    className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 text-primary-dark/40 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Identify Issue'} <Zap size={14} />
                  </button>
               </div>

               {!activePropertyId && (
                 <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-500">
                    <AlertCircle size={18} />
                    <span className="text-[10px] font-black uppercase tracking-tight">No active lease found to attach request.</span>
                 </div>
               )}
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default StudentDashboard

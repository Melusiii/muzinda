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
  ShieldCheck,
  Check,
  Wrench,
  Heart,
  Users,
  X,
  Camera,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useUserApplications, useUserTickets, useProperties, useFavorites } from '../hooks/useSupabase'
import { useMaintenance, submitMaintenanceRequest, useStudentResidency, uploadMaintenanceImage } from '../hooks/supabase/useMaintenance'
import { getImageUrl } from '../utils/supabase-helpers'
import { PageHeader } from '../components/PageHeader'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { properties, loading: loadingProps } = useProperties()
  const { residency, loading: residencyLoading } = useStudentResidency()
  const { favorites } = useFavorites()
  const { applications: apps } = useUserApplications()
  const { tickets } = useUserTickets()
  const { tickets: maintTickets } = useMaintenance()
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false)
  
  const isSyncing = loadingProps || residencyLoading
  // Strict guard to prevent flicker: if we are loading residency, housing is definitely NOT secured yet in our UI state
  const hasSecuredHousing = residencyLoading ? false : !!residency
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
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-h-screen relative z-10 pb-safe md:pb-8 pt-32 md:pt-32">
        {isSyncing ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
             <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full" 
                />
             </div>
             <div className="text-center space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-primary/40 animate-pulse">Synchronizing Identity</p>
                <p className="text-[9px] font-medium text-primary-dark/20 uppercase tracking-widest">Muzinda Secure Gate</p>
             </div>
          </div>
        ) : (
          <>
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
                {/* Active Residence Card */}
                {residency?.property && (
                  <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-primary/10 shadow-2xl bg-white min-h-[350px] flex flex-col md:flex-row mb-12">
                     {/* Property Image Side */}
                     <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                        <img 
                          src={getImageUrl(residency.property.image_url)} 
                          alt={residency.property.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary-dark/80 via-primary-dark/40 to-transparent" />
                        
                        <div className="absolute bottom-8 left-8 text-white z-10">
                           <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                 <Building size={16} />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] font-manrope">Current Residence</span>
                           </div>
                           <h2 className="text-2xl md:text-4xl font-manrope font-extrabold tracking-tighter leading-none italic uppercase">{residency.property.title}</h2>
                           <p className="text-sm text-white/60 mt-2 font-medium flex items-center gap-2">
                             <MapPin size={14} className="text-primary" /> {residency.property.location}
                           </p>
                        </div>
                     </div>

                     {/* Info & Actions Side */}
                     <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-surface-bright relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        
                        <div>
                           <div className="flex justify-between items-start mb-10">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-primary-dark/30 uppercase tracking-[0.4em]">Managing since</p>
                                 <p className="text-sm font-black text-primary-dark uppercase italic tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                              </div>
                              <div className="px-4 py-2 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                 <ShieldCheck size={12} /> Verified Home
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-10">
                              <div className="p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                                 <p className="text-[9px] font-black text-primary-dark/30 uppercase tracking-widest mb-1.5">Monthly Rent</p>
                                 <p className="text-2xl font-black text-primary-dark tracking-tighter italic font-manrope">${residency.property.price}</p>
                              </div>
                              <div className="p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                                 <p className="text-[9px] font-black text-primary-dark/30 uppercase tracking-widest mb-1.5">Due Date</p>
                                 <p className="text-2xl font-black text-primary-dark tracking-tighter italic font-manrope">1st</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                           <button 
                             onClick={() => setIsMaintModalOpen(true)}
                             className="w-full py-4 bg-primary text-white rounded-2xl font-manrope font-extrabold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                           >
                             <Wrench size={18} /> Report Maintenance Issue
                           </button>
                           <p className="text-center text-[9px] font-black text-primary-dark/20 uppercase tracking-widest">
                             {(maintTickets || []).filter(t => t.status !== 'resolved').length} Active Support Tickets
                           </p>
                        </div>
                     </div>
                  </div>
                )}

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
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-primary/5 shadow-sm space-y-6">
                   <div className="flex justify-between items-center">
                    <h3 className="text-lg font-manrope font-extrabold text-primary-dark tracking-tight">Quick <span className="italic text-primary">Services</span></h3>
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
                      className="bg-white p-6 md:p-8 rounded-[2rem] border border-primary/5 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="text-sm font-manrope font-extrabold text-primary-dark tracking-tight flex items-center gap-2">
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
                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-primary/5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-end mb-8 md:mb-10 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">House Explorer</p>
                       <h3 className="text-2xl md:text-3xl font-manrope font-extrabold text-primary-dark tracking-tighter leading-none">Featured <span className="italic text-primary">Stays</span></h3>
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
                          <h3 className="text-xl font-manrope font-extrabold text-primary-dark tracking-tight">Saved <span className="italic text-primary text-2xl font-serif">Houses</span></h3>
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
                 <div className="bg-primary-dark p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[350px] md:min-h-[450px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-8 md:mb-10">
                          <div className="space-y-1">
                             <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Lifecycle</p>
                             <h3 className="text-lg md:text-xl font-manrope font-extrabold text-white tracking-tighter uppercase">My Journey</h3>
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
                        <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-primary/10 overflow-hidden">
                           <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" className="w-full h-full object-cover grayscale opacity-50" />
                        </div>
                      ))}
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[11px] font-black shadow-lg">+14</div>
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
              residency={residency}
            />
          )}
        </AnimatePresence>
      </>
    )}
  </main>
</div>
  )
}

// PREMIUM MAINTENANCE MODAL COMPONENT
const MaintenanceModal = ({ onClose, tickets, residency }: { onClose: () => void, tickets: any[], residency: any }) => {
  const [step, setStep] = useState<'list' | 'create'>('list')
  const [formData, setFormData] = useState<{ category: string, priority: 'low' | 'medium' | 'high' | 'emergency', description: string, images: string[] }>({ 
    category: 'plumbing', 
    priority: 'medium', 
    description: '',
    images: []
  })
  const [isUploading, setIsUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // Get active property for the current resident
  const activePropertyId = residency?.property?.id

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    try {
      const url = await uploadMaintenanceImage(file)
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
    } catch (err: any) {
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePropertyId) return
    setSubmitting(true)
    try {
      await submitMaintenanceRequest(activePropertyId, formData)
      setStep('list')
      setFormData({ category: 'plumbing', priority: 'medium', description: '', images: [] })
    } catch (err: any) {
      alert(err.message || "Failed to submit request")
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
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">Maintenance <span className="text-primary italic">Hub</span></h3>
              <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-[0.4em] mt-1">{residency?.property?.title || 'Private Report'} • Official Request</p>
            </div>
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
                       <p className="text-xs text-primary-dark/60 line-clamp-2 italic leading-relaxed mb-4">{t.description}</p>
                       
                       {t.images && t.images.length > 0 && (
                         <div className="flex gap-2">
                           {t.images.map((img: string, i: number) => (
                             <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border border-primary/10 shadow-sm">
                               <img src={img} className="w-full h-full object-cover" alt="issue detail" />
                             </div>
                           ))}
                         </div>
                       )}
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

                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 group-hover:bg-primary/10 transition-all">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary/40 group-hover:scale-110 transition-transform">
                          {isUploading ? <Loader2 className="animate-spin text-primary" size={18} /> : <Camera size={18} />}
                       </div>
                       <span className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest">
                          {isUploading ? 'Uploading Snapshot...' : formData.images.length > 0 ? `${formData.images.length} Photo(s) Attached` : 'Snap Evidence Photo'}
                       </span>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 px-2">
                       {formData.images.map((url, i) => (
                         <div key={i} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-primary/10 shadow-xl group/img">
                            <img src={url} className="w-full h-full object-cover" alt="preview" />
                            <button 
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                              className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X size={16} />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
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

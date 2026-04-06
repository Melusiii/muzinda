import { useParams, Link, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { useProperty, useFavorites, useUserApplications, type Application } from '../hooks/useSupabase'
import { submitApplication } from '../hooks/useSupabase'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Wifi, 
  Zap, 
  Wind, 
  Coffee,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Loader2,
  Camera,
  Heart,
  Share2,
  Lock,
  Building2,
  User2
} from 'lucide-react'
import { useState } from 'react'
import { getImageUrl } from '../utils/supabase-helpers'

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id)
  const { applications, loading: appsLoading } = useUserApplications()
  const { toggleFavorite, isFavorited } = useFavorites()
  const { isAuthenticated, user } = useAuth()
  
  const existingApp = applications.find((a: Application) => a.property_id === id)
  
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [message, setMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const navigate = useNavigate()

  const canApply = isAuthenticated && user?.role === 'student'

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: `/property/${id}` } } })
      return
    }
    if (user?.role !== 'student') return
    setShowApplyModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bright flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-bright">
        <h2 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter italic">Property not found</h2>
        <button onClick={() => navigate('/explorer')} className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Back to Explorer</button>
      </div>
    )
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)
    try {
      await submitApplication(property.id, message)
      setApplied(true)
      setTimeout(() => {
        setShowApplyModal(false)
        navigate('/dashboard')
      }, 2000)
    } catch (err: any) {
      alert(err.message || "Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  const amenities = [
    { icon: Wifi, label: 'High-speed Fiber' },
    { icon: Zap, label: 'Solar Power' },
    { icon: Wind, label: 'AC Ready' },
    { icon: Coffee, label: 'Kitchen' },
    { icon: ShieldCheck, label: '24/7 Security' },
    { icon: CheckCircle2, label: 'Daily Cleaning' }
  ]

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-24 relative pt-28 md:pt-0">
        {/* Navigation Floating Header (Mobile Friendly) */}
        <div className="fixed top-24 md:top-8 left-0 md:left-64 right-0 z-[45] px-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-primary/5 text-primary-dark font-black shadow-xl hover:bg-white transition-all group"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest leading-none">Back</span>
            </button>
            <div className="flex gap-3 pointer-events-auto">
               <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(property.id);
                }}
                className={cn(
                  "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-xl group",
                  isFavorited(property.id) 
                    ? "bg-red-500 text-white border-red-400" 
                    : "bg-white/90 backdrop-blur-md border-primary/5 text-primary-dark hover:text-red-500"
                )}
               >
                 <Heart size={20} className={cn("transition-transform", isFavorited(property.id) ? "fill-current scale-110" : "group-hover:scale-125")} />
               </button>
               <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl border border-primary/5 flex items-center justify-center text-primary-dark hover:text-primary transition-all shadow-xl">
                 <Share2 size={20} />
               </button>
            </div>
          </div>
        </div>

        {/* Cinematic Gallery Overhaul */}
        <div className="md:px-6 max-w-7xl mx-auto md:pt-8">
           <div className="relative group overflow-hidden md:rounded-[3.5rem] shadow-2xl bg-primary-dark aspect-[16/10] md:aspect-[21/9]">
              <img 
                src={getImageUrl(property.image_url)} 
                alt={property.title} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3s]"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-white">
                       {(property?.landlord?.verification_status || 'unverified') === 'verified' ? (
                         <div className="bg-primary px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/20 shadow-2xl">
                           <ShieldCheck size={14} className="text-white" />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verified House</span>
                         </div>
                       ) : (
                         <div className="bg-orange-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-orange-500/30">
                             <ShieldCheck size={14} className="text-orange-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Member House</span>
                         </div>
                       )}
                       <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                          <Star size={14} className="text-accent-gold fill-accent-gold" />
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{property.rating || 'New'}</span>
                       </div>
                       <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                          <Heart size={14} className="text-red-400 fill-current" />
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{property.likes_count || 0} Saved</span>
                       </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-manrope font-extrabold text-white tracking-tighter leading-none italic uppercase">
                       {property.name || property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-white/60 font-bold text-sm tracking-tight">
                       <MapPin size={16} className="text-primary" />
                       <span>{property.location}</span>
                    </div>
                 </div>
                 <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3 w-fit">
                   <Camera size={18} /> Cinematic View
                 </button>
              </div>
           </div>
        </div>

        {/* Content Structure (Bento Grid) */}
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Main Column */}
           <div className="lg:col-span-8 space-y-12">
              {/* Quick Metadata Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {[
                   { label: 'Type', value: property.type, icon: Building2 },
                   { label: 'Yield', value: `${property.total_rooms} Beds`, icon: User2 },
                   { label: 'Access', value: 'Instant Securing', icon: Lock },
                   { label: 'Social Proof', value: `${property.likes_count || 0} Liked`, icon: Star }
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm space-y-3 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
                      <div className="w-12 h-12 bg-primary/5 rounded-[1.2rem] flex items-center justify-center text-primary shadow-inner">
                         <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                         <p className="text-sm font-manrope font-black text-primary-dark capitalize leading-tight">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Description Bento */}
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-primary/5 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic mb-8 uppercase">The Experience</h3>
                 <div className="text-primary-dark/50 font-dm-sans text-lg leading-relaxed max-w-none italic">
                    <p className="whitespace-pre-line leading-loose">"{property.description}"</p>
                 </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4 px-4 overflow-hidden">
                    <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase shrink-0">Premium Hubs</h3>
                    <div className="h-[2px] bg-primary/5 w-full rounded-full" />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {amenities.map((item, i) => (
                      <div key={i} className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border border-primary/5 transition-all group hover:border-primary/20 hover:shadow-xl hover:-translate-y-1">
                         <div className="w-12 h-12 bg-surface-bright rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                            <item.icon size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-primary-dark leading-none uppercase tracking-tight">{item.label}</p>
                            <p className="text-[9px] font-black text-primary-dark/20 uppercase mt-1.5 tracking-widest">Fixed Asset</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Action Card */}
           <aside className="lg:col-span-4 lg:relative">
              <div className="sticky top-40 space-y-8">
                <div className="bg-primary-dark rounded-[3.5rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col justify-between border border-white/5">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -mr-40 -mt-40 blur-[120px] pointer-events-none" />
                   
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 leading-none">Yield Value</p>
                            <h2 className="text-6xl font-manrope font-black tracking-tighter leading-none italic">${property.price}</h2>
                            <p className="text-[11px] font-bold text-white/30 pt-3 italic uppercase tracking-widest">per month • fully inclusive</p>
                         </div>
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl"><ShieldCheck size={28} className="text-accent-gold" /></div>
                      </div>

                      <div className="space-y-8">
                         {[
                           { label: 'Lease Logic', value: 'Instant Digitization', icon: Zap },
                           { label: 'Deposit', value: 'Identity Protected', icon: ShieldCheck },
                           { label: 'Direct Sync', value: 'Landlord Priority', icon: MessageSquare }
                         ].map((spec, idx) => (
                           <div key={idx} className="flex gap-5 group/spec items-center">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 group-hover/spec:text-white group-hover/spec:bg-primary transition-all border border-white/5 shadow-inner">
                                 <spec.icon size={18} />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">{spec.label}</p>
                                 <p className="text-sm font-bold text-white tracking-tight leading-none italic uppercase">{spec.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="relative z-10 pt-12">
                       {(!appsLoading && (existingApp || applied)) ? (
                          <div className="w-full bg-white/10 border border-white/10 p-8 rounded-[2.5rem] space-y-4 backdrop-blur-md">
                             <div className="flex items-center gap-3 text-primary">
                                <CheckCircle2 size={24} />
                                <span className="text-sm font-black uppercase tracking-widest italic leading-none">Contract Requested</span>
                             </div>
                             <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                Current Status: <span className="text-white bg-primary/20 px-2 py-0.5 rounded-lg capitalize font-manrope">{existingApp?.status || applied ? 'Protocol Sent' : 'Active Integration'}</span>
                             </p>
                             <Link 
                                to="/dashboard" 
                                className="block w-full text-center py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all font-manrope shadow-inner border border-white/5"
                             >
                                Portal Center
                             </Link>
                          </div>
                       ) : (
                          <button 
                            onClick={handleApplyClick}
                            className="w-full bg-white text-primary-dark py-6 rounded-3xl font-manrope font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.95] transition-all flex items-center justify-center gap-4 group/btn italic uppercase"
                          >
                            Secure Seat
                            <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                       )}
                       <p className="text-[10px] text-center text-white/20 font-black uppercase tracking-widest mt-8 leading-relaxed italic opacity-50">
                         Student Partnership Program <br /> Muzinda Concierge Verified
                       </p>
                    </div>
                </div>

                {/* Secondary Trust Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm flex items-center gap-5 group/v">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                      (property?.landlord?.verification_status || 'unverified') === 'verified' ? "bg-primary/5 text-primary" : "bg-orange-500/5 text-orange-500"
                    )}>
                       <Building2 size={24} className="group-hover/v:scale-110 transition-transform" />
                    </div>
                    <div>
                       <p className="text-xs font-black text-primary-dark leading-none uppercase tracking-tight italic">
                        {(property?.landlord?.verification_status || 'unverified') === 'verified' ? 'Premier Owner' : 'Standard Owner'}
                       </p>
                       <p className="text-[9px] font-black text-primary-dark/20 uppercase mt-1.5 tracking-widest">
                         Institutional Identity Verified
                       </p>
                    </div>
                 </div>
              </div>
           </aside>
        </div>
      </main>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur-2xl border-t border-primary/5 pb-safe">
         {(existingApp || applied) ? (
            <Link 
              to="/dashboard"
              className="w-full bg-primary/10 text-primary py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border border-primary/20 uppercase tracking-widest"
            >
              <CheckCircle2 size={18} />
              Track Active Security Handshake
            </Link>
         ) : !isAuthenticated ? (
            <button
              onClick={handleApplyClick}
              className="w-full bg-primary-dark text-white py-5 rounded-2xl font-black text-sm shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Sign in to Secure
              <ArrowRight size={18} />
            </button>
         ) : canApply ? (
            <button 
              onClick={handleApplyClick}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest italic"
            >
              Secure Stay • ${property.price}/mo
              <ArrowRight size={18} />
            </button>
         ) : null}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-primary-dark/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {!applied ? (
                <div className="p-10 md:p-14 space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase leading-none">Interest Protocol</h2>
                    <p className="text-primary-dark/40 font-dm-sans text-sm leading-relaxed italic">
                      Verified Muzinda students receive prioritization. Mention your semester start date and university affiliation.
                    </p>
                  </div>

                  <form onSubmit={handleApply} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-[0.4em] mx-4 leading-none">Identity Narrative</label>
                       <textarea 
                         required
                         rows={4}
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder="Introduce yourself to the Haven owner..."
                         className="w-full p-8 rounded-[2.5rem] bg-surface-bright border border-primary/5 focus:bg-white focus:border-primary/30 outline-none font-dm-sans transition-all resize-none shadow-inner italic text-sm"
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={applying}
                      className="w-full bg-primary-dark text-white py-6 rounded-3xl font-manrope font-black text-xl shadow-2xl shadow-primary-dark/20 flex items-center justify-center gap-4 group italic uppercase active:scale-95 transition-all"
                    >
                      {applying ? (
                         <>
                           <Loader2 className="animate-spin" size={24} />
                           Securing Handshake...
                         </>
                      ) : (
                        <>
                          Finalize Interest
                          <MessageSquare size={24} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-14 text-center space-y-8">
                   <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={48} className="text-primary" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter italic leading-tight uppercase">Intent Recorded</h2>
                      <p className="text-primary-dark/50 font-dm-sans italic">
                        Your protocol has been logged at Muzinda Hub. The owner will respond via secure messenger.
                      </p>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PropertyDetail

import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useProperty, submitApplication, useFavorites } from '../hooks/useSupabase'
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
  Calendar,
  MessageSquare,
  ArrowRight,
  Loader2,
  Camera,
  Heart,
  Share2,
  Lock,
  Building2,
  User2,
  Check
} from 'lucide-react'
import { useState } from 'react'
import { getImageUrl } from '../utils/supabase-helpers'

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id)
  const { toggleFavorite, isFavorited } = useFavorites()
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [message, setMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const navigate = useNavigate()

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </Layout>
    )
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold font-manrope">Property not found</h2>
          <Link to="/explorer" className="text-primary font-bold">Back to Explorer</Link>
        </div>
      </Layout>
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
    <Layout>
      <div className="min-h-screen bg-[#F8F9F8] font-dm-sans pb-24">
        {/* Navigation Floating Header */}
        <div className="fixed top-24 left-0 right-0 z-30 px-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-primary/5 text-primary-dark font-black shadow-xl hover:bg-white transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs uppercase tracking-widest">Back</span>
            </button>
            <div className="flex gap-3 pointer-events-auto">
               <button 
                onClick={() => toggleFavorite(property.id)}
                className={cn(
                  "w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-xl",
                  isFavorited(property.id) ? "bg-red-500 text-white border-red-400" : "bg-white/90 backdrop-blur-md border-primary/5 text-primary-dark hover:text-red-500"
                )}
               >
                 <Heart size={20} className={isFavorited(property.id) ? "fill-current" : ""} />
               </button>
               <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full border border-primary/5 flex items-center justify-center text-primary-dark hover:text-primary transition-colors shadow-xl">
                 <Share2 size={20} />
               </button>
            </div>
          </div>
        </div>

        {/* Cinematic Gallery Overhaul */}
        <div className="pt-24 md:px-6 max-w-7xl mx-auto">
           <div className="relative group overflow-hidden md:rounded-[4rem] shadow-2xl bg-primary-dark aspect-[16/10] md:aspect-[21/9]">
              <img 
                src={getImageUrl(property.image_url)} 
                alt={property.title} 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                       {property.landlord?.verification_status === 'verified' ? (
                         <div className="bg-primary px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20 shadow-2xl">
                           <ShieldCheck size={14} className="text-white" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Oasis</span>
                         </div>
                       ) : (
                         <div className="bg-orange-500/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-500/30 shadow-xl">
                            <ShieldCheck size={14} className="text-orange-500" />
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Standard Member</span>
                         </div>
                       )}
                       <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                          <Star size={14} className="text-accent-gold fill-accent-gold" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{property.rating || '4.9'} ({property.reviews_count || '24'} Reviews)</span>
                       </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-manrope font-black text-white tracking-tighter leading-none italic">
                       {property.name || property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-white/60 font-bold text-sm">
                       <MapPin size={18} className="text-primary" />
                       <span>{property.location} • {property.distance} from Campus</span>
                    </div>
                 </div>
                 <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3">
                   <Camera size={18} /> View All Photos
                 </button>
              </div>
           </div>
        </div>

        {/* Content Structure Overhaul (Bento Grid) */}
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-visible">
           {/* Main Column */}
           <div className="lg:col-span-8 space-y-12">
              {/* Quick Metadata Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Type', value: property.type, icon: Building2 },
                   { label: 'Capacity', value: `${property.total_rooms} Beds`, icon: User2 },
                   { label: 'Availability', value: 'Instant Securing', icon: Lock },
                   { label: 'Ranking', value: '#1 Trusted', icon: Star }
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-3 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                         <item.icon size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest">{item.label}</p>
                         <p className="text-md font-manrope font-black text-primary-dark capitalize leading-none pt-1">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Description Bento */}
              <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter italic mb-6">The Living Experience</h3>
                 <div className="prose prose-p:text-primary-dark/60 prose-p:font-dm-sans prose-p:text-lg leading-relaxed max-w-none">
                    <p className="whitespace-pre-line">{property.description}</p>
                 </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-8">
                 <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter italic px-4">Standard Luxuries</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {amenities.map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-primary/5 hover:border-primary/20 transition-all group">
                         <div className="w-14 h-14 bg-[#F8F9F8] rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                            <item.icon size={24} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-primary-dark leading-none">{item.label}</p>
                            <p className="text-[9px] font-bold text-primary-dark/30 uppercase mt-1 tracking-widest">Included Premium</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Action Card - FIXED NON-OVERLAPPING */}
           <aside className="lg:col-span-4 relative">
              <div className="sticky top-40 space-y-8">
                <div className="bg-primary-dark rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col justify-between border border-white/5">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-[100px] pointer-events-none" />
                   
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Total Value</p>
                            <h2 className="text-6xl font-manrope font-black tracking-tighter italic leading-none">${property.price}</h2>
                            <p className="text-sm font-bold text-white/30 pt-2 italic">per month • fully inclusive</p>
                         </div>
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl"><Check size={28} className="text-accent-gold" /></div>
                      </div>

                      <div className="space-y-8">
                         {[
                           { label: 'Lease Start', value: 'Next Semester', icon: Calendar },
                           { label: 'Security Deposit', value: 'Zero-Shield Protection', icon: ShieldCheck },
                           { label: 'Guaranteed', value: 'Direct Landlord Sync', icon: MessageSquare }
                         ].map((spec, idx) => (
                           <div key={idx} className="flex gap-4 group/spec">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover/spec:text-white transition-colors border border-white/5 shadow-inner">
                                 <spec.icon size={18} />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">{spec.label}</p>
                                 <p className="text-sm font-bold text-white tracking-tight mt-1 leading-none">{spec.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="relative z-10 pt-12">
                      <button 
                        onClick={() => setShowApplyModal(true)}
                        className="w-full bg-white text-primary-dark py-6 rounded-3xl font-manrope font-black text-xl shadow-2xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn"
                      >
                        Express Interest
                        <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-widest mt-6 leading-relaxed">
                        Institutionally Vetted <br /> Student Experience Guaranteed
                      </p>
                   </div>
                </div>

                {/* Secondary Trust Card */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md group/v">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                      property.landlord?.verification_status === 'verified' ? "bg-primary/5 text-primary" : "bg-orange-500/5 text-orange-500"
                    )}>
                       <Building2 size={24} className="group-hover/v:scale-110 transition-transform" />
                    </div>
                    <div>
                       <p className="text-xs font-black text-primary-dark leading-none">
                         {property.landlord?.verification_status === 'verified' ? 'Vetted Landlord' : 'Standard Member'}
                       </p>
                       <p className="text-[9px] font-black text-primary-dark/30 uppercase mt-1 tracking-widest">
                         {property.landlord?.verification_status === 'verified' ? 'Institutionally Verified' : 'Awaiting Full Vetting'}
                       </p>
                    </div>
                 </div>
              </div>
           </aside>
        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-white/80 backdrop-blur-xl border-t border-primary/5">
         <button 
           onClick={() => setShowApplyModal(true)}
           className="w-full bg-primary text-white py-5 rounded-2xl font-black text-md shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
         >
           Secure Housing • ${property.price}/mo
           <ArrowRight size={20} />
         </button>
      </div>

      {/* Application Modal (Same as before but with consistent styling) */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
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
              className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              {!applied ? (
                <div className="p-10 md:p-14 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter italic">Handshake Request</h2>
                    <p className="text-primary-dark/50 font-dm-sans text-sm">
                      Introduce yourself to the landlord. Verified students receive prioritized technical vetting and responses.
                    </p>
                  </div>

                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest px-4">Direct Message to Landlord</label>
                       <textarea 
                         required
                         rows={4}
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder="Hi! I'm an AU student interested in this boarding house. Is it available for next semester?"
                         className="w-full p-8 rounded-[3rem] bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 outline-none font-dm-sans transition-all resize-none shadow-inner"
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={applying}
                      className="w-full bg-[#1E3011] text-white py-6 rounded-3xl font-manrope font-black text-xl shadow-2xl shadow-[#1E3011]/20 flex items-center justify-center gap-4 group"
                    >
                      {applying ? (
                         <>
                           <Loader2 className="animate-spin" size={24} />
                           Securing Handshake...
                         </>
                      ) : (
                        <>
                          Express Interest
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
                      <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter italic leading-tight">Request Sent!</h2>
                      <p className="text-primary-dark/50 font-dm-sans">
                        Your interest has been logged at Muzinda Command. The landlord will contact you via secure messages.
                      </p>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default PropertyDetail

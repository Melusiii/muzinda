import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useProperty, submitApplication } from '../hooks/useSupabase'
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
  Phone
} from 'lucide-react'
import { useState } from 'react'

// Extract phone number embedded in description by PostListingModal
const parseDescription = (desc: string) => {
  const phoneMatch = desc.match(/📞 Contact: (.+)\n\n/)
  const phone = phoneMatch ? phoneMatch[1] : null
  const body = desc.replace(/📞 Contact: .+\n\n/, '').trim()
  return { phone, body }
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id)
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

  const { phone: landlordPhone, body: cleanDescription } = parseDescription(property.description)

  return (
    <Layout>
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-dark/40 font-bold hover:text-primary transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Results
        </button>

        {/* Hero Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[500px]">
          <div className="md:col-span-8 h-[300px] md:h-auto rounded-[3rem] overflow-hidden shadow-2xl relative group">
             <img
               src={property.image_url}
               alt={property.title}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute top-8 left-8">
                {property.verified ? (
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                    <ShieldCheck size={18} className="text-[#4F7C2C]" />
                    <span className="text-xs font-black text-primary-dark uppercase tracking-widest">AU Verified</span>
                  </div>
                ) : (
                  <div className="bg-amber-500/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                    <ShieldCheck size={18} className="text-white" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Pending Verification</span>
                  </div>
                )}
             </div>
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-6 h-[300px] md:h-auto">
             <div className="rounded-[2.5rem] overflow-hidden shadow-xl">
                <img 
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1000&auto=format&fit=crop'} 
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="rounded-[2.5rem] overflow-hidden shadow-xl relative cursor-pointer group">
                <img 
                  src={property.images?.[1] || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1000&auto=format&fit=crop'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white font-bold">View All Photos</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <Star size={16} fill="currentColor" />
                 <span className="text-sm font-black tracking-widest uppercase">4.9 (24 Reviews)</span>
              </div>
              <h1 className="text-5xl font-manrope font-black text-primary-dark tracking-tighter leading-none">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-primary-dark/40 font-bold">
                 <MapPin size={18} />
                 <span>{property.location} • {property.distance} from Africa University</span>
              </div>
            </div>

            <div className="p-8 bg-[#F8F9F8] rounded-[2.5rem] border border-primary/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <div className="space-y-1">
                  <p className="text-[10px] text-primary-dark/40 font-black uppercase tracking-widest">Type</p>
                  <p className="text-lg font-manrope font-black text-primary-dark capitalize">{property.type}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-primary-dark/40 font-black uppercase tracking-widest">Status</p>
                  <p className="text-lg font-manrope font-black text-[#4F7C2C]">Available</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-primary-dark/40 font-black uppercase tracking-widest">Rooms</p>
                  <p className="text-lg font-manrope font-black text-primary-dark">{property.available_rooms}/{property.total_rooms}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-primary-dark/40 font-black uppercase tracking-widest">Gender</p>
                  <p className="text-lg font-manrope font-black text-primary-dark">Mixed</p>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-manrope font-black text-primary-dark">About this property</h3>
               <p className="text-lg text-primary-dark/60 leading-relaxed font-dm-sans max-w-3xl">
                 {cleanDescription}
               </p>
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-manrope font-black text-primary-dark">Amenities</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { icon: Wifi, label: 'High-speed Fiber' },
                    { icon: Zap, label: 'Solar Power Backup' },
                    { icon: Wind, label: 'Air Conditioning' },
                    { icon: Coffee, label: 'Communal Kitchen' },
                    { icon: ShieldCheck, label: '24/7 Security' },
                    { icon: Calendar, label: 'Weekly Cleaning' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-primary-dark/60">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-primary/5 shadow-sm">
                          <item.icon size={18} className="text-primary" />
                       </div>
                       <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-[11px] font-black text-primary-dark/40 uppercase tracking-[0.2em] mb-1">Monthly Cost</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-manrope font-black text-primary-dark">${property.price}</span>
                        <span className="text-lg font-bold text-primary-dark/30">/mo</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-[#F8F9F8] rounded-2xl border border-primary/5">
                     <Calendar className="text-primary" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-primary-dark/40 uppercase tracking-widest">Lease Term</p>
                        <p className="text-sm font-bold text-primary-dark">Semester Based (Flexible)</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#F8F9F8] rounded-2xl border border-primary/5">
                     <ShieldCheck className="text-primary" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-primary-dark/40 uppercase tracking-widest">Protection</p>
                        <p className="text-sm font-bold text-primary-dark">Muzinda Secured Payment</p>
                     </div>
                  </div>
                  {landlordPhone && (
                    <div className="flex items-center gap-3 p-4 bg-[#F8F9F8] rounded-2xl border border-primary/5">
                       <Phone className="text-primary" size={20} />
                       <div>
                          <p className="text-[10px] font-black text-primary-dark/40 uppercase tracking-widest">Contact Landlord</p>
                          <p className="text-sm font-bold text-primary-dark">{landlordPhone}</p>
                       </div>
                    </div>
                  )}
               </div>

               <button 
                 onClick={() => setShowApplyModal(true)}
                 className="w-full bg-[#1E3011] text-white py-6 rounded-2xl font-manrope font-black text-xl shadow-2xl shadow-[#1E3011]/20 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
               >
                 Express Interest
                 <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
               </button>

               <div className="text-center">
                  <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-widest leading-relaxed">
                    By applying, you agree to Muzinda's <br />
                    student safety & vetting terms.
                  </p>
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
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
                    <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter">Fast-Track Application</h2>
                    <p className="text-primary-dark/50 font-dm-sans">
                      Introduce yourself to the landlord. Verified AU students get prioritized responses.
                    </p>
                  </div>

                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-primary-dark/40 uppercase tracking-widest px-2">Your Message</label>
                       <textarea 
                         required
                         rows={4}
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder="Hi! I'm an AU student interested in this studio. Is it available for the upcoming semester?"
                         className="w-full p-6 rounded-[2rem] bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 outline-none font-dm-sans transition-all resize-none"
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={applying}
                      className="w-full bg-primary text-white py-6 rounded-2xl font-manrope font-black text-xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group"
                    >
                      {applying ? (
                         <>
                           <Loader2 className="animate-spin" size={24} />
                           Sending Application...
                         </>
                      ) : (
                        <>
                          Submit Application
                          <MessageSquare size={24} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-14 text-center space-y-8">
                   <div className="w-24 h-24 bg-[#4F7C2C]/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={48} className="text-[#4F7C2C]" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter">Application Sent!</h2>
                      <p className="text-primary-dark/50 font-dm-sans">
                        Your interest has been logged. The landlord will contact you via Muzinda messages.
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

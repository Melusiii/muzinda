import { useState, useEffect } from 'react'
import { MapPin, Phone, Bus, CheckCircle2, Clock, Users, Star, CreditCard, ShieldCheck } from 'lucide-react'
import { cn } from '../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { useServices, useStudentServiceApplications } from '../hooks/useSupabase'
import { ApplyServiceModal } from '../components/ApplyServiceModal'
import { getImageUrl } from '../utils/supabase-helpers'
import { ManageSubscriptionModal } from '../components/ManageSubscriptionModal'

import { supabase } from '../lib/supabase'

const QRBox = () => (
  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 relative group overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-full h-full border-2 border-white/40 border-dashed rounded-lg flex items-center justify-center relative z-10">
      <div className="grid grid-cols-3 gap-1">
         {[...Array(9)].map((_, i) => (
           <div key={i} className={cn("w-1.5 h-1.5 rounded-sm bg-white", i % 2 === 0 ? "opacity-100" : "opacity-40")} />
         ))}
      </div>
    </div>
  </div>
)

const WaveAnimation = () => (
  <div className="absolute inset-0 pointer-events-none opacity-20">
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-primary"
        initial={{ pathLength: 0, opacity: 0, d: "M0 50 Q 25 40, 50 50 T 100 50" }}
        animate={{ 
          pathLength: [0, 1], 
          opacity: [0, 1, 0],
          d: [
            "M0 50 Q 25 40, 50 50 T 100 50",
            "M0 50 Q 25 60, 50 50 T 100 50",
            "M0 50 Q 25 40, 50 50 T 100 50"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
)

const StatusTrackingTile = ({ app }: { app: any }) => {
  const steps = [
    { label: 'Request Sent', status: 'completed', icon: CheckCircle2 },
    { label: 'Provider Review', status: 'active', icon: Clock },
    { label: 'Pass Issued', status: 'pending', icon: CreditCard }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[3rem] border-2 border-dashed border-primary/20 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 text-center md:text-left">
           <div className="inline-flex items-center gap-2 bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-2xl border border-accent-gold/20">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest font-manrope">Verification in Progress</span>
           </div>
           <h2 className="text-3xl font-manrope font-black tracking-tighter text-primary-dark uppercase italic">Hold tight, {app.profiles?.full_name?.split(' ')[0] || 'Student'}!</h2>
           <p className="text-primary-dark/40 text-xs font-bold leading-relaxed max-w-md">Your application for <span className="text-primary">{app.service?.name}</span> is being reviewed by the provider. Secure boarding is our priority.</p>
        </div>

        <div className="flex gap-4">
           {steps.map((step, idx) => (
             <div key={idx} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                  step.status === 'completed' ? "bg-primary text-white" :
                  step.status === 'active' ? "bg-accent-gold text-white animate-pulse" : "bg-primary/5 text-primary/20"
                )}>
                  <step.icon size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-primary-dark/40">{step.label}</span>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  )
}

const PremiumPassBento = ({ app, onManage }: { app: any, onManage: () => void }) => {
  const approvedDate = app.approved_at ? new Date(app.approved_at) : new Date()
  const expiryDate = new Date(approvedDate)
  expiryDate.setMonth(expiryDate.getMonth() + 1)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-primary-dark p-8 md:p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[260px] border border-white/5"
    >
      <WaveAnimation />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/30 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/20 rounded-full -ml-32 -mb-32 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-4">
           <div className="flex items-center gap-3 bg-white/5 backdrop-blur-3xl px-4 py-2 rounded-2xl border border-white/10 w-fit">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest font-manrope">Verified Active Pass</span>
           </div>
           <div>
              <h2 className="text-5xl font-manrope font-black tracking-tighter leading-none">{app.service?.name}</h2>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-3">Muzinda Institutional Network</p>
           </div>
        </div>
        <QRBox />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 mt-auto">
        <div className="flex gap-12">
          <div className="space-y-1">
            <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest font-manrope">Verification ID</p>
            <p className="text-sm font-manrope font-black tracking-tight leading-none uppercase italic font-mono text-primary">#MZ-{app.id.slice(0, 8)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest font-manrope">Next Boarding</p>
            <p className="text-sm font-manrope font-black tracking-tight leading-none text-accent-gold uppercase italic">
               {expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href={`tel:${app.service?.profiles?.phone || ''}`} className="p-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10 backdrop-blur-md">
            <Phone size={18} />
          </a>
          <button 
            onClick={onManage}
            className="px-10 py-5 bg-primary text-white rounded-[2.5rem] font-black font-manrope transition-all hover:bg-primary-dark hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 text-[10px] uppercase tracking-widest border border-white/20"
          >
            Manage Membership
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export const StudentTransport = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [pulseIndex, setPulseIndex] = useState(0)

  const pulses = [
    "14 Students boarding now",
    "Mutual Trust Transit Network",
    "Verified Doorstep Pickup Active",
    "Muzinda • Institutional Grade"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % pulses.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const { services: monthlyShuttles, loading: servicesLoading } = useServices('transport')
  const { applications: myApps, loading: appsLoading, refetch: refetchMyApps } = useStudentServiceApplications()

  const handleApplyClick = (service: any) => {
    setSelectedService(service)
    setIsApplyModalOpen(true)
  }

  const handleCancelSubscription = async () => {
    if (!approvedApp) return;
    if (!confirm("Are you sure you want to cancel your institutional membership? Your pass will remain active until the end of the billing cycle.")) return;

    try {
      const { error } = await supabase
        .from('service_applications')
        .update({ status: 'vacated' })
        .eq('id', approvedApp.id);

      if (error) throw error;
      
      setIsManageModalOpen(false);
      refetchMyApps();
      alert("Subscription cancelled successfully.");
    } catch (err: any) {
      console.error(err);
      alert("Failed to cancel subscription: " + err.message);
    }
  }

  const approvedApp = myApps.find(a => a.status === 'approved')
  const pendingApp = myApps.find(a => a.status === 'pending')

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />

      <main className="flex-1 md:ml-64 p-6 pt-32 md:pt-32 md:p-8 min-h-screen relative z-10">
        {/* SENIOR HEADER */}
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16 space-y-6"
        >
          <div className="flex items-center gap-4">
             <div className="h-0.5 w-12 bg-primary rounded-full" />
             <AnimatePresence mode="wait">
               <motion.span 
                 key={pulseIndex}
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -5 }}
                 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary"
               >
                 {pulses[pulseIndex]}
               </motion.span>
             </AnimatePresence>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-7xl font-black tracking-tighter text-primary-dark font-manrope leading-none mb-2">
                Transit <span className="text-primary italic">Hub</span>
              </h1>
              <p className="text-primary-dark/30 font-bold uppercase tracking-widest text-[11px] ml-1">
                 Institutional Logistics • Professional Fleet Management
              </p>
            </div>
            {approvedApp && (
               <button 
                 onClick={() => setIsManageModalOpen(true)}
                 className="bg-white px-6 py-4 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all text-left"
               >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><CreditCard size={20} /></div>
                  <div>
                     <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-widest leading-none">Subscription</p>
                     <p className="text-sm font-black text-primary-dark tracking-tight">Manage Active Pass</p>
                  </div>
               </button>
            )}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            
            {/* STATE-DRIVEN HERO */}
            <section className="space-y-8">
               {approvedApp ? (
                 <>
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-manrope font-black text-primary-dark tracking-tight uppercase">Current Membership</h2>
                      <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Digital Badge ID: #MZ-{approvedApp.id.slice(0,6)}</span>
                   </div>
                   <PremiumPassBento app={approvedApp} onManage={() => setIsManageModalOpen(true)} />
                 </>
               ) : pendingApp ? (
                 <>
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-manrope font-black text-primary-dark tracking-tight italic uppercase">Processing Application</h2>
                   </div>
                   <StatusTrackingTile app={pendingApp} />
                 </>
               ) : (
                 <div className="bg-white p-10 rounded-[4rem] border border-primary/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative z-10 max-w-xl">
                       <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter leading-tight mb-4">Reliable Boarding for Africa <span className="italic text-primary">University.</span></h2>
                       <p className="text-primary-dark/40 font-bold text-sm leading-relaxed mb-8">Join the elite network of student transit. Doorstep pickups, verified institutional drivers, and transparent monthly pricing.</p>
                       <div className="flex gap-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><ShieldCheck size={18} /></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark/60">Verified Safety</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Users size={18} /></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark/60">1.2k+ Students</span>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </section>

            {/* MARKETPLACE FLEET */}
            <section className="space-y-10">
               <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter uppercase">Institutional <span className="italic text-primary">Fleets</span></h3>
                  <div className="h-0.5 flex-1 bg-primary/5 rounded-full" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {servicesLoading || appsLoading ? (
                   <div className="col-span-full py-20 text-center animate-pulse">
                      <Bus className="mx-auto text-primary/10 mb-4" size={48} />
                      <p className="text-primary/20 font-black italic tracking-widest uppercase text-[10px]">Updating Institutional Database...</p>
                   </div>
                 ) : monthlyShuttles.length > 0 ? monthlyShuttles.map((s, idx) => {
                   const myApp = myApps.find(a => a.service_id === s.id)
                   const approvedCount = s.approved_count?.[0]?.count || 0
                   const capacity = s.capacity || 14
                   const seatsLeft = Math.max(0, capacity - approvedCount)
                   const isFull = seatsLeft === 0

                   const isCurrentApproved = myApp?.status === 'approved'
                   const isCurrentPending = myApp?.status === 'pending'

                   return (
                     <motion.div 
                       key={s.id || `shuttle-${idx}`}
                       whileHover={{ y: -8, scale: 1.01 }}
                       className={cn(
                        "group bg-white rounded-[4rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col",
                        isCurrentApproved && "ring-4 ring-primary ring-offset-8"
                       )}
                     >
                        <div className="relative aspect-video overflow-hidden bg-gray-50 border-b border-primary/5">
                           {s.image_url ? (
                             <img src={getImageUrl(s.image_url)} alt={s.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-primary-dark/10">
                               <Bus size={64} />
                             </div>
                           )}
                           
                           {/* Status Overlays */}
                           <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-white/20">
                             {isCurrentApproved ? <CheckCircle2 size={12} className="text-primary" /> : 
                              isCurrentPending ? <Clock size={12} className="text-accent-gold" /> : <Star size={12} className="text-accent-gold fill-accent-gold" />}
                             <span className={cn("text-[10px] font-black tracking-tighter uppercase", isCurrentApproved ? "text-primary" : "text-primary-dark")}>
                                {isCurrentApproved ? 'Active Pass' : isCurrentPending ? 'Under Review' : 'Verified Fleet'}
                             </span>
                           </div>

                           <div className="absolute bottom-6 right-6 bg-primary-dark/95 backdrop-blur-lg px-6 py-4 rounded-3xl border border-white/10 shadow-2xl">
                             <span className="text-lg font-manrope font-black text-white italic">${s.price}<span className="text-[10px] text-white/50 not-italic ml-1 uppercase font-dm-sans tracking-widest">/mo</span></span>
                           </div>
                        </div>

                        <div className="p-8 space-y-6">
                           <div>
                              <h4 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter uppercase leading-none">{s.name}</h4>
                              <div className="text-[11px] font-bold text-primary-dark/30 uppercase mt-3 tracking-widest flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                                 {s.profiles?.full_name || 'Verified Provider'}
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-8 py-5 border-y border-primary/5">
                              <div className="flex items-center gap-3 text-primary">
                                 <Users size={18} className="opacity-40" />
                                 <span className="text-[11px] font-black uppercase tracking-widest text-primary-dark/60">
                                    {isFull ? 'Limit Reached' : `${seatsLeft} Seats Left`}
                                 </span>
                              </div>
                              <div className="flex items-center gap-3 text-primary">
                                 <MapPin size={18} className="opacity-40" />
                                 <span className="text-[11px] font-black uppercase tracking-widest text-primary-dark/60">Campus Pickups</span>
                              </div>
                           </div>

                           <div className="flex gap-4 pt-2">
                              {isCurrentApproved ? (
                                <button disabled className="flex-1 py-5 bg-primary/5 text-primary rounded-[2.5rem] font-manrope font-black text-[11px] uppercase tracking-[0.2em] border border-primary/10 cursor-not-allowed">
                                   Seat Secured
                                </button>
                              ) : isCurrentPending ? (
                                <button disabled className="flex-1 py-5 bg-accent-gold/5 text-accent-gold rounded-[2.5rem] font-manrope font-black text-[11px] uppercase tracking-[0.2em] border border-accent-gold/10 flex items-center justify-center gap-2">
                                   Pending Approval
                                </button>
                              ) : (
                                <button 
                                  disabled={isFull || !!approvedApp}
                                  onClick={() => handleApplyClick(s)}
                                  className={cn(
                                    "flex-1 py-6 rounded-[2.5rem] font-manrope font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl",
                                    (isFull || !!approvedApp) 
                                      ? "bg-[#F0F2F0] text-primary-dark/20 border-2 border-dashed border-primary/10" 
                                      : "bg-primary-dark text-white hover:bg-primary shadow-primary/20 hover:scale-[1.02] active:scale-95"
                                  )}
                                >
                                   {isFull ? 'Booking Full' : approvedApp ? 'Pass Active' : 'request monthly pass'}
                                </button>
                              )}
                              <a href={`tel:${s.profiles?.phone || ''}`} className="p-6 bg-primary/5 text-primary/40 hover:text-primary rounded-[2.5rem] border border-primary/5 transition-all hover:bg-primary/10">
                                <Phone size={22} />
                              </a>
                           </div>
                        </div>
                     </motion.div>
                   )
                 }) : (
                   <div className="col-span-full py-28 text-center border-4 border-dashed border-primary/5 rounded-[5rem]">
                      <Bus className="mx-auto text-primary-dark/5 mb-6" size={64} />
                      <p className="text-primary-dark/20 font-black italic text-xl uppercase tracking-[0.4em]">Fleet Database Offline</p>
                   </div>
                 )}
               </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-12">
             {/* CONTEXTUAL TILE: TRUST SCORE */}
             <div className="bg-white p-10 rounded-[4rem] border border-primary/5 shadow-sm">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6"><ShieldCheck size={24} /></div>
                <h4 className="text-xl font-manrope font-black text-primary-dark uppercase italic mb-2">Network Safety</h4>
                <p className="text-xs text-primary-dark/40 font-bold leading-relaxed mb-6">Every driver in the Muzinda network undergoes a rigorous biometric and vehicle inspection process.</p>
                <div className="flex items-center gap-2 text-primary">
                   <Star size={14} className="fill-primary" />
                   <Star size={14} className="fill-primary" />
                   <Star size={14} className="fill-primary" />
                   <Star size={14} className="fill-primary" />
                   <Star size={14} className="fill-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest ml-1">98% Safety Score</span>
                </div>
             </div>

             {/* PROTOCOL GUIDE */}
             <div className="bg-primary-dark p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                <h4 className="text-2xl font-manrope font-black italic tracking-tight mb-10 uppercase">Hub Protocol</h4>
                <div className="space-y-10">
                   {[
                     { step: 'Select Fleet', icon: Bus },
                     { step: 'Submit Pass', icon: CreditCard },
                     { step: 'Verification', icon: ShieldCheck },
                     { step: 'Live Boarding', icon: MapPin }
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-6 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40"><item.icon size={20} /></div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Step 0{idx + 1}</p>
                           <p className="text-xs font-black uppercase tracking-widest text-white">{item.step}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </main>

      <AnimatePresence mode="wait">
        {isApplyModalOpen && (
          <ApplyServiceModal 
            key="shuttle-apply-modal"
            isOpen={isApplyModalOpen} 
            onClose={() => setIsApplyModalOpen(false)} 
            service={selectedService} 
            onSuccess={() => {
              refetchMyApps();
              setIsApplyModalOpen(false);
            }} 
          />
        )}
        {isManageModalOpen && (
          <ManageSubscriptionModal
            key="shuttle-manage-modal"
            isOpen={isManageModalOpen}
            onClose={() => setIsManageModalOpen(false)}
            app={approvedApp}
            onCancel={handleCancelSubscription}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default StudentTransport

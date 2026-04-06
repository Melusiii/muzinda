import { 
  Clock, 
  Star, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  X, 
  Bus, 
  ChevronRight,
  Settings,
  Loader2,
  Camera
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  useProviderService, 
  useServiceApplications, 
  updateServiceApplicationStatus,
  createService,
  updateProviderService,
  uploadServiceImage
} from '../hooks/supabase/useProviders'

const SERVICE_CATEGORIES = [
  'transport',
  'cleaning',
  'handyman',
  'laundry',
  'delivery',
  'tutoring'
]

import { HandymanDashboard } from './HandymanDashboard'
import { TransportDashboard } from './TransportDashboard'

export const ProviderDashboard = () => {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [showSetup, setShowSetup] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const { service, loading: serviceLoading, refetch: refetchService } = useProviderService()
  const { applications, loading: appsLoading, refetch: refetchApps } = useServiceApplications(service?.id)
  
  const handleSetupService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        price: parseFloat(formData.get('price') as string),
        capacity: parseInt(formData.get('capacity') as string),
        description: formData.get('description') as string,
      }

      let imageUrl = service?.image_url || ''
      if (selectedFile) {
        imageUrl = await uploadServiceImage(selectedFile)
      }

      if (isEditing && service) {
        await updateProviderService(service.id, { ...data, image_url: imageUrl })
      } else {
        await createService({ ...data, image_url: imageUrl })
      }
      
      await refetchService()
      if (refetchApps) await refetchApps()
      setShowSetup(false)
      setSelectedFile(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (appId: string, status: 'approved' | 'rejected') => {
    setProcessingId(appId)
    try {
      await updateServiceApplicationStatus(appId, status)
      await refetchApps()
      await refetchService()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const activeApps = (applications || []).filter(a => a.status === 'approved')
  const pendingApps = (applications || []).filter(a => a.status === 'pending')
  const monthlyRevenue = activeApps.length * (service?.price || 0)
  
  // If service exists, render the specialized dashboard
  if (service) {
    if (service.category === 'handyman') return <HandymanDashboard />
    if (service.category === 'transport') return <TransportDashboard />
  }

  // Fallback to Setup/Activation view for new providers
  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />

      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-28 md:p-8 min-h-screen relative z-10">
        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-0.5 w-12 bg-primary rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Muzinda Partner Network</span>
            </div>
            <div>
              <h1 className="text-7xl font-black tracking-tighter text-primary-dark font-manrope leading-none mb-2">
                Provider <span className="text-primary italic">Hub</span>
              </h1>
              <p className="text-primary-dark/30 font-bold uppercase tracking-widest text-[11px] ml-1">
                 Institutional Management • Command Center
              </p>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold"><Star size={20} fill="currentColor" /></div>
                <div>
                   <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-widest leading-none">Reputation</p>
                   <p className="text-sm font-black text-primary-dark tracking-tight">4.9/5 verified</p>
                </div>
             </div>
             <button 
               onClick={() => { setShowSetup(true); setIsEditing(!!service); }}
               className="px-10 py-5 bg-primary text-white rounded-[2.5rem] font-black font-manrope transition-all hover:bg-primary-dark hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 text-[10px] uppercase tracking-widest border border-white/20"
             >
               <Settings size={18} />
               {service ? 'Configure Service' : 'Activate Service'}
             </button>
          </div>
        </header>

        {serviceLoading ? (
          <div className="py-20 text-center animate-pulse">
             <Bus className="mx-auto text-primary/10 mb-4" size={48} />
             <p className="text-primary/20 font-black italic tracking-widest uppercase text-[10px]">Syncing Command Logs...</p>
          </div>
        ) : !service ? (
          <div className="bg-white p-20 rounded-[5rem] border-4 border-dashed border-primary/5 text-center max-w-4xl mx-auto">
             <Bus className="mx-auto text-primary-dark/5 mb-8" size={80} />
             <h2 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter mb-4 italic uppercase">Launch Your Service</h2>
             <p className="text-primary-dark/40 font-bold text-lg mb-10 max-w-xl mx-auto">You're verified, but you haven't activated a service yet. Join the Muzinda institutional network and start boarding students today.</p>
             <button 
               onClick={() => setShowSetup(true)}
               className="px-12 py-6 bg-primary-dark text-white rounded-[3rem] font-black font-manrope transition-all hover:bg-primary uppercase tracking-[0.2em] shadow-2xl inline-flex items-center gap-4"
             >
               Activate My Service <ChevronRight size={20} />
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LIVE ANALYTICS */}
            <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
               <div className="bg-primary-dark p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 relative z-10">Monthly Revenue</p>
                  <div className="relative z-10">
                    <h3 className="text-5xl font-manrope font-black italic">${monthlyRevenue.toLocaleString()}</h3>
                    <p className="text-[11px] font-bold text-accent-gold uppercase tracking-widest mt-2">+18% vs last month</p>
                  </div>
               </div>
               
               <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary"><Users size={24} /></div>
                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Active</span>
                  </div>
                  <div>
                    <h4 className="text-4xl font-manrope font-black text-primary-dark italic uppercase leading-none">{activeApps.length}</h4>
                    <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest mt-3">Monthly Students</p>
                  </div>
               </div>

               <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent-gold/5 rounded-2xl flex items-center justify-center text-accent-gold"><Clock size={24} /></div>
                    <span className="text-[10px] font-black text-accent-gold/40 uppercase tracking-widest">Incoming</span>
                  </div>
                  <div>
                    <h4 className="text-4xl font-manrope font-black text-primary-dark italic uppercase leading-none">{pendingApps.length}</h4>
                    <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest mt-3">Approval Requests</p>
                  </div>
               </div>

               <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary"><Bus size={24} /></div>
                    <div className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-4xl font-manrope font-black text-primary-dark italic uppercase leading-none">{Math.round((activeApps.length / (service?.capacity || 14)) * 100)}%</h4>
                    <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest mt-3">Seat Capacity</p>
                  </div>
               </div>
            </section>

            {/* APPLICATION REVIEW REGISTRY */}
            <div className="lg:col-span-8 space-y-12">
               <section className="space-y-10">
                  <div className="flex items-center gap-4">
                     <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase">Application Registry</h2>
                     <div className="h-0.5 flex-1 bg-primary/5 rounded-full" />
                  </div>

                  <div className="space-y-6">
                    {appsLoading ? (
                      <div className="animate-pulse space-y-6">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white rounded-[3rem]" />)}
                      </div>
                    ) : applications.length > 0 ? (
                      <AnimatePresence mode="popLayout">
                        {applications.map((app) => (
                          <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all group"
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                               <div className="flex gap-6 items-center">
                                  <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-surface-bright bg-gray-50 flex-shrink-0">
                                     {app.student?.avatar_url ? (
                                       <img src={app.student.avatar_url} alt="" className="w-full h-full object-cover" />
                                     ) : (
                                       <div className="w-full h-full flex items-center justify-center text-primary-dark/20"><Users size={32} /></div>
                                     )}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-2xl font-manrope font-black text-primary-dark tracking-tight">{app.student?.full_name || 'Muzinda Student'}</h4>
                                        {app.status === 'approved' && <CheckCircle2 size={18} className="text-primary" />}
                                     </div>
                                     <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
                                           <ShieldCheck size={12} className="text-primary" />
                                           <span className="text-[11px] font-black uppercase tracking-widest text-primary-dark/60">Institutional ID Verified</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-surface-bright border border-primary/5 rounded-full">
                                           <Star size={10} className="text-accent-gold fill-accent-gold" />
                                           <span className="text-[11px] font-black uppercase tracking-widest text-primary-dark/40">Frequent Traveler</span>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="flex gap-3 w-full md:w-auto">
                                  {app.status === 'pending' ? (
                                    <>
                                       <button 
                                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                          disabled={!!processingId}
                                          className="p-5 bg-white border border-primary/10 text-primary-dark/20 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all"
                                       >
                                          <X size={20} />
                                       </button>
                                       <button 
                                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                                          disabled={!!processingId}
                                          className="flex-1 md:flex-none px-10 py-5 bg-primary text-white rounded-2xl font-black font-manrope text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all disabled:opacity-50"
                                       >
                                          {processingId === app.id ? 'Processing...' : 'Approve Application'}
                                       </button>
                                    </>
                                  ) : app.status === 'approved' ? (
                                    <div className="flex items-center gap-4">
                                       <div className="text-right hidden md:block">
                                          <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Active Passenger</p>
                                          <p className="text-xs font-bold text-primary-dark/30">Auto-billing enabled</p>
                                       </div>
                                       <a href={`tel:${app.student?.email || ''}`} className="p-5 bg-primary/5 text-primary rounded-2xl hover:bg-primary/10 transition-all">
                                          <MessageSquare size={20} />
                                       </a>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.2em]">{app.status}</span>
                                  )}
                               </div>
                            </div>

                            {app.message && (
                               <div className="mt-8 p-6 bg-surface-bright rounded-2xl border border-primary/5 italic text-sm text-primary-dark/60 font-medium">
                                 "{app.message}"
                               </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      <div className="py-28 text-center border-4 border-dashed border-primary/5 rounded-[5rem]">
                         <Users className="mx-auto text-primary-dark/5 mb-6" size={64} />
                         <p className="text-primary-dark/20 font-black italic text-xl uppercase tracking-[0.4em]">No Active Requests</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>

            {/* SIDEBAR INTEL */}
            <aside className="lg:col-span-4 space-y-12">
               <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-sm space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary"><CreditCard size={24} /></div>
                     <h4 className="text-xl font-manrope font-black text-primary-dark uppercase italic">Billing Status</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-primary-dark/40 font-bold uppercase tracking-widest text-[11px]">Cycle Ends</span>
                        <span className="text-primary-dark font-black font-mono">22 APR '26</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-primary-dark/40 font-bold uppercase tracking-widest text-[11px]">Institutional Fee</span>
                        <span className="text-primary-dark font-black font-mono">-$24.00</span>
                     </div>
                     <div className="flex justify-between items-center text-lg border-t border-primary/5 pt-6">
                        <span className="text-primary-dark/20 font-black italic uppercase tracking-tighter">Net Yield</span>
                        <span className="text-primary font-black font-manrope italic">${(monthlyRevenue * 0.95).toFixed(2)}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-primary-dark p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                  <h4 className="text-2xl font-manrope font-black italic tracking-tight mb-10 uppercase">Protocol</h4>
                  <div className="space-y-10">
                     {[
                       { label: 'Review ID', icon: ShieldCheck, step: 'Verification' },
                       { label: 'Map Pickup', icon: Bus, step: 'Logistics' },
                       { label: 'Auto Bill', icon: CreditCard, step: 'Treasury' }
                     ].map((item, idx) => (
                       <div key={idx} className="flex gap-6 items-center">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40"><item.icon size={20} /></div>
                          <div className="space-y-1">
                             <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">{item.step}</p>
                             <p className="text-xs font-black uppercase tracking-widest text-white">{item.label}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </aside>
          </div>
        )}
      </main>

      {/* Service Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-dark/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <header className="p-8 border-b border-primary/5 flex justify-between items-center sticky top-[112px] bg-white z-10">
                <div>
                  <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">
                    {isEditing ? 'Configure Service' : 'Activate Service'}
                  </h2>
                  <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.5em]">Institutional Setup</p>
                </div>
                <button onClick={() => setShowSetup(false)} className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center hover:scale-105 transition-all">
                  <X size={24} />
                </button>
              </header>

              <form onSubmit={handleSetupService} className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Category Selection */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Your Niche</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICE_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
                          if (nameInput && !nameInput.value) {
                             nameInput.value = cat.charAt(0).toUpperCase() + cat.slice(1) + ' Solutions';
                          }
                        }}
                        className="group"
                      >
                        <input 
                          type="radio" 
                          name="category" 
                          value={cat} 
                          id={`cat-${cat}`} 
                          className="hidden peer" 
                          defaultChecked={service?.category === cat || (!service && cat === 'transport')}
                        />
                        <label 
                          htmlFor={`cat-${cat}`}
                          className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-primary/5 bg-white text-primary-dark/40 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all cursor-pointer hover:border-primary/20"
                        >
                           <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
                        </label>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Service Imagery</h4>
                  <div className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-[#F8F9F8] border border-primary/5 group hover:border-primary/20 transition-all">
                    <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-dashed border-primary/10 flex items-center justify-center text-primary/20 relative overflow-hidden group-hover:border-primary/30 transition-all">
                      {selectedFile ? (
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                      ) : service?.image_url ? (
                        <img src={service.image_url} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={32} />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary-dark tracking-tight">Upload Branding</p>
                      <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Institutional Logo or Unit Photo</p>
                      <button 
                        type="button"
                        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                        className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
                      >
                        {selectedFile || (service?.image_url) ? 'Change Photo' : 'Select Image'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Service Name</label>
                    <input 
                      name="name" 
                      required 
                      defaultValue={service?.name} 
                      placeholder="e.g. Mutare Express" 
                      className="w-full p-6 rounded-[1.5rem] bg-[#F8F9F8] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Monthly Rate ($)</label>
                    <input 
                      name="price" 
                      type="number" 
                      required 
                      defaultValue={service?.price} 
                      placeholder="e.g. 45" 
                      className="w-full p-6 rounded-[1.5rem] bg-[#F8F9F8] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Capacity (Students)</label>
                    <input 
                      name="capacity" 
                      type="number" 
                      required 
                      defaultValue={service?.capacity || 14} 
                      className="w-full p-6 rounded-[1.5rem] bg-[#F8F9F8] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Description</label>
                    <textarea 
                      name="description" 
                      required 
                      rows={4} 
                      defaultValue={service?.description} 
                      placeholder="Briefly describe your service standards..." 
                      className="w-full p-6 rounded-[2rem] bg-[#F8F9F8] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all resize-none" 
                    />
                  </div>
                </div>

                <div className="h-12" />
              </form>

              <footer className="p-8 border-t border-primary/5 bg-white flex justify-end gap-4 sticky bottom-0 z-10">
                <button 
                  type="button" 
                  onClick={() => setShowSetup(false)} 
                  className="px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-dark/40 hover:bg-primary/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={(e: any) => {
                    const form = (e.target as HTMLElement).closest('motion.div')?.querySelector('form') as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }}
                  disabled={isSubmitting}
                  className="px-12 py-5 bg-primary text-white rounded-2xl font-black font-manrope text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> {isEditing ? 'Save Changes' : 'Activate Service'}</>}
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProviderDashboard

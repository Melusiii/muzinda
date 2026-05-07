import { Sidebar } from '../components/Sidebar'
import { Wrench, CheckCircle2, Clock, MapPin, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { useMaintenanceMarketplace, useProviderJobs, submitMaintenanceBid } from '../hooks/supabase/useMaintenance'
import { useState } from 'react'
import { getImageUrl } from '../utils/supabase-helpers'

export const HandymanDashboard = () => {
  const { requests, loading: marketplaceLoading, refetch: refetchMarketplace } = useMaintenanceMarketplace()
  const { jobs, refetch: refetchJobs } = useProviderJobs()
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)

  const handleClaimJob = async (requestId: string) => {
    setIsSubmitting(requestId)
    try {
      // In this version, claiming is instant (bidding with a default/fixed amount if provided)
      await submitMaintenanceBid(requestId, 0, "Instant claim from dashboard")
      await refetchMarketplace()
      await refetchJobs()
    } catch (err) {
      console.error(err)
      alert("Failed to claim job")
    } finally {
      setIsSubmitting(null)
    }
  }

  const activeJobs = (jobs || []).filter(j => j.status === 'accepted')
  const pendingBids = (jobs || []).filter(j => j.status === 'pending')
  
  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-x-hidden pt-32 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Available Jobs Board */}
          <section className="lg:col-span-8 space-y-10">
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl">
              <div>
                <h2 className="text-2xl font-manrope font-extrabold text-primary-dark tracking-tighter uppercase italic">Marketplace Feed</h2>
                <p className="text-primary-dark/30 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Live Requests • Mutare District</p>
              </div>
              <button 
                onClick={() => refetchMarketplace()}
                className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center hover:rotate-180 transition-all duration-700"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {marketplaceLoading ? (
                [1,2].map(i => <div key={i} className="h-64 bg-white/20 rounded-[3rem] animate-pulse border border-white" />)
              ) : (requests || []).length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {(requests || []).map((request) => (
                    <motion.div 
                      key={request.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-24 h-24 bg-surface-bright rounded-[2rem] overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                           {(request.image_url || request.property?.image_url) ? (
                             <img src={getImageUrl(request.image_url || request.property?.image_url)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-primary/20"><Wrench size={32} /></div>
                           )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                               <h3 className="text-2xl font-manrope font-extrabold text-primary-dark tracking-tight leading-none mb-1 italic uppercase">{request.title}</h3>
                               <div className="flex items-center gap-2 text-[10px] font-black text-primary-dark/30 uppercase tracking-[0.2em]">
                                  <MapPin size={12} className="text-primary" /> {request.property?.title} • {request.property?.location}
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-2xl font-manrope font-extrabold text-primary italic leading-none">${request.budget || '0'}</p>
                               <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-widest mt-1">Est. Value</p>
                            </div>
                          </div>
                          
                          <p className="text-primary-dark/60 font-dm-sans text-sm leading-relaxed line-clamp-2 italic">"{request.description}"</p>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-primary/5 mt-4">
                            <div className="flex gap-6">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.2em]">Urgency</span>
                                 <span className={cn(
                                   "text-[11px] font-black uppercase mt-1",
                                   request.urgency === 'high' ? 'text-accent-amber' : 'text-primary'
                                 )}>{request.urgency || 'Normal'}</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.2em]">Posted</span>
                                 <span className="text-[11px] font-black text-primary-dark/60 uppercase mt-1 italic">{new Date(request.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleClaimJob(request.id)}
                              disabled={!!isSubmitting}
                              className="px-12 py-5 bg-primary text-white rounded-[1.5rem] font-black font-manrope text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                               {isSubmitting === request.id ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Accept Job</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="py-20 text-center border-4 border-dashed border-primary/5 rounded-[4rem]">
                   <Wrench className="mx-auto text-primary-dark/5 mb-6" size={64} />
                   <p className="text-primary-dark/20 font-black italic text-xl uppercase tracking-[0.5em]">Board Empty</p>
                </div>
              )}
            </div>
          </section>

          {/* Active Job Tracker */}
          <aside className="lg:col-span-4 space-y-12">
              <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-2xl space-y-8 sticky top-32 z-10 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-accent-gold/10 text-accent-gold rounded-2xl flex items-center justify-center shadow-inner">
                       <Clock size={24} className="animate-shiver" />
                    </div>
                    <h3 className="text-2xl font-manrope font-black text-primary-dark italic uppercase tracking-tighter leading-none">Job Tracker</h3>
                  </div>

                  {activeJobs.length > 0 ? (
                    <div className="space-y-10 relative z-10">
                      {activeJobs.map((job) => (
                        <div key={job.id} className="space-y-8 bg-surface-bright p-8 rounded-[2.5rem] border border-primary/5 shadow-inner">
                          <div>
                            <h4 className="text-xl font-manrope font-black text-primary-dark italic leading-tight uppercase mb-2">{job.request?.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-black text-primary-dark/30 uppercase tracking-widest">
                               <MapPin size={12} className="text-primary" /> {job.request?.property?.title}
                            </div>
                          </div>
                          
                          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-primary/10">
                             <div className="relative pl-10">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                  <CheckCircle2 size={14} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-primary-dark">Job Confirmed</p>
                             </div>
                             <div className="relative pl-10">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-primary bg-white flex items-center justify-center shadow-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-primary italic">In Progress...</p>
                             </div>
                          </div>

                          <div className="pt-4 space-y-3">
                             <button className="w-full bg-primary-dark text-white py-4 rounded-xl font-manrope font-extrabold text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary-dark/40 hover:scale-[1.02] active:scale-95 transition-all">
                                Complete & Invoice
                             </button>
                             <button className="w-full py-4 text-[10px] font-black text-primary-dark/20 uppercase tracking-widest hover:text-red-500 transition-colors">
                                Report Discrepancy
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center bg-surface-bright rounded-[3rem] border-2 border-dashed border-primary/5 italic">
                       <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.4em]">No Active Deployments</p>
                    </div>
                  )}

                  {pendingBids.length > 0 && (
                    <div className="pt-8 border-t border-primary/5">
                        <h5 className="text-[10px] font-black text-primary-dark/30 uppercase tracking-[0.6em] mb-6 pl-4">Pending Approval</h5>
                        <div className="space-y-4">
                           {pendingBids.map(bid => (
                             <div key={bid.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 shadow-sm">
                                <span className="text-xs font-bold text-primary-dark truncate pr-4 italic">{bid.request?.title}</span>
                                <span className="text-[10px] font-black text-accent-gold uppercase tracking-tighter shrink-0 italic">Reviewing...</span>
                             </div>
                           ))}
                        </div>
                    </div>
                  )}
              </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

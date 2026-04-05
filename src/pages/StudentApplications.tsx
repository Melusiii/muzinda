import { useState } from 'react'
import { Loader2, MapPin, X, Info, ArrowRight, AlertCircle } from 'lucide-react'
import { useUserApplications, deleteApplication } from '../hooks/useSupabase'
import { cn } from '../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageUrl } from '../utils/supabase-helpers'

export const StudentApplications = () => {
  const { applications, loading, refetch } = useUserApplications()
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleWithdraw = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to withdraw this application?")) return
    
    setIsDeleting(true)
    try {
      await deleteApplication(id)
      if (refetch) refetch()
      setSelectedApp(null)
    } catch (err) {
      console.error(err)
      alert("Failed to withdraw application.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans">
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-8 md:p-8 min-h-screen relative pb-32">
        <header className="mb-12">
          <div className="flex gap-2 items-center text-primary mb-2">
             <div className="w-8 h-[2px] bg-current opacity-20" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Track Progress</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-primary-dark font-manrope leading-none">
            My Applications
          </h1>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {applications.map((app) => (
              <motion.div 
                key={app.id} 
                layoutId={`app-${app.id}`}
                onClick={() => setSelectedApp(app)}
                className="group bg-white rounded-[3rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer relative"
              >
                 {/* Property Image Preview */}
                 <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getImageUrl(app.property?.image_url || '')} 
                      alt={app.property?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Status Badge Over Image */}
                    <div className="absolute top-6 right-6">
                       <div className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg",
                          app.status === 'approved' ? "bg-primary/20 text-white border-primary/20" : 
                          app.status === 'rejected' ? "bg-red-500/20 text-white border-red-500/20" : 
                          "bg-primary-dark/40 text-accent-gold border-white/10"
                       )}>
                          {app.status}
                       </div>
                    </div>

                    <div className="absolute bottom-6 left-8 right-8">
                       <h3 className="text-xl font-black font-manrope text-white tracking-tight leading-tight truncate">{app.property?.title}</h3>
                       <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                          <MapPin size={10} className="text-primary-light" /> {app.property?.location}
                       </p>
                    </div>
                 </div>

                 <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between pt-0">
                       <div className="space-y-1 text-left">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest">Submitted</p>
                          <p className="text-sm font-bold text-primary-dark">{new Date(app.created_at).toLocaleDateString()}</p>
                       </div>
                       
                       <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[9px] group-hover:gap-4 transition-all">
                          Manage <ArrowRight size={14} />
                       </div>
                    </div>
                 </div>

                 {/* Withdraw Action (Floating) */}
                 <button 
                  onClick={(e) => handleWithdraw(app.id, e)}
                  disabled={isDeleting}
                  className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                  title="Withdraw Application"
                 >
                    <X size={16} />
                 </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] text-center max-w-2xl shadow-sm border border-primary/5 mt-12 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <AlertCircle size={48} className="mx-auto text-primary/20 mb-6" />
            <h2 className="text-3xl font-black font-manrope text-primary-dark mb-4 tracking-tighter">Start your journey</h2>
            <p className="text-primary-dark/50 font-dm-sans max-w-sm mx-auto mb-10">You haven't applied for any units yet. Browse the Explorer to find your verified campus home.</p>
            <button className="px-12 py-5 bg-primary text-white rounded-2xl font-black font-manrope transition-all hover:scale-105 shadow-xl shadow-primary/20">
              Browse Properties
            </button>
          </div>
        )}

        {/* Application Detail Overly (Modern Drawer-style Panel) */}
        <AnimatePresence>
          {selectedApp && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedApp(null)}
                className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface-bright z-[101] shadow-2xl overflow-y-auto"
              >
                 <div className="p-8 lg:p-12 space-y-12">
                    <div className="flex justify-between items-center">
                       <button onClick={() => setSelectedApp(null)} className="p-4 bg-white rounded-2xl text-primary-dark/40 hover:text-primary transition-all">
                          <X size={24} />
                       </button>
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Application Detail</span>
                    </div>

                    <div className="space-y-8">
                       <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-xl">
                          <img 
                            src={getImageUrl(selectedApp.property?.image_url || '')} 
                            alt={selectedApp.property?.title}
                            className="w-full h-full object-cover"
                          />
                       </div>

                       <div className="space-y-2">
                          <h2 className="text-4xl font-black font-manrope text-primary-dark tracking-tighter">{selectedApp.property?.title}</h2>
                          <div className="flex items-center gap-2 text-primary-dark/40 font-bold uppercase tracking-widest text-xs">
                             <MapPin size={14} className="text-primary" /> {selectedApp.property?.location}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-6 rounded-3xl border border-primary/5">
                             <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Status</p>
                             <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", selectedApp.status === 'approved' ? 'bg-primary' : 'bg-accent-amber')} />
                                <p className="text-sm font-black text-primary-dark uppercase">{selectedApp.status}</p>
                             </div>
                          </div>
                          <div className="bg-white p-6 rounded-3xl border border-primary/5">
                             <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Rent</p>
                             <p className="text-sm font-black text-primary-dark">${selectedApp.property?.price}<span className="text-xs opacity-40">/mo</span></p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center gap-2 text-primary-dark/40 font-black uppercase text-[10px] tracking-widest">
                             <Info size={14} /> My Message to Landlord
                          </div>
                          <div className="bg-white p-8 rounded-[2rem] border border-primary/5 relative italic text-primary-dark/60 font-dm-sans leading-relaxed">
                             "{selectedApp.message || "Hello, I am interested in this property."}"
                          </div>
                       </div>

                       {selectedApp.status === 'approved' && (
                         <div className="space-y-6">
                            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 border-dashed">
                               <p className="text-xs text-primary font-bold text-center">Your application has been approved! Proceed to the next step to secure your spot.</p>
                            </div>
                            <button className="w-full py-6 bg-primary text-white rounded-2xl font-black font-manrope text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                              Pay Security Deposit
                            </button>
                         </div>
                       )}

                       {selectedApp.status === 'pending' && (
                         <button 
                          onClick={(e) => handleWithdraw(selectedApp.id, e)}
                          disabled={isDeleting}
                          className="w-full py-5 bg-white text-red-500 rounded-2xl font-black font-manrope text-xs border border-red-500/10 hover:bg-red-500/5 transition-all uppercase tracking-widest"
                         >
                           Withdraw Application
                         </button>
                       )}
                    </div>
                 </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default StudentApplications

import { ShieldCheck, MapPin, Bus, CheckCircle2, Edit3, Users, MessageCircle, XCircle } from 'lucide-react'
import { useProviderService, useServiceApplications, updateServiceApplicationStatus } from '../hooks/useSupabase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ManageServiceModal } from '../components/ManageServiceModal'
import { getImageUrl } from '../utils/supabase-helpers'

export const TransportDashboard = () => {
  const navigate = useNavigate()
  const { service, refetch: refetchService } = useProviderService()
  const { applications, loading: appsLoading, refetch: refetchApps } = useServiceApplications(service?.id)
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)

  const handleAppStatus = async (appId: string, status: 'approved' | 'rejected') => {
    try {
      await updateServiceApplicationStatus(appId, status)
      refetchApps()
      refetchService()
    } catch (err: any) { alert(err.message) }
  }

  const pendingApps = (applications || []).filter(a => a.status === 'pending')
  const approvedCustomers = (applications || []).filter(a => a.status === 'approved')
  
  const totalCapacity = service?.capacity || 14
  const seatsTaken = approvedCustomers.length
  const seatsAvailable = Math.max(0, totalCapacity - seatsTaken)

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <main className="flex-1 md:ml-64 p-6 md:p-8 pt-32 md:pt-32 min-h-screen relative z-10 pb-32">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
              <ShieldCheck size={14} fill="currentColor" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-manrope">Verified Provider</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-primary-dark font-manrope">Partner Dashboard</h1>
            <p className="text-primary-dark/50 font-dm-sans max-w-xl">
              Manage your monthly car subscription service and your student roster.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* MONTHLY SERVICE STATUS */}
            <section className="bg-primary-dark rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-10">
                   <div>
                     <h2 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.3em] mb-3">Service Profile</h2>
                     <h3 className="text-4xl font-manrope font-black tracking-tighter">
                       {service?.name || "Your Car Service"}
                     </h3>
                   </div>
                   <button 
                    onClick={() => setIsServiceModalOpen(true)}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold"
                   >
                     <Edit3 size={16} /> Manage Business
                   </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Monthly Fee</p>
                      <p className="text-4xl font-manrope font-black text-accent-gold">${service?.price || '0'}</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Seats Taken</p>
                      <p className="text-4xl font-manrope font-black text-white">{seatsTaken}<span className="text-lg text-white/20 font-black">/{totalCapacity}</span></p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm relative group">
                      {service?.image_url ? (
                        <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700">
                          <img src={getImageUrl(service.image_url)} alt="Service" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/20">
                          <Bus size={32} strokeWidth={1} />
                        </div>
                      )}
                      <p className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Vehicle Photo</p>
                      <p className="relative z-10 text-xs font-bold">{service?.image_url ? 'Photo Uploaded' : 'Missing Photo'}</p>
                   </div>
                 </div>
               </div>
            </section>

            {/* CAPACITY OVERVIEW */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-manrope font-extrabold text-primary-dark tracking-tight">Vehicle Availability</h3>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{seatsAvailable} Seats Left</span>
                </div>
              </div>
              
              <div className="p-10 bg-surface-bright rounded-[2rem] border border-primary/5 flex flex-col items-center text-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary/10" />
                    <circle 
                      cx="64" cy="64" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray={377} 
                      strokeDashoffset={377 - (377 * (seatsTaken / totalCapacity))} 
                      className="text-primary transition-all duration-1000" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-primary-dark">{Math.round((seatsTaken / totalCapacity) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-manrope font-black text-primary-dark">Monthly Capacity Usage</h4>
                  <p className="text-xs font-bold text-primary-dark/40 mt-1 italic">
                    {seatsTaken} active subscriptions out of {totalCapacity} total seats
                  </p>
                </div>
                {seatsAvailable === 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <XCircle size={14} /> Full Capacity Reached
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            {/* PENDING APPLICATIONS */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-manrope font-extrabold text-primary-dark">New Applicants</h3>
                  <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{pendingApps.length} New</span>
               </div>
               <div className="space-y-4">
                  {appsLoading ? (
                    <div className="p-4 text-center text-primary-dark/20 text-xs font-bold">Loading requests...</div>
                  ) : pendingApps.length > 0 ? pendingApps.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl bg-surface-bright flex flex-col gap-4 border border-transparent hover:border-primary/5 hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-primary/5 flex items-center justify-center text-primary font-black text-lg">
                          {app.student?.full_name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-primary-dark">{app.student?.full_name}</p>
                          <p className="text-[10px] text-primary-dark/30 font-black uppercase tracking-widest">Subscription Request</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            disabled={seatsAvailable === 0}
                            onClick={() => handleAppStatus(app.id, 'approved')} 
                            className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-20"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button onClick={() => handleAppStatus(app.id, 'rejected')} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <XCircle size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-xl border border-primary/5">
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                          <MapPin size={12} /> Residing At
                        </div>
                        <p className="text-xs font-bold text-primary-dark/60">{app.student_residing_at || 'Not specified'}</p>
                        {app.message && (
                          <p className="text-[10px] italic text-primary-dark/40 mt-2 border-t border-primary/5 pt-2">"{app.message}"</p>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="py-10 text-center text-primary-dark/20 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-primary/5 rounded-2xl italic">
                      No pending requests
                    </div>
                  )}
               </div>
            </section>

            {/* APPROVED CUSTOMERS */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <Users className="text-primary" size={20} />
                  <h3 className="text-xl font-manrope font-extrabold text-primary-dark">Monthly Roster</h3>
               </div>
               <div className="space-y-3">
                  {approvedCustomers.map((app) => (
                    <div key={app.id} className="p-4 rounded-xl border border-primary/5 flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center text-primary font-black text-[10px]">
                        {app.student?.full_name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-primary-dark">{app.student?.full_name}</p>
                        <p className="text-[11px] text-primary-dark/30 font-black uppercase tracking-tighter">Residing: {app.student_residing_at}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/messages')}
                        className="p-2 text-primary-dark/20 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  ))}
                  {approvedCustomers.length === 0 && (
                    <p className="text-center py-4 text-[10px] font-black text-primary-dark/20 uppercase tracking-widest">No regular customers yet</p>
                  )}
               </div>
            </section>
          </aside>
        </div>
      </main>

      <ManageServiceModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        service={service} 
        onUpdate={refetchService} 
      />
    </div>
  )
}

export default TransportDashboard

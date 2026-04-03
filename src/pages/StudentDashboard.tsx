import { Sidebar } from '../components/Sidebar'
import { Bell, ShieldCheck, Zap, Bus, AlertCircle, ArrowRight, Search, CreditCard, Wrench, Star, Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserApplications, useUserTickets } from '../hooks/useSupabase'
import { Navbar } from '../components/Navbar'

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { applications: apps, loading: loadingApps } = useUserApplications()
  const { tickets, loading: loadingTickets } = useUserTickets()
  
  const hasSecuredHousing = user?.hasSecuredHousing || false

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-12 md:p-12 overflow-y-auto h-screen">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-primary-dark font-manrope leading-none">
              {hasSecuredHousing ? `${user?.name.split(' ')[0]}'s Oasis` : 'Student Hub'}
            </h1>
            <p className="text-primary-dark/40 font-bold uppercase tracking-widest text-[10px]">
              {hasSecuredHousing ? 'Africa University • Resident' : 'Africa University • Welcome to Muzinda'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-4 bg-white rounded-2xl border border-primary/5 text-primary-dark/40 hover:text-primary transition-all shadow-sm">
              <Bell size={24} />
            </button>
            <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden shadow-sm">
               {user?.avatar_url ? (
                 <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <Star className="text-primary" />
               )}
            </div>
          </div>
        </header>

        {hasSecuredHousing ? (
          /* MY HOME VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 space-y-8">
              {/* Rent Pass Card */}
              <div className="bg-primary-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-accent-gold">
                      <CreditCard size={18} fill="currentColor" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest font-manrope">Muzinda Rent Pass</span>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Balance Due</p>
                      <h2 className="text-5xl font-manrope font-black">$0.00</h2>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                       <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-[10px] font-bold">ALL CLEAR</div>
                    </div>
                  </div>
                  <button className="px-10 py-5 bg-white text-primary-dark rounded-2xl font-black font-manrope transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20">
                    Pay Now
                  </button>
                </div>
              </div>

              {/* Home Manager Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Wrench, label: 'Maintenance', count: 'Synced', color: 'bg-accent-amber/10 text-accent-amber' },
                  { icon: ShieldCheck, label: 'Insurance', count: 'Active', color: 'bg-primary/10 text-primary' },
                  { icon: Zap, label: 'Smart Meter', count: 'Connected', color: 'bg-accent-gold/10 text-accent-gold' },
                ].map((tile, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-md transition-all group">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", tile.color)}>
                      <tile.icon size={24} />
                    </div>
                    <h3 className="text-xl font-manrope font-black text-primary-dark">{tile.label}</h3>
                    <p className="text-[10px] font-black text-primary-dark/40 uppercase mt-1 tracking-widest">{tile.count}</p>
                  </div>
                ))}
              </div>

              {/* Discovery Fallback for Secured Students */}
              <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm">
                  <h3 className="text-2xl font-manrope font-black text-primary-dark mb-4">Your Residence Info</h3>
                  <p className="text-primary-dark/40 font-dm-sans">Secure, managed, and verified by Muzinda.</p>
              </div>
            </section>

            <aside className="lg:col-span-4 space-y-8">
               <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm space-y-6">
                  <h3 className="text-xl font-manrope font-black text-primary-dark">Service Hub</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => navigate('/transport')} className="flex items-center gap-4 p-5 bg-[#F8F9F8] rounded-2xl hover:bg-primary/5 transition-all text-left group">
                       <div className="p-3 bg-white rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform"><Bus size={20} /></div>
                       <div>
                          <p className="text-sm font-bold text-primary-dark">Book Shuttle</p>
                          <p className="text-[10px] text-primary-dark/40 font-bold uppercase">To AU Gate • 07:15</p>
                       </div>
                    </button>
                    <button className="flex items-center gap-4 p-5 bg-[#F8F9F8] rounded-2xl hover:bg-primary/5 transition-all text-left group">
                       <div className="p-3 bg-white rounded-xl shadow-sm text-accent-amber group-hover:scale-110 transition-transform"><Wrench size={20} /></div>
                       <div>
                          <p className="text-sm font-bold text-primary-dark">New Repair</p>
                          <p className="text-[10px] text-primary-dark/40 font-bold uppercase">Report Issue</p>
                       </div>
                    </button>
                  </div>
               </div>
            </aside>
          </div>
        ) : (
          /* HUB VIEW (NEW STUDENTS/APPLICANTS) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/explorer')}
                  className="bg-primary p-10 rounded-[3rem] text-white cursor-pointer shadow-2xl shadow-primary/20 relative overflow-hidden group"
                >
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                  <Search size={40} className="text-accent-gold mb-8" />
                  <h3 className="text-3xl font-manrope font-black mb-2">Explore Housing</h3>
                  <p className="text-white/60 text-sm font-dm-sans mb-8">Browse 50+ verified student properties near AU.</p>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    Start Search <ArrowRight size={18} />
                  </div>
                </motion.div>

                <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                   <div className="p-5 bg-[#F8F9F8] rounded-[2.5rem] border border-primary/5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Application Progress</p>
                      {loadingApps ? (
                        <div className="flex items-center justify-center py-4"><Loader2 className="animate-spin text-primary" size={20} /></div>
                      ) : apps.length > 0 ? (
                        apps.map((app: any) => (
                          <div key={app.id} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-black text-primary-dark truncate pr-2">{app.property?.title}</p>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase text-center min-w-[70px]",
                                app.status === 'approved' ? "bg-primary/10 text-primary border border-primary/10" : "bg-accent-amber/10 text-accent-amber border border-accent-amber/10"
                              )}>{app.status}</span>
                            </div>
                            <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                              <div className={cn(
                                "h-full transition-all duration-1000",
                                app.status === 'approved' ? "bg-primary w-full" : "bg-accent-amber w-1/3"
                              )} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-primary-dark/40 font-bold py-2">No active applications found.</p>
                      )}
                   </div>
                   <div className="p-5 bg-[#F8F9F8] rounded-[2.5rem] border border-primary/5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Active Shuttles</p>
                      {loadingTickets ? (
                        <div className="flex items-center justify-center py-4"><Loader2 className="animate-spin text-primary" size={20} /></div>
                      ) : tickets.length > 0 ? (
                        tickets.map((ticket: any) => (
                          <div key={ticket.id} className="flex items-center justify-between mb-3 last:mb-0">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl text-primary shadow-sm"><Bus size={14} /></div>
                                <p className="text-xs font-black text-primary-dark">{ticket.trips?.routes?.name}</p>
                             </div>
                             <p className="text-[9px] text-primary-dark/40 font-bold uppercase tracking-tighter">{ticket.trips?.departure_time}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-primary-dark/40 font-bold py-2">No booked trips today.</p>
                      )}
                   </div>
                </div>
              </div>

              {/* Featured Services */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Bus, label: 'AU Shuttles', desc: 'Secure reliable transport' },
                  { icon: ShieldCheck, label: 'Identity', desc: 'Get your trust badge' },
                  { icon: AlertCircle, label: 'Concierge', desc: 'Support & Help Desk' },
                ].map((service, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-primary/5 text-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-surface-bright rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
                      <service.icon size={20} />
                    </div>
                    <h4 className="text-sm font-black text-primary-dark">{service.label}</h4>
                    <p className="text-[9px] text-primary-dark/30 font-bold uppercase mt-1 tracking-tight">{service.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="lg:col-span-4 space-y-8">
               <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm">
                  <h3 className="text-xl font-manrope font-black text-primary-dark mb-6">Muzinda Secured</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0"><ShieldCheck size={20}/></div>
                       <p className="text-xs text-primary-dark/60 leading-relaxed"><span className="font-bold text-primary-dark block text-sm mb-1">Verify Identity</span> Required to book units and use AU shuttles.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-accent-gold/5 rounded-xl flex items-center justify-center text-accent-gold shrink-0"><Star size={20}/></div>
                       <p className="text-xs text-primary-dark/60 leading-relaxed"><span className="font-bold text-primary-dark block text-sm mb-1">Trust Score</span> Maintain a gold badge for priority bookings.</p>
                    </div>
                  </div>
                  <button className="w-full mt-10 py-5 bg-[#F8F9F8] text-primary font-black rounded-2xl text-xs border-2 border-dashed border-primary/10 hover:bg-primary/5 transition-all uppercase tracking-widest">
                    Start Verification
                  </button>
               </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard

import { Sidebar } from '../components/Sidebar'
import { ShieldCheck, MapPin, Bus, ArrowRight, CheckCircle2, QrCode } from 'lucide-react'
import { cn } from '../utils/cn'

const TransportDashboard = () => {
  return (
    <div className="flex bg-surface-bright min-h-screen">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
              <ShieldCheck size={14} fill="currentColor" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-manrope">Verified Driver</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-primary-dark font-manrope">Transport Hub</h1>
            <p className="text-primary-dark/50 font-dm-sans max-w-xl">
              Connecting Africa University students from Chikanga, Hobhouse, and Dangamvura to campus with reliability.
            </p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white border border-primary/5 text-primary font-bold text-sm shadow-sm hover:translate-y-[-2px] transition-all">
                Update Live Map
             </button>
             <button className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Check-in Students
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Timetable */}
          <section className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-manrope font-extrabold text-primary-dark">Campus Shuttle Schedule</h3>
                  <p className="text-xs text-primary-dark/40 font-bold uppercase mt-1">Live timetable • Today, Oct 24th</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Active Now</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { time: '07:15', loc: 'Chikanga Shopping Center', dest: 'AU Main Gate', booked: '14/22', active: true },
                  { time: '09:30', loc: 'Hobhouse Turnoff', dest: 'AU Main Gate', booked: '22/22', full: true, active: true },
                  { time: '14:00', loc: 'Africa University (Return)', dest: 'Chikanga & Hobhouse', booked: '0/22', future: true },
                ].map((slot, idx) => (
                  <div key={idx} className={cn(
                    "group p-6 rounded-2xl flex items-center gap-8 border transition-all",
                    slot.active ? "bg-surface-bright border-primary/10 border-l-4 border-l-primary" : "bg-white border-primary/5 opacity-50"
                  )}>
                    <div className="text-center min-w-[80px]">
                      <p className={cn("text-3xl font-black font-manrope", slot.active ? "text-primary" : "text-primary-dark/30")}>{slot.time}</p>
                      <p className="text-[9px] font-extrabold text-primary-dark/40 uppercase tracking-widest">Departure</p>
                    </div>
                    <div className="flex-1 border-x border-primary/5 px-8 space-y-2">
                       <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-primary-dark/30" />
                          <p className="text-sm font-bold text-primary-dark">{slot.loc}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <Bus size={14} className="text-primary" />
                          <p className="text-xs font-medium text-primary-dark/50">To: {slot.dest}</p>
                       </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                       <p className={cn("text-xl font-black font-manrope", slot.full ? "text-accent-amber" : "text-primary")}>{slot.booked}</p>
                       <p className="text-[9px] font-extrabold text-primary-dark/40 uppercase tracking-widest">{slot.full ? 'FULL' : 'BOOKED'}</p>
                    </div>
                    <button className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary-dark/20 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                       <ArrowRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <div>
                    <h3 className="text-2xl font-manrope font-extrabold text-primary-dark">Active Check-in: 07:15 Route</h3>
                    <p className="text-sm text-primary-dark/40 font-dm-sans">Scanning student digital IDs for accountability</p>
                   </div>
                   <div className="flex items-center gap-3 bg-primary-dark text-white px-6 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                      <QrCode size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Ready to Scan</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                   {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-surface-bright border-b-4 border-primary/20">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                           <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="student" />
                        </div>
                        <div className="text-center">
                           <p className="text-sm font-bold text-primary-dark">Farai G.</p>
                           <span className="text-[10px] font-extrabold text-primary border-b border-primary/30 uppercase tracking-widest">Checked In</span>
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-manrope font-extrabold text-primary-dark">New Requests</h3>
                   <span className="bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full">4 New</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Tatenda N.', loc: 'Dangamvura' },
                    { name: 'Rudo M.', loc: 'Yeovil Gardens' },
                  ].map((req, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-surface-bright flex items-center gap-4 group">
                       <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                          {req.name[0]}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-primary-dark">{req.name}</p>
                          <p className="text-[10px] text-primary-dark/40 font-bold uppercase">{req.loc}</p>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-primary text-white rounded-lg shadow-sm">
                             <CheckCircle2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-primary-dark p-8 h-[400px] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                   <div>
                    <h3 className="text-2xl font-manrope font-extrabold">Route Analysis</h3>
                    <p className="text-sm text-white/40 mt-2">Optimization for Mutare Eastern Suburbs</p>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                         <span className="text-sm font-medium text-white/60">Chikanga Demand</span>
                         <span className="text-2xl font-black text-accent-gold">High</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                         <span className="text-sm font-medium text-white/60">Fuel Efficiency</span>
                         <span className="text-2xl font-black">88%</span>
                      </div>
                      <button className="w-full py-4 bg-white text-primary-dark rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-all">
                        Adjust Daily Routes
                      </button>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default TransportDashboard

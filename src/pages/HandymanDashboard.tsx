import { Sidebar } from '../components/Sidebar'
import { TrendingUp, Wrench, CheckCircle, Clock, Star, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const HandymanDashboard = () => {
  return (
    <div className="flex bg-surface-bright min-h-screen">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-x-hidden">
        {/* Hero Performance Section */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 bg-primary-dark p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h1 className="text-4xl md:text-6xl font-manrope font-extrabold tracking-tighter mb-4 leading-none">Earnings & Performance</h1>
                <p className="text-white/60 text-lg font-dm-sans">Your digital reputation in Mutare is soaring.</p>
              </div>
              <div className="flex items-end justify-between mt-12">
                <div className="space-y-1">
                  <p className="text-5xl font-black font-manrope">$1,240.50</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Total Monthly Revenue</p>
                </div>
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-4 border-primary-dark bg-accent-gold flex items-center justify-center shadow-lg">
                    <Star size={20} fill="currentColor" className="text-primary-dark" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary-dark bg-white flex items-center justify-center shadow-lg">
                    <span className="text-primary-dark font-black text-sm uppercase">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest mb-6">Job Completion</p>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-primary/5" cx="80" cy="80" fill="transparent" r="74" stroke="currentColor" strokeWidth="8"></circle>
                <motion.circle 
                  initial={{ strokeDashoffset: 465 }}
                  animate={{ strokeDashoffset: 55 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary" cx="80" cy="80" fill="transparent" r="74" stroke="currentColor" strokeLinecap="round" strokeDasharray="465" strokeWidth="10"
                ></motion.circle>
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black text-primary-dark font-manrope leading-none block">88%</span>
                <span className="text-[8px] font-bold text-primary-dark/30 uppercase tracking-tighter">On Time</span>
              </div>
            </div>
            <p className="text-[10px] font-extrabold text-primary-dark/60 mt-6 uppercase tracking-wider">Top 5% in AU District</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Available Jobs Board */}
          <section className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-end px-4">
              <div>
                <h2 className="text-3xl font-manrope font-extrabold text-primary-dark">Available Jobs</h2>
                <p className="text-primary-dark/40 font-dm-sans text-sm">Maintenance requests near you in Mutare.</p>
              </div>
              <button className="bg-primary/5 px-6 py-2.5 rounded-full text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">
                Refresh Board
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Burst Pipe Emergency", desc: "Africa University, Block C. Main supply line leak affecting 4 rooms.", loc: "Main Campus", time: "15m ago", price: 45, icon: Wrench, urgent: true },
                { title: "Socket Installation", desc: "Morningside Student Housing. Installation of 3 additional power sockets.", loc: "Morningside", time: "2h ago", price: 25, icon: TrendingUp },
              ].map((job, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="group bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex gap-8 items-start">
                    <div className="w-20 h-20 bg-surface-bright rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <job.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-manrope font-extrabold text-primary-dark leading-tight">{job.title}</h3>
                        {job.urgent && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-accent-amber/10 text-accent-amber rounded-full">
                            <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Urgent</span>
                          </div>
                        )}
                      </div>
                      <p className="text-primary-dark/60 font-dm-sans leading-relaxed mb-6">{job.desc}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2 text-primary-dark/30">
                            <MapPin size={14} />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">{job.loc}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary-dark/30">
                            <Clock size={14} />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">{job.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <span className="text-3xl font-black font-manrope text-primary">${job.price}</span>
                           <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold font-manrope text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                              Claim Job
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Active Job Tracker */}
          <aside className="lg:col-span-4">
              <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8 sticky top-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-amber/10 text-accent-amber rounded-xl flex items-center justify-center">
                       <Clock size={20} className="animate-spin-slow" />
                    </div>
                    <h3 className="text-xl font-manrope font-extrabold text-primary-dark">Active Job Tracker</h3>
                  </div>

                  <div className="p-6 bg-surface-bright rounded-3xl border border-primary/5">
                    <h4 className="text-lg font-manrope font-bold text-primary-dark mb-4">Geyser Repair & Maintenance</h4>
                    <p className="text-xs text-primary-dark/50 leading-relaxed font-dm-sans mb-6">
                      Mutare CBD Apartments, Unit 4B. Reported intermittent heating issues. Replacement of thermostat required.
                    </p>
                    
                    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-primary/10">
                       {[
                         { label: 'Arrival Confirmed', sub: 'GPS Validated: 14:05 PM', done: true },
                         { label: 'Before Photos Uploaded', done: true, images: true },
                         { label: 'Final Testing', current: true },
                       ].map((step, idx) => (
                         <div key={idx} className="relative pl-10">
                            <div className={cn(
                              "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm",
                              step.done ? "bg-primary text-white" : "bg-white border-2 border-primary"
                            )}>
                              {step.done ? <CheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-primary animate-ping" />}
                            </div>
                            <p className={cn("text-xs font-bold uppercase tracking-wider", step.done ? "text-primary-dark" : "text-primary")}>{step.label}</p>
                            {step.sub && <p className="text-[10px] text-primary-dark/30 mt-1">{step.sub}</p>}
                            {step.images && (
                              <div className="flex gap-2 mt-3">
                                 <div className="w-12 h-12 rounded-xl bg-white border border-primary/5 p-1 overflow-hidden">
                                     <img src="https://i.pravatar.cc/100?u=tool1" className="w-full h-full object-cover rounded-lg" />
                                 </div>
                                 <div className="w-12 h-12 rounded-xl bg-white border border-primary/5 p-1 overflow-hidden">
                                     <img src="https://i.pravatar.cc/100?u=tool2" className="w-full h-full object-cover rounded-lg" />
                                 </div>
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-4">
                     <button className="bg-primary text-white py-5 rounded-2xl font-bold font-manrope text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Mark Completed
                     </button>
                     <button className="bg-primary-dark/5 text-primary-dark/40 py-4 rounded-2xl font-bold font-manrope text-sm hover:bg-accent-amber/5 hover:text-accent-amber transition-all">
                        Report Issue
                     </button>
                  </div>
              </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default HandymanDashboard

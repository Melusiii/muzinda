import { Sidebar } from '../components/Sidebar'
import { TrendingUp, Wrench, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { Navbar } from '../components/Navbar'

const ProviderDashboard = () => {
  const { user } = useAuth();
  
  // In a real app, we'd fetch this from the user's profile
  const providerType = user?.category || (user?.name.includes('Driver') ? 'transport' : 'handyman');

  return (
    <div className="flex bg-surface-bright min-h-screen">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-12 md:p-12 overflow-x-hidden">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
              <Star size={14} fill="currentColor" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-manrope">Verified {providerType === 'transport' ? 'Partner' : 'Pro'}</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-primary-dark font-manrope">
              {providerType === 'transport' ? 'Transport Hub' : 'Service Pro Hub'}
            </h1>
            <p className="text-primary-dark/50 font-dm-sans max-w-xl text-lg">
              {providerType === 'transport' 
                ? 'Managing campus commutes and private shuttles across Mutare.'
                : 'Your reputation for excellence in maintenance is growing.'}
            </p>
          </div>
          <div className="flex gap-4">
             <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full border-4 border-white bg-accent-gold flex items-center justify-center shadow-lg z-10">
                  <Star size={20} fill="currentColor" className="text-primary-dark" />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-[10px] flex items-center justify-center text-white font-bold z-0">
                  4.9
                </div>
             </div>
             <button className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                {providerType === 'transport' ? 'Check-in Students' : 'Refresh Gigs'}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <section className="lg:col-span-8 space-y-8">
            {/* Context-Aware Content */}
            {providerType === 'transport' ? (
              <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-manrope font-extrabold text-primary-dark">Live Shuttle Schedule</h3>
                  <div className="flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">On Track</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { time: '07:15', loc: 'Chikanga', dest: 'AU Gate', booked: '14/22' },
                    { time: '09:30', loc: 'Hobhouse', dest: 'AU Gate', booked: '22/22', full: true },
                  ].map((slot, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-surface-bright flex items-center gap-8 border border-primary/5">
                      <div className="text-center font-manrope">
                        <p className="text-3xl font-black text-primary">{slot.time}</p>
                        <p className="text-[9px] font-bold text-primary-dark/40 uppercase">Departure</p>
                      </div>
                      <div className="flex-1 border-x border-primary/5 px-6">
                        <p className="text-sm font-bold text-primary-dark">{slot.loc}</p>
                        <p className="text-xs text-primary-dark/40">To: {slot.dest}</p>
                      </div>
                      <div className={cn("text-right font-bold", slot.full ? "text-accent-amber" : "text-primary")}>
                        {slot.booked}
                        <p className="text-[9px] font-bold text-primary-dark/40 uppercase">{slot.full ? 'Full' : 'Booked'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end px-4">
                  <h2 className="text-3xl font-manrope font-extrabold text-primary-dark">Gigs Marketplace</h2>
                  <span className="text-xs font-bold text-primary">3 New Maintenance Requests</span>
                </div>
                {[
                  { title: "Burst Pipe Emergency", loc: "Block C", price: 45, icon: Wrench, urgent: true },
                  { title: "Socket Installation", loc: "Morningside", price: 25, icon: TrendingUp },
                ].map((job, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="p-8 bg-white rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 bg-surface-bright rounded-2xl flex items-center justify-center text-primary">
                             <job.icon size={28} />
                          </div>
                          <div>
                             <h3 className="text-2xl font-manrope font-extrabold text-primary-dark">{job.title}</h3>
                             <p className="text-xs text-primary-dark/40 font-bold uppercase">{job.loc}</p>
                          </div>
                       </div>
                       <p className="text-3xl font-black font-manrope text-primary">${job.price}</p>
                    </div>
                    <div className="flex justify-end gap-3">
                       <button className="px-6 py-3 border-2 border-primary/10 text-primary-dark/60 rounded-xl font-bold text-sm">View Details</button>
                       <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">Submit Bid</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-primary-dark p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 mb-2">Monthly Revenue</p>
                <h3 className="text-5xl font-manrope font-black">$1,240.50</h3>
                <div className="flex items-center gap-2 mt-4 text-accent-gold text-sm font-bold">
                   <TrendingUp size={16} />
                   <span>+18% from last month</span>
                </div>
                <button className="w-full mt-8 py-4 bg-white/10 border border-white/10 rounded-2xl text-sm font-bold">View Statements</button>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                   <Clock className="text-accent-amber" size={20} />
                   <h3 className="text-xl font-manrope font-extrabold text-primary-dark">Active Task</h3>
                </div>
                <div className="p-6 bg-surface-bright rounded-2xl border border-primary/5">
                   <p className="text-sm font-bold text-primary-dark mb-1">
                     {providerType === 'transport' ? 'Chikanga Morning Route' : 'Geyser Maintenance'}
                   </p>
                   <p className="text-[10px] text-primary-dark/40 font-bold uppercase mb-4">In Progress • 80% Complete</p>
                   <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        className="h-full bg-primary"
                      />
                   </div>
                </div>
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm">Mark as Done</button>
             </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default ProviderDashboard

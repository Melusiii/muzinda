import { Sidebar } from '../components/Sidebar'
import { Bell, ShieldCheck, PlusCircle, MapPin, TrendingUp, Users, Home, Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useLandlordStats } from '../hooks/useSupabase'
import { Navbar } from '../components/Navbar'

const LandlordDashboard = () => {
  const { user } = useAuth()
  const { stats, loading } = useLandlordStats()
  const [reviewsVisible, setReviewsVisible] = useState(true)

  const dashboardStats = [
    { label: 'Total Revenue', value: stats ? `$${stats.revenue}` : '$0', trend: '+12%', icon: TrendingUp, color: 'text-primary' },
    { label: 'Occupancy Rate', value: stats ? `${stats.occupancy}%` : '0%', trend: 'Live', icon: Users, color: 'text-accent-amber' },
    { label: 'Active Listings', value: stats ? `${stats.listings}` : '0', trend: 'Visible', icon: Home, color: 'text-accent-gold' },
  ]

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-12 md:p-12 overflow-y-auto h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <>
            {/* Live Stats Header */}
            <header className="mb-12 space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-primary-dark font-manrope">{user?.name}'s Hub</h1>
                  <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest mt-1">Property Portfolio Overview • Mutare, Zimbabwe</p>
                </div>
                <div className="flex gap-4">
                   <button className="p-3 bg-white rounded-2xl border border-primary/5 text-primary-dark/40 hover:text-primary transition-all shadow-sm">
                     <Bell size={20} />
                   </button>
                   <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black font-manrope flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                     <PlusCircle size={20} />
                     Post Listing
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {dashboardStats.map((stat, idx) => (
                   <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                         <div className={cn("p-3 rounded-2xl bg-[#F8F9F8]", stat.color)}>
                            <stat.icon size={20} />
                         </div>
                         <span className="text-[9px] font-black text-primary px-3 py-1 bg-primary/5 rounded-full uppercase tracking-tighter shadow-sm border border-primary/5">{stat.trend}</span>
                      </div>
                      <div>
                        <h4 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter">{stat.value}</h4>
                        <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">{stat.label}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <section className="lg:col-span-8 space-y-8">
                {/* Property Management Feed */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tight">Active Portfolio</h3>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-primary/5 shadow-sm">
                       <button 
                        onClick={() => setReviewsVisible(!reviewsVisible)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                          reviewsVisible ? "bg-primary/5 text-primary" : "bg-accent-amber/5 text-accent-amber"
                        )}
                       >
                         {reviewsVisible ? <Eye size={14}/> : <EyeOff size={14}/>}
                         {reviewsVisible ? 'Reviews Public' : 'Reviews Hidden'}
                       </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats?.properties?.map((prop: any) => (
                      <div key={prop.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="relative h-44 overflow-hidden">
                          <img src={prop.image_url} alt={prop.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className={cn(
                            "absolute top-4 right-4 px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] shadow-lg backdrop-blur-md uppercase",
                            prop.status === "occupied" ? "bg-white/90 text-primary" : "bg-accent-amber text-white"
                          )}>
                            {prop.status}
                          </div>
                        </div>
                        <div className="p-8">
                          <h4 className="font-manrope font-black text-xl text-primary-dark tracking-tight">{prop.title}</h4>
                          <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest flex items-center gap-1 mt-1 font-dm-sans">
                            <MapPin size={10} /> {prop.location}
                          </p>
                          <div className="mt-8 pt-6 border-t border-primary/5 flex justify-between items-center">
                             <div className="flex flex-col">
                                <span className="text-[9px] text-primary-dark/30 font-black uppercase tracking-widest">Base Rate</span>
                                <span className="text-2xl font-black text-primary-dark tracking-tighter font-manrope">${prop.price}</span>
                             </div>
                             <button className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary px-6 py-3 rounded-2xl transition-all hover:bg-primary-dark hover:text-white shadow-sm border border-primary/5 group-hover:scale-105">Manage</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!stats?.properties?.length && (
                       <div className="col-span-full py-12 text-center bg-white rounded-[2.5rem] border border-dashed border-primary/10">
                          <p className="text-primary-dark/40 font-bold uppercase tracking-widest text-xs">No properties listed yet.</p>
                       </div>
                    )}
                  </div>
                </div>
              </section>

              <aside className="lg:col-span-4 space-y-8">
                {/* Maintenance Marketplace */}
                <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="font-manrope font-black text-xl text-primary-dark tracking-tight">Maintenance Hub</h3>
                     <span className="w-2 h-2 bg-accent-amber rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 rounded-[2rem] bg-[#F8F9F8] border border-primary/5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                           <h5 className="font-manrope font-black text-primary-dark text-sm leading-tight">Leaking Pipe</h5>
                           <p className="text-[10px] text-primary-dark/40 font-bold uppercase mt-1 tracking-widest">Fern Valley • Unit 4B</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-primary/5 shadow-sm">
                         <TrendingUp size={14} className="text-[#4F7C2C]" />
                         <span className="text-[10px] font-black text-primary-dark uppercase">Pending Pro Quote</span>
                      </div>
                      <button className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Post to Marketplace
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Status / Security */}
                <div className="bg-primary-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                   <ShieldCheck className="text-accent-gold mb-6" size={32} />
                   <h4 className="text-xl font-manrope font-extrabold mb-2 tracking-tight italic">Muzinda Secured</h4>
                   <p className="text-white/40 text-xs font-dm-sans mb-8 leading-relaxed">Your property portfolio is fully protected by AU-Verified verification standards.</p>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-gold w-full" />
                   </div>
                   <p className="text-[10px] font-black text-accent-gold uppercase mt-3 tracking-widest">Account Status: Gold</p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default LandlordDashboard

import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Bus, MapPin, Trash2, Phone, MessageCircle, Clock, ChevronRight, X } from 'lucide-react'
import { cn } from '../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

import { useUserTickets, useTransportTrips, useProviders } from '../hooks/useSupabase'

const StudentTransport = () => {
  const [activeTab, setActiveTab] = useState<'to_campus' | 'to_town'>('to_campus')
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<any>(null)

  const { tickets: activeTickets, loading: ticketsLoading } = useUserTickets()
  const { trips, loading: tripsLoading } = useTransportTrips()
  const { providers: privateShuttles, loading: providersLoading } = useProviders('transport')

  // Derive from remote trips
  const tripsToCampus = trips?.filter(t => !t.routes?.name?.toLowerCase().includes('town')) || []
  const tripsToTown = trips?.filter(t => t.routes?.name?.toLowerCase().includes('town')) || []

  const currentTrips = activeTab === 'to_campus' ? tripsToCampus : tripsToTown

  // const privateShuttles = [ ... ] (Removed in favor of useProviders)

  const handleBookClick = (trip: any) => {
    setSelectedTrip(trip)
    setIsPickupModalOpen(true)
  }

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-32">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary-dark font-manrope">Transport Hub</h1>
          <p className="text-primary-dark/50 font-dm-sans max-w-xl mt-2">
            Book reliable shuttles or private taxis to and from Africa University.
          </p>
        </header>

        {/* My Active Tickets */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
             <h2 className="text-2xl font-manrope font-extrabold text-primary-dark">My Active Tickets</h2>
             {ticketsLoading && <span className="text-sm text-primary-dark/50">Loading...</span>}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {activeTickets.length > 0 ? activeTickets.map(ticket => (
              <div key={ticket.id} className="min-w-[280px] bg-primary-dark p-6 rounded-[2rem] text-white shadow-xl shadow-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold mb-1 block">{ticket.trips?.profiles?.full_name || 'Shuttle Services'}</span>
                    <h3 className="font-bold text-lg leading-tight mb-2">{ticket.trips?.routes?.name || ticket.pickup_point}</h3>
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock size={14} />
                      <span className="text-sm font-bold">{ticket.trips?.departure_time}</span>
                    </div>
                  </div>
                  <button className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white/50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold uppercase">{ticket.status}</span>
                  <button className="text-xs font-bold text-accent-gold flex items-center gap-1 hover:underline">
                    View QR <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-8 border-2 border-dashed border-primary/10 rounded-[2rem] text-center w-full">
                <p className="text-primary-dark/40 font-bold">No active tickets for today.</p>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Available Trips */}
          <section className="xl:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-manrope font-extrabold text-primary-dark">Available Trips (Today)</h2>
              {tripsLoading && <span className="text-sm text-primary-dark/50">Loading...</span>}
              <div className="flex bg-surface-bright p-1 rounded-xl border border-primary/5">
                <button 
                  onClick={() => setActiveTab('to_campus')}
                  className={cn("px-4 py-2 text-sm font-bold rounded-lg transition-all", activeTab === 'to_campus' ? "bg-white shadow-sm text-primary-dark" : "text-primary-dark/40 hover:text-primary-dark")}
                >
                  To Campus
                </button>
                <button 
                  onClick={() => setActiveTab('to_town')}
                  className={cn("px-4 py-2 text-sm font-bold rounded-lg transition-all", activeTab === 'to_town' ? "bg-white shadow-sm text-primary-dark" : "text-primary-dark/40 hover:text-primary-dark")}
                >
                  To Town
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {currentTrips.map(trip => (
                <div key={trip.id} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                      <p className="text-2xl font-black font-manrope text-primary">{trip.departure_time || 'N/A'}</p>
                      <p className="text-[9px] font-extrabold text-primary-dark/40 uppercase tracking-widest mt-1">Departure</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-extrabold uppercase">{trip.routes?.type || 'Bus Shuttle'}</span>
                        <span className="text-[10px] font-extrabold text-primary-dark/40 uppercase">• {trip.profiles?.full_name || 'AU'}</span>
                      </div>
                      <h3 className="font-bold text-primary-dark">{trip.routes?.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-primary/5">
                    <div className="text-right">
                      <h4 className="text-xl font-black text-primary-dark">${trip.routes?.price_morning || 1.00}</h4>
                      <div className="flex items-center gap-1.5 justify-end mt-1">
                        <div className={cn("w-2 h-2 rounded-full", (trip.seatsLeft || 0) > 5 ? "bg-green-500" : "bg-accent-amber")} />
                        <span className="text-[10px] font-extrabold text-primary-dark/50 uppercase">{trip.seatsLeft || 0} Seats</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBookClick(trip)}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Static Timetables */}
            <div className="mt-12">
              <h2 className="text-2xl font-manrope font-extrabold text-primary-dark mb-6">Full Timetables</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['GreenSide Bus', 'Pote Transport', 'AU Official'].map((provider, i) => (
                  <div key={i} onClick={() => alert('Opening full schedule modal...')} className="bg-surface-bright p-6 rounded-2xl border border-primary/5 cursor-pointer hover:bg-primary/5 transition-all group">
                    <Bus className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-primary-dark text-sm">{provider}</h3>
                    <p className="text-[10px] font-extrabold text-primary-dark/40 uppercase mt-1">View Schedule</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Private Shuttles List */}
          <aside className="xl:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-manrope font-extrabold text-primary-dark">Private Shuttles</h2>
               {providersLoading && <span className="text-sm text-primary-dark/50">Loading...</span>}
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4">
              {privateShuttles.map(driver => (
                <div key={driver.id} className="p-4 bg-surface-bright rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img src={driver.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${driver.profiles?.full_name}`} alt={driver.profiles?.full_name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-primary-dark text-sm">{driver.profiles?.full_name}</h4>
                      <div className="flex items-center gap-1 text-accent-gold text-xs font-bold">
                        ★ {5.0} {/* Mock rating for now */}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${driver.profiles?.phone || ''}`} className="flex items-center justify-center gap-2 p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                      <Phone size={14} />
                      <span className="text-xs font-bold">Call</span>
                    </a>
                    <a href={`https://wa.me/${(driver.profiles?.phone || '').replace('+', '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-2.5 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500/20 transition-colors">
                      <MessageCircle size={14} />
                      <span className="text-xs font-bold">WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 text-xs font-bold text-primary hover:underline">
                View all independent drivers
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Pickup Modal */}
      <AnimatePresence>
        {isPickupModalOpen && selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsPickupModalOpen(false)}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl"
            >
              <button 
                onClick={() => setIsPickupModalOpen(false)}
                className="absolute top-8 right-8 p-2 bg-surface-bright text-primary-dark/40 hover:text-primary-dark rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="pr-12 mb-8">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-extrabold uppercase mb-4 inline-block">{selectedTrip.routes?.type}</span>
                <h2 className="text-3xl font-manrope font-extrabold text-primary-dark mb-2">Confirm Booking</h2>
                <p className="text-primary-dark/50 text-sm font-dm-sans">{selectedTrip.routes?.name} at {selectedTrip.departure_time}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-primary-dark/60 uppercase tracking-widest mb-3">Select Pickup Point</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/30" size={20} />
                    <select className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-bright border border-primary/5 focus:border-primary/20 appearance-none font-bold text-primary-dark outline-none cursor-pointer">
                      <option>Chikanga Total Service Station</option>
                      <option>Hobhouse Turnoff</option>
                      <option>Yeovil Standard Route</option>
                    </select>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-primary-dark/60 uppercase tracking-widest">Total Price</p>
                    <p className="text-3xl font-black text-primary-dark font-manrope">${selectedTrip.routes?.price_morning}</p>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase bg-white px-3 py-1.5 rounded-lg border border-primary/10">Cash on Board</p>
                </div>

                <button 
                  onClick={() => {
                    alert('Supabase RPC: Booking confirmed!')
                    setIsPickupModalOpen(false)
                  }}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-bold font-manrope shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg"
                >
                  Confirm & Reserve Seat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StudentTransport

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Navigation, Info } from 'lucide-react'

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MapModal = ({ isOpen, onClose }: MapModalProps) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-dark/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-6xl aspect-[16/10] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Map Area */}
          <div className="flex-1 bg-surface-bright relative group">
            <div className="absolute inset-0 flex items-center justify-center">
               <img 
                 src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2033&auto=format&fit=crop" 
                 alt="Campus Map Placeholder" 
                 className="w-full h-full object-cover opacity-80"
               />
               <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
            
            {/* Mock Landmarks */}
            <div className="absolute top-1/4 left-1/3">
              <div className="relative group/pin">
                <MapPin className="text-primary animate-bounce fill-primary/20" size={32} />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-primary/5 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                  <p className="text-[10px] font-bold text-primary-dark font-manrope">Main Administration</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-1/4">
               <div className="relative group/pin">
                <MapPin className="text-accent-amber animate-bounce fill-accent-amber/20" size={32} />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-primary/5 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                  <p className="text-[10px] font-bold text-primary-dark font-manrope">Dining Hall & Hub</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-2/3">
               <div className="relative group/pin">
                <MapPin className="text-accent-gold animate-bounce fill-accent-gold/20" size={32} />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-primary/5 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                  <p className="text-[10px] font-bold text-primary-dark font-manrope">Student Library</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 left-12 flex flex-col gap-2">
               <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                     <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-dark font-manrope">Muzinda Campus</p>
                    <p className="text-[9px] font-extrabold text-primary-dark/40 uppercase tracking-widest leading-none mt-1">Satellite View Active</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full md:w-80 bg-white border-l border-primary/5 p-8 flex flex-col">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h2 className="text-2xl font-manrope font-extrabold text-primary-dark leading-tight">Campus Navigator</h2>
                  <p className="text-xs text-primary-dark/40 font-dm-sans mt-1 italic">V1.0 Independent Hub</p>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-surface-bright rounded-xl text-primary-dark/20 hover:text-primary-dark transition-all">
                 <X size={20} />
               </button>
            </div>

            <div className="space-y-6 flex-1">
               <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest block ml-1">Legend</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-bright border border-primary/5">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><MapPin size={16}/></div>
                       <span className="text-[11px] font-bold text-primary-dark">Academic Buildings</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-bright border border-primary/5">
                       <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center text-accent-amber"><MapPin size={16}/></div>
                       <span className="text-[11px] font-bold text-primary-dark">Social & Dining</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-bright border border-primary/5">
                       <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center text-accent-gold"><MapPin size={16}/></div>
                       <span className="text-[11px] font-bold text-primary-dark">Security & Services</span>
                    </div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Info size={16} />
                    <span className="text-xs font-bold font-manrope">Live Tracking</span>
                  </div>
                  <p className="text-[11px] text-primary-dark/60 leading-relaxed font-dm-sans">
                    Enable GPS to see shuttle positions in real-time. Contact security for emergency escort services.
                  </p>
               </div>
            </div>

            <button className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold font-manrope shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Launch Detailed Map
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bus, Clock, Users, MapPin, CheckCircle2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { useRoutes, createTrip } from '../hooks/useSupabase'

interface PostShuttleModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PostShuttleModal = ({ isOpen, onClose }: PostShuttleModalProps) => {
  const { routes, loading: routesLoading } = useRoutes()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    route_id: '',
    departure_time: '07:15',
    vehicle_capacity: 15,
    trip_date: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.route_id) return alert('Please select a route')
    setIsSubmitting(true)
    try {
      await createTrip(formData)
      setStep(3) // Success step
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 2000)
    } catch (err: any) {
      alert(err.message || 'Failed to post shuttle')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-primary-dark/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-primary/5 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic">Post Shuttle Run</h2>
                <p className="text-primary-dark/40 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Step {step} of 2 • Route Management</p>
              </div>
              <button onClick={onClose} className="p-3 bg-surface-bright text-primary-dark/20 hover:text-primary-dark rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 md:p-12">
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-primary-dark/40 uppercase tracking-widest pl-4">Select Verified Route</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {routesLoading ? (
                        <div className="col-span-2 py-8 text-center text-primary-dark/20 font-bold">Loading routes...</div>
                      ) : routes.map(route => (
                        <button
                          key={route.id}
                          onClick={() => setFormData({ ...formData, route_id: route.id })}
                          className={cn(
                            "p-6 rounded-3xl border-2 text-left transition-all group relative overflow-hidden",
                            formData.route_id === route.id 
                              ? "border-primary bg-primary/5 shadow-lg" 
                              : "border-primary/5 hover:border-primary/20 bg-surface-bright"
                          )}
                        >
                          <Bus className={cn("mb-4", formData.route_id === route.id ? "text-primary" : "text-primary-dark/20")} size={24} />
                          <h4 className="font-manrope font-black text-primary-dark leading-tight">{route.name}</h4>
                          <p className="text-[10px] font-bold text-primary-dark/40 uppercase mt-2">${route.price_morning} morning fare</p>
                          {formData.route_id === route.id && (
                            <div className="absolute top-4 right-4 text-primary">
                              <CheckCircle2 size={20} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    disabled={!formData.route_id}
                    onClick={() => setStep(2)}
                    className="w-full py-6 bg-primary text-white rounded-3xl font-manrope font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                  >
                    Next: Schedule Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-primary-dark/40 uppercase tracking-widest pl-4">Departure Time</label>
                      <div className="relative">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <input 
                          type="time" 
                          value={formData.departure_time}
                          onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                          className="w-full pl-16 pr-6 py-5 bg-surface-bright border-2 border-primary/5 rounded-3xl font-manrope font-black text-primary-dark outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-primary-dark/40 uppercase tracking-widest pl-4">Vehicle Capacity</label>
                      <div className="relative">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <input 
                          type="number" 
                          placeholder="e.g. 15"
                          value={formData.vehicle_capacity}
                          onChange={(e) => setFormData({ ...formData, vehicle_capacity: parseInt(e.target.value) })}
                          className="w-full pl-16 pr-6 py-5 bg-surface-bright border-2 border-primary/5 rounded-3xl font-manrope font-black text-primary-dark outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                    <div className="flex items-center gap-4 text-primary mb-4">
                      <MapPin size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Selected Route Summary</span>
                    </div>
                    <h3 className="text-xl font-manrope font-black text-primary-dark">
                      {routes.find(r => r.id === formData.route_id)?.name}
                    </h3>
                    <p className="text-sm text-primary-dark/40 mt-1 font-bold">Operating today at {formData.departure_time} ({formData.vehicle_capacity} seats max)</p>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-8 py-6 bg-surface-bright text-primary-dark/40 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-primary/10 transition-all">Back</button>
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 py-6 bg-primary text-white rounded-3xl font-manrope font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting...' : 'Go Live Now'}
                      {!isSubmitting && <CheckCircle2 size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-20 text-center space-y-6">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-green-500/20">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter">Shuttle is Live!</h3>
                  <p className="text-primary-dark/40 font-bold text-sm">Students can now book seats for this run.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

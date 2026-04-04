import { useState } from 'react'
import { X, MapPin, Send, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { applyToService } from '../hooks/useSupabase'

interface ApplyServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: any
  onSuccess: () => void
}

export const ApplyServiceModal = ({ isOpen, onClose, service, onSuccess }: ApplyServiceModalProps) => {
  const [loading, setLoading] = useState(false)
  const [residence, setResidence] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await applyToService(service.id, residence, message)
      onSuccess()
      onClose()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary-dark/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic">Apply for Transport</h2>
                <p className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest mt-1">Join {service?.name}'s monthly roster</p>
              </div>
              <button onClick={onClose} className="p-3 bg-surface-bright text-primary-dark/20 hover:text-primary-dark rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Where will you be residing?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/20" size={18} />
                  <input 
                    type="text" 
                    required
                    value={residence}
                    onChange={e => setResidence(e.target.value)}
                    placeholder="e.g. Chikanga Section 2, Hobhouse, Dangamvura..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-bold text-primary-dark"
                  />
                </div>
                <p className="text-[9px] text-primary-dark/30 font-bold ml-1 italic">This helps the driver optimize your pickup route.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Message for Driver (Optional)</label>
                <div className="relative">
                  <Send className="absolute left-4 top-6 text-primary-dark/20" size={18} />
                  <textarea 
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Any specific requests or questions about the service?"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-bold text-primary-dark resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                    <MessageCircle size={20} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-1">Note on Pickup Times</p>
                    <p className="text-[11px] font-bold text-primary-dark/50 leading-relaxed">Exact pickup times and coordination will be finalized via the Message Center once the driver approves your application.</p>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-manrope font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {loading ? 'Submitting Application...' : 'Apply for Monthly Subscription'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { motion } from 'framer-motion'
import { X, Calendar, CreditCard, AlertCircle, Ban } from 'lucide-react'

interface ManageSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  app: any
  onCancel: () => void
}

export const ManageSubscriptionModal = ({ isOpen, onClose, app, onCancel }: ManageSubscriptionModalProps) => {
  if (!isOpen || !app) return null

  const approvedDate = app.approved_at ? new Date(app.approved_at) : new Date()
  const nextPaymentDate = new Date(approvedDate)
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary-dark/60 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-primary-dark overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard size={48} className="text-white/10" />
           </div>
        </div>

        <div className="relative pt-24 p-10 space-y-8">
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/40 hover:text-white"
           >
             <X size={20} />
           </button>

           <div className="text-center space-y-2">
              <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">Manage Membership</h2>
              <p className="text-xs font-bold text-primary-dark/30 uppercase tracking-[0.2em]">{app.service?.name}</p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-surface-bright rounded-3xl border border-primary/5 space-y-2">
                 <div className="flex items-center gap-2 text-primary">
                    <Calendar size={14} className="opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Last Payment</span>
                 </div>
                 <p className="text-lg font-manrope font-black text-primary-dark leading-none">
                    {approvedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                 </p>
              </div>
              <div className="p-6 bg-accent-gold/5 rounded-3xl border border-accent-gold/10 space-y-2">
                 <div className="flex items-center gap-2 text-accent-gold">
                    <CreditCard size={14} className="opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Next Payment</span>
                 </div>
                 <p className="text-lg font-manrope font-black text-primary-dark leading-none">
                    {nextPaymentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                 </p>
              </div>
           </div>

           <div className="bg-primary-dark p-6 rounded-[2rem] text-white flex gap-4 items-start border border-white/10">
              <AlertCircle size={20} className="text-accent-gold shrink-0 mt-1" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none">Premium Status Active</p>
                 <p className="text-[10px] text-white/40 font-bold leading-relaxed">Your institutional pass is verified and fully funded for the current period. Cancellations take effect at the end of the billing cycle.</p>
              </div>
           </div>

           <div className="space-y-3 pt-2">
              <button 
                onClick={onCancel}
                className="w-full py-5 bg-white text-accent-amber border-2 border-accent-amber/10 rounded-2xl font-black font-manrope text-[10px] uppercase tracking-widest hover:bg-accent-amber hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Ban size={16} /> Cancel Membership
              </button>
              <button 
                onClick={onClose}
                className="w-full py-5 bg-primary-dark text-white rounded-2xl font-black font-manrope text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-primary/20"
              >
                Close Dashboard
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export const NotFound = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-6 font-geist">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mb-48" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        <div className="relative">
          <h1 className="text-[12rem] font-geist font-black text-primary/10 leading-none tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-primary/10 flex items-center justify-center text-primary rotate-12">
                <Home size={48} />
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-geist font-black text-primary-dark tracking-tighter uppercase italic">Page Not Found</h2>
          <p className="text-sm text-primary-dark/40 font-bold max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
            The portal you're looking for has moved or doesn't exist in our current directory.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-6 rounded-2xl font-bold font-geist shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-primary-dark/30 uppercase tracking-widest hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound

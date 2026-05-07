import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface-bright font-dm-sans">
      <div className="relative">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-gold/5 rounded-full blur-[60px]" />
        
        {/* Animated Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-white p-5 rounded-2xl shadow-2xl shadow-primary/5 border border-primary/5 flex items-center justify-center mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-primary"
            >
              <Home size={32} />
            </motion.div>
          </div>
          
          <div className="space-y-3 text-center">
            <motion.h2 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg font-manrope font-extrabold tracking-tighter text-primary-dark uppercase italic"
            >
              Preparing your House
            </motion.h2>
            <div className="flex gap-1.5 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-1 bg-primary rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-[9px] font-extrabold text-primary-dark/20 uppercase tracking-[0.5em] italic">
          Muzinda Institutional Network
        </p>
      </div>
    </div>
  )
}

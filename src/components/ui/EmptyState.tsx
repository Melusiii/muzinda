import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center glass rounded-[3.5rem] border border-dashed border-primary/20 bg-white/40 max-w-2xl mx-auto"
    >
      <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary mb-8 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic mb-2">{title}</h3>
      <p className="text-sm text-primary-dark/40 font-bold max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-10 py-4 bg-primary text-white rounded-2xl font-bold font-manrope shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

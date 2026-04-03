import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={cn(
      "bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl",
      className
    )}>
      {children}
    </div>
  )
}

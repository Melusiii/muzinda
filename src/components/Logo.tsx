import { Home } from 'lucide-react'

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="relative">
        <Home className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-yellow rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] border-2 border-surface-bright" />
      </div>
      <span className="font-manrope text-2xl font-extrabold tracking-tighter text-primary">
        Muzinda
      </span>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  ArrowUpRight, 
  Search,
  Filter,
  Clock,
  DollarSign,
  ShieldCheck,
  CreditCard,
  Building2,
} from 'lucide-react'
import { cn } from '../utils/cn'
import type { LandlordFinance as FinanceType } from '../hooks/useSupabase'

interface LandlordFinanceProps {
  data: FinanceType | null
  loading: boolean
}

export const LandlordFinance: React.FC<LandlordFinanceProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary/10 rounded-full blur-xl animate-pulse" />
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Earnings', value: `$${data.total_earnings.toLocaleString()}`, trend: '+12.5%', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/5', glow: 'shadow-primary/20' },
    { label: 'Pending Payments', value: `$${data.pending_payments.toLocaleString()}`, trend: 'Awaiting', icon: Clock, color: 'text-accent-amber', bg: 'bg-accent-amber/5', glow: 'shadow-accent-amber/20' },
    { label: 'Profit Margin', value: '14.2%', trend: 'Optimum', icon: TrendingUp, color: 'text-accent-gold', bg: 'bg-accent-gold/5', glow: 'shadow-accent-gold/20' },
    { label: 'Occupancy', value: `${data.occupancy_rate}%`, trend: 'Real-time', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/5', glow: 'shadow-green-500/20' },
  ]

  // Smooth interpolation helper for the chart
  const getPath = () => {
    const points = data.monthly_trends.map((m, i) => {
      const x = (i / (data.monthly_trends.length - 1)) * 800;
      const y = 320 - (m.amount / Math.max(...data.monthly_trends.map(d => d.amount), 1)) * 280;
      return { x, y };
    });

    if (points.length < 2) return '';

    // Bezier curve approximation
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  return (
    <div className="space-y-12 font-dm-sans">
      {/* Human-Centric Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl md:text-4xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase">Earnings Dashboard</h2>
          </div>
          <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.4em]">Your Financial History • Live Balance</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           <button className="glass px-6 py-4 rounded-2xl flex items-center justify-center gap-3 border border-white shadow-xl hover:scale-105 active:scale-95 transition-all group w-full md:w-auto">
              <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                 <CreditCard size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark/60 italic">Request Payout</span>
           </button>
           <button className="bg-primary text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 border border-white/20 hover:scale-105 active:scale-95 transition-all group w-full md:w-auto">
              <Building2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Bank Details</span>
           </button>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 md:p-8 rounded-[2rem] border border-white shadow-xl flex flex-row items-center gap-4 md:gap-6 hover:translate-y-[-4px] transition-all duration-500 group relative overflow-hidden bg-white/60"
          >
            <div className={cn("p-3 md:p-4 rounded-xl bg-white shadow-lg transition-all group-hover:scale-110 shrink-0", stat.color)}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="relative flex-1 min-w-0">
              <p className="text-[8px] md:text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.2em] mb-1 truncate">{stat.label}</p>
              <h4 className="text-xl md:text-2xl font-manrope font-black text-primary-dark tracking-tighter italic leading-none truncate">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cinematic Revenue Chart */}
        <div className="lg:col-span-12 glass p-8 md:p-12 rounded-[4rem] border border-white shadow-2xl space-y-12 relative overflow-hidden bg-white/30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[120px]" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6">
            <div>
              <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase">Revenue History</h3>
              <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.5em] mt-1">Growth trends over the last 6 months</p>
            </div>
            <div className="flex p-2 glass bg-white/40 rounded-2xl border border-white shadow-lg">
               <button className="px-6 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all">Monthly View</button>
               <button className="px-6 py-3 rounded-xl text-primary-dark/40 text-[10px] font-black uppercase tracking-widest transition-all hover:text-primary">Annual Report</button>
            </div>
          </div>

          <div className="h-96 relative mt-12 group/graph scale-[1.02]">
            {/* High-Tech Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
               {[...Array(10)].map((_, i) => <div key={`h-${i}`} className="w-full h-px bg-primary-dark" style={{ top: `${i * 10}%` }} />)}
               {[...Array(10)].map((_, i) => <div key={`v-${i}`} className="h-full w-px bg-primary-dark absolute top-0" style={{ left: `${i * 10}%` }} />)}
            </div>
            
            <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 800 320" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E6B3C" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#1E6B3C" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#1E6B3C" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Cinematic Fill Area */}
              <motion.path 
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                d={`${getPath()} L 800 320 L 0 320 Z`}
                fill="url(#chartGradient)"
                className="transition-all duration-1000"
              />

              {/* Glowing Interactive Line */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                d={getPath()}
                fill="none"
                stroke="#1E6B3C"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                className="drop-shadow-[0_8px_24px_rgba(30,107,60,0.4)]"
              />

              {/* High-Fidelity Data Points */}
              {data.monthly_trends.map((m, i) => {
                const x = (i / (data.monthly_trends.length - 1)) * 800;
                const y = 320 - (m.amount / Math.max(...data.monthly_trends.map(d => d.amount), 1)) * 280;
                return (
                  <g key={i} className="group/point">
                    <motion.circle 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
                      cx={x} 
                      cy={y} 
                      r="6" 
                      className="fill-white stroke-primary stroke-[4px] cursor-pointer group-hover/point:r-8 transition-all hover:fill-primary" 
                    />
                    {/* Floating Tooltip */}
                    <foreignObject x={x - 50} y={y - 70} width="100" height="50" className="overflow-visible pointer-events-none opacity-0 group-hover/point:opacity-100 transition-all group-hover/point:-translate-y-2">
                      <div className="bg-primary-dark/95 backdrop-blur-xl text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl text-center border border-white/10 ring-4 ring-primary/5">
                        ${m.amount.toLocaleString()}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-primary-dark rotate-45 border-r border-b border-white/10" />
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {/* Aesthetic Timeline Labels */}
            <div className="flex justify-between mt-12 border-t border-primary/5 pt-6">
               {data.monthly_trends.map((m, idx) => (
                 <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest">{m.month}</span>
                    <span className="text-[8px] font-bold text-primary-dark/20 uppercase tracking-tighter mt-1 italic">FY26</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Improved Payment Records (Transaction History) */}
        <div className="lg:col-span-12 glass p-10 rounded-[3rem] border border-white shadow-2xl relative bg-white/40 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
             <div className="space-y-1">
                <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">Payment Records</h3>
                <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.4em]">Historical tracking of all earnings</p>
             </div>
             <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" size={16} />
                  <input placeholder="Search payments..." className="pl-14 pr-8 py-5 glass bg-white/20 border border-white/40 rounded-2xl text-[10px] font-black outline-none focus:border-primary/20 transition-all w-full md:w-72 shadow-xl" />
                </div>
                <button className="glass p-5 bg-white/40 border border-white rounded-2xl text-primary shadow-xl hover:scale-110 active:scale-95 transition-all"><Filter size={20}/></button>
             </div>
          </div>
          
          <div className="px-2 pb-6">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.3em]">
                    <th className="px-8 pb-4">ID</th>
                    <th className="px-8 pb-4">Date</th>
                    <th className="px-8 pb-4">Student</th>
                    <th className="px-8 pb-4">Amount</th>
                    <th className="px-8 pb-4 text-center">Status</th>
                    <th className="px-8 pb-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_transactions.map((tx, idx) => (
                    <motion.tr 
                      key={tx.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * 0.05) }}
                      className="group"
                    >
                      <td className="px-8 py-8 glass bg-white/60 border-l border-t border-b border-white rounded-l-[2rem] first:rounded-l-[2.5rem] text-[10px] font-black text-primary-dark/40 uppercase tracking-widest">#{tx.id.slice(0, 6)}</td>
                      <td className="px-8 py-8 glass bg-white/60 border-t border-b border-white text-[10px] font-black text-primary-dark/60 uppercase tracking-tighter italic">{tx.date}</td>
                      <td className="px-8 py-8 glass bg-white/60 border-t border-b border-white">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                            {tx.student_name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-primary-dark uppercase tracking-tight italic font-manrope">{tx.student_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 glass bg-white/60 border-t border-b border-white">
                        <span className="text-xl font-black text-primary-dark font-manrope italic leading-none group-hover:text-primary transition-colors">${tx.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-8 glass bg-white/60 border-t border-b border-white text-center">
                        <div className={cn(
                          "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border transition-all duration-700",
                          tx.status === 'paid' ? "bg-primary/5 text-primary border-primary/20 shadow-primary/5" :
                          tx.status === 'pending' ? "bg-accent-amber/5 text-accent-amber border-accent-amber/20 shadow-accent-amber/5" :
                          "bg-red-50 text-red-500 border-red-100 shadow-red-500/5"
                        )}>
                          <div className={cn("w-2 h-2 rounded-full shadow-lg", 
                            tx.status === 'paid' ? "bg-primary shadow-primary/80" : 
                            tx.status === 'pending' ? "bg-accent-amber shadow-accent-amber/80 animate-pulse" : 
                            "bg-red-500 shadow-red-500/80"
                          )} />
                          {tx.status}
                        </div>
                      </td>
                      <td className="px-8 py-8 glass bg-white/60 border-r border-t border-b border-white rounded-r-[2rem] last:rounded-r-[2.5rem] text-right">
                        <button className="p-4 bg-primary/5 text-primary rounded-xl hover:bg-primary-dark hover:text-white transition-all shadow-lg border border-primary/10">
                          <ArrowUpRight size={18}/>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Stack */}
            <div className="md:hidden space-y-6">
               {data.recent_transactions.map((tx, idx) => (
                <motion.div 
                  key={tx.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass p-6 rounded-[2rem] border border-white bg-white/60 space-y-6 shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black border border-primary/10 shadow-inner">
                        {tx.student_name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-primary-dark uppercase tracking-tight italic font-manrope">{tx.student_name}</span>
                         <span className="text-[8px] font-black text-primary-dark/30 uppercase tracking-widest">{tx.date}</span>
                      </div>
                    </div>
                    <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                        tx.status === 'paid' ? "bg-primary/5 text-primary border-primary/20" :
                        tx.status === 'pending' ? "bg-accent-amber/5 text-accent-amber border-accent-amber/20" :
                        "bg-red-50 text-red-500 border-red-100"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", tx.status === 'paid' ? "bg-primary" : tx.status === 'pending' ? "bg-accent-amber animate-pulse" : "bg-red-500")} />
                        {tx.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-primary/5 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-primary-dark/20 uppercase tracking-[0.3em] mb-1">Total Amount</span>
                      <span className="text-2xl font-black text-primary-dark font-manrope italic">${tx.amount.toLocaleString()}</span>
                    </div>
                    <button className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all">
                       <ArrowUpRight size={18}/>
                    </button>
                  </div>
                </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

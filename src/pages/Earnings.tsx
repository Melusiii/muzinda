import { Wallet, TrendingUp, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react'
import { cn } from '../utils/cn'

export const Earnings = () => {
  const transactions = [
    { id: 1, type: 'Maintenance Gig', date: 'Oct 12, 2023', amount: 45.00, status: 'Completed', provider: 'Fern Valley Estate' },
    { id: 2, type: 'Shuttle Payout', date: 'Oct 10, 2023', amount: 120.50, status: 'Processing', provider: 'Mutare Trust' },
    { id: 3, type: 'Security Deposit', date: 'Oct 08, 2023', amount: 15.00, status: 'Released', provider: 'Muzinda Hub' },
  ]

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <main className="flex-1 md:ml-64 p-6 md:p-8 pt-28 md:pt-28 min-h-screen relative z-10 space-y-12">
         <header className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm">
            <div>
               <h1 className="text-4xl font-extrabold tracking-tighter text-primary-dark font-manrope">Earnings Hub</h1>
               <p className="text-primary-dark/50 font-dm-sans">Track your service revenue and payouts.</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                   <p className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest leading-none">Net Balance</p>
                   <p className="text-3xl font-black text-primary font-manrope mt-1">$180.50</p>
                </div>
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold font-manrope shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                   Withdraw
                </button>
            </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 space-y-6">
               <h3 className="text-2xl font-manrope font-extrabold text-primary-dark px-4">Recent Payouts</h3>
               <div className="space-y-4">
                  {transactions.map((t) => (
                    <div key={t.id} className="bg-white p-6 rounded-[2.5rem] border border-primary/5 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                            t.status === 'Completed' ? "bg-primary/10 text-primary" : "bg-accent-amber/10 text-accent-amber"
                          )}>
                             {t.status === 'Completed' ? <TrendingUp size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                             <h4 className="font-bold text-primary-dark text-sm">{t.type}</h4>
                             <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest">{t.date} • {t.provider}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-black text-primary-dark">${t.amount.toFixed(2)}</p>
                          <span className={cn(
                            "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full",
                            t.status === 'Completed' ? "bg-primary/5 text-primary" : "bg-accent-amber/5 text-accent-amber"
                          )}>{t.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            <aside className="lg:col-span-4 space-y-8">
               <div className="bg-primary-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
                  <Wallet size={32} className="text-accent-gold mb-6" />
                  <h4 className="text-xl font-manrope font-extrabold mb-2">Automated Payouts</h4>
                  <p className="text-white/40 text-xs font-dm-sans leading-relaxed mb-8">
                    Muzinda settles all maintenance and shuttle accounts every Friday at 17:00 CAT.
                  </p>
                  <button className="flex items-center gap-2 text-accent-gold text-xs font-bold hover:underline">
                    View Fee Structure
                    <ArrowUpRight size={14} />
                  </button>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 space-y-4">
                  <div className="flex gap-4">
                    <ShieldCheck size={20} className="text-primary mt-1" />
                    <div>
                      <p className="text-xs font-bold text-primary-dark">Escrow Protection</p>
                      <p className="text-[11px] text-primary-dark/40 mt-1">All service fees are held in Muzinda Escrow until the student verifies the task completion.</p>
                    </div>
                  </div>
               </div>
            </aside>
         </div>
      </main>
    </div>
  )
}

export default Earnings

import { Sidebar } from '../components/Sidebar'
import { Briefcase, Info, Lock } from 'lucide-react'

const ProviderMarketplace = () => {
  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-12 flex flex-col items-center justify-center text-center">
         <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 shadow-xl shadow-primary/5">
               <Briefcase size={40} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary-dark font-manrope">Gig Marketplace</h1>
            <p className="text-primary-dark/50 font-dm-sans">
               Browse and claim maintenance requests from verified landlords.
 Verified students get prioritized responses.
            </p>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4">
               <div className="flex items-center gap-3 text-accent-amber">
                  <Lock size={18} />
                  <span className="text-xs font-bold font-manrope">Verification Required</span>
               </div>
               <p className="text-xs text-primary-dark/40 text-left leading-relaxed">
                  Your provider profile is currently being reviewed by the Mutare Trust team. Once verified, you will gain access to the live bidding pool.
               </p>
               <div className="pt-4 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-bright rounded-xl">
                    <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
                    <span className="text-xs font-black text-primary-dark uppercase tracking-widest">Muzinda Certified</span>
                  </div>
               </div>
            </div>

            <div className="pt-6">
               <button className="flex items-center gap-2 text-primary text-sm font-bold hover:underline mx-auto">
                 <Info size={16} />
                 View Requirements
               </button>
            </div>
         </div>
      </main>
    </div>
  )
}

export default ProviderMarketplace

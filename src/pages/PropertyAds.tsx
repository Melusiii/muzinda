import { Sidebar } from '../components/Sidebar'
import { Megaphone, Plus, Info } from 'lucide-react'

const PropertyAds = () => {
  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-12 flex flex-col">
         <header className="mb-12 flex justify-between items-center">
            <div>
               <h1 className="text-4xl font-extrabold tracking-tighter text-primary-dark font-manrope">Property Ads</h1>
               <p className="text-primary-dark/50 font-dm-sans">Manage your featured listings and promotions.</p>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold font-manrope flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
               <Plus size={20} />
               Create Ad Campaign
            </button>
         </header>

         <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white rounded-[3rem] border border-primary/5 shadow-sm">
            <div className="w-20 h-20 bg-accent-gold/10 rounded-[2rem] flex items-center justify-center text-accent-gold mb-8 shadow-xl shadow-accent-gold/5">
               <Megaphone size={40} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tighter text-primary-dark font-manrope">No Active Ad Campaigns</h2>
            <p className="text-primary-dark/40 max-w-sm mt-2 font-dm-sans">
               Promote your properties to the top of the AU search results to increase visibility.
            </p>
            
            <div className="mt-12 p-6 bg-surface-bright rounded-2xl border border-primary/5 flex items-start gap-4 text-left max-w-md">
               <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Info size={16} />
               </div>
               <div>
                 <p className="text-xs font-bold text-primary-dark uppercase tracking-widest mb-1">Coming Soon</p>
                 <p className="text-[11px] text-primary-dark/50 leading-relaxed">
                   The Muzinda Ad Console is currently being finalized. Landlords with verified professional profiles will be the first to access the beta.
                 </p>
               </div>
            </div>
         </div>
      </main>
    </div>
  )
}

export default PropertyAds

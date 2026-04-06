import { Heart, MapPin, ArrowRight, Compass } from 'lucide-react'
import { useFavorites } from '../hooks/supabase/useProperties'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../utils/supabase-helpers'
import { Sidebar } from '../components/Sidebar'
import { PageHeader } from '../components/PageHeader'
import { motion, AnimatePresence } from 'framer-motion'

export const StudentFavorites = () => {
  const navigate = useNavigate()
  const { favorites, toggleFavorite, loading } = useFavorites()

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-28 md:p-8 min-h-screen relative pb-32">
        <PageHeader 
          title="Saved Houses" 
          subtitle="Your curated collection of Muzinda favorites"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-white rounded-[2.5rem] animate-pulse border border-primary/5" />
            ))}
          </div>
        ) : favorites.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AnimatePresence mode="popLayout">
               {favorites.map((fav, idx) => {
                 const prop = fav.property;
                 if (!prop) return null;
   
                 return (
                   <motion.div 
                    key={fav.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                   >
                     <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-primary/5 h-full flex flex-col group/card relative">
                        <div 
                          className="relative h-64 overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/property/${prop.id}`)}
                        >
                          <img 
                            src={getImageUrl(prop.image_url)} 
                            alt={prop.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        </div>
                        
                        {/* Unified Toggle Heart */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(prop.id);
                          }}
                          className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 shadow-xl hover:scale-110 active:scale-95 transition-all z-20 border border-white/20"
                        >
                          <Heart size={20} className="fill-current" />
                        </button>

                       <div className="p-8 flex flex-col flex-grow">
                         <div className="flex justify-between items-start mb-6 gap-4">
                            <div className="min-w-0 flex-1">
                               <h3 className="text-xl font-black font-manrope text-primary-dark tracking-tight leading-none group-hover/card:text-primary transition-colors">{prop.title}</h3>
                               <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest mt-2.5 flex items-center gap-1.5 leading-none">
                                  <MapPin size={10} className="text-primary" /> {prop.location?.split(',')[0]}
                               </p>
                            </div>
                            <div className="text-right shrink-0">
                               <span className="text-xl font-black text-primary-dark tracking-tighter font-manrope leading-none">${prop.price}</span>
                               <p className="text-[9px] font-black text-primary-dark/20 uppercase tracking-widest mt-1">USD/mo</p>
                            </div>
                         </div>

                         <div 
                           onClick={() => navigate(`/property/${prop.id}`)}
                           className="mt-auto pt-6 border-t border-primary/5 flex justify-between items-center group/btn cursor-pointer"
                         >
                            <span className="text-[10px] font-black text-primary-dark/30 uppercase tracking-[0.2em] group-hover/btn:text-primary transition-colors">Enter House</span>
                            <div className="w-10 h-10 bg-surface-bright rounded-xl flex items-center justify-center text-primary-dark/20 group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:shadow-lg transition-all">
                               <ArrowRight size={16} />
                            </div>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 )
               })}
             </AnimatePresence>
           </div>
        ) : (
          <div className="bg-white p-16 rounded-[4rem] text-center max-w-2xl mx-auto shadow-sm border border-primary/5 mt-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto text-primary/10 mb-8 border border-primary/5">
                <Heart size={48} />
              </div>
              <h2 className="text-4xl font-black font-manrope text-primary-dark mb-4 tracking-tighter italic leading-none">The House is Empty</h2>
              <p className="text-primary-dark/40 font-dm-sans mb-10 text-md max-w-md mx-auto leading-relaxed">You haven't saved any verified properties yet. Start your journey by exploring the Mutare District.</p>
              <button 
                onClick={() => navigate('/explorer')}
                className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
              >
                Launch Explorer <Compass size={18} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentFavorites

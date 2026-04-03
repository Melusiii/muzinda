import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'
import { Heart, MapPin, Loader2, ArrowRight } from 'lucide-react'
import { useFavorites } from '../hooks/useSupabase'
import { useNavigate } from 'react-router-dom'

const StudentFavorites = () => {
  const navigate = useNavigate()
  const { favorites, loading, refetch } = useFavorites()

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-12 md:p-12 overflow-y-auto h-screen">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-primary-dark font-manrope leading-none mb-4">
            Saved Properties
          </h1>
          <p className="text-primary-dark/40 font-bold uppercase tracking-widest text-[10px]">
            Your curated collection of Muzinda favorites
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav) => {
              const prop = fav.property;
              if (!prop) return null;

              return (
                <div key={fav.id} className="group cursor-pointer" onClick={() => navigate(`/property/${prop.id}`)}>
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-primary/5 h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={prop.image_url} 
                        alt={prop.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          import('../lib/supabase').then(({ supabase }) => {
                             supabase.from('favorites').delete().eq('id', fav.id).then(() => refetch());
                          })
                        }}
                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-accent-amber shadow-lg hover:bg-accent-amber hover:text-white transition-all transform hover:scale-110"
                      >
                        <Heart size={20} fill="currentColor" />
                      </button>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4 gap-4">
                         <div className="min-w-0 flex-1">
                            <h3 className="text-2xl font-black font-manrope text-primary-dark tracking-tight truncate">{prop.title}</h3>
                            <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                               <MapPin size={10} className="text-[#4F7C2C]" /> {prop.location}
                            </p>
                         </div>
                         <div className="text-right shrink-0">
                            <span className="text-2xl font-black text-primary tracking-tighter font-manrope">${prop.price}</span>
                         </div>
                      </div>
                      <div className="mt-auto pt-6 border-t border-primary/5 flex justify-between items-center group/btn">
                         <span className="text-xs font-bold text-primary-dark/60 uppercase tracking-widest">View Details</span>
                         <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-all">
                            <ArrowRight size={16} />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] text-center max-w-2xl mx-auto shadow-sm border border-primary/5 mt-12">
            <Heart size={48} className="mx-auto text-primary/20 mb-6" />
            <h2 className="text-3xl font-black font-manrope text-primary-dark mb-4 tracking-tighter">No favorites yet</h2>
            <p className="text-primary-dark/50 font-dm-sans mb-8">You haven't saved any verified properties. Explore Muzinda to find your perfect student accommodation.</p>
            <button 
              onClick={() => navigate('/explorer')}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Start Exploring
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentFavorites

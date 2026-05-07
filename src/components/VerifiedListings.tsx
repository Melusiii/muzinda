import { motion } from 'framer-motion'
import { Star, ArrowRight, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProperties } from '../hooks/useSupabase'
import { getImageUrl } from '../utils/supabase-helpers'

export const VerifiedListings = () => {
  const { properties, loading, error } = useProperties()
  
  // Show only first 3 for the homepage section
  const featured = properties?.slice(0, 3) || []

  if (error) {
    return (
      <div className="py-12 border-t border-primary/5 text-center">
        <p className="text-primary/40 font-dm-sans italic">Unable to load listings. Please check your connection.</p>
      </div>
    );
  }

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-primary">
                <div className="w-10 h-[1px] bg-current opacity-30" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Featured Properties</span>
             </div>
            <h2 className="text-4xl md:text-5xl font-manrope font-extrabold text-primary-dark tracking-tight">Verified <span className="text-primary/40 italic">Houses</span></h2>
            <p className="text-primary-dark/40 font-dm-sans max-w-lg">Hand-picked, inspected, and certified residences designed for academic excellence.</p>
          </div>
          <Link to="/explorer" className="flex items-center gap-2 text-primary-dark font-bold hover:gap-4 transition-all group pb-2 border-b-2 border-primary/10">
            Explore All Listings <ArrowRight size={18} className="text-primary" />
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar -mx-6 px-6 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:pb-0 md:mx-0">
          {loading ? (
             [1,2,3].map(i => (
               <div key={i} className="min-w-[85vw] md:min-w-0 aspect-[4/3] bg-surface-bright animate-pulse rounded-[2.5rem]" />
             ))
          ) : (
            featured.map((prop, idx) => (
              <motion.div 
                key={prop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group cursor-pointer min-w-[85vw] md:min-w-0 snap-center"
              >
                <Link to={`/property/${prop.id}`}>
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl shadow-primary/5 bg-gray-100">
                    <img 
                      src={getImageUrl(prop.image_url)} 
                      alt={prop.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                      }}
                    />
                    
                    {/* Glass Badges */}
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm border border-white/20">
                          <Star size={14} className="text-accent-gold fill-accent-gold" />
                          <span className="text-[11px] font-bold text-primary-dark">{prop.rating || '4.8'}</span>
                        </div>
                        <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary-dark/40 hover:text-red-500 transition-colors border border-white/20 shadow-sm">
                           <Heart size={18} />
                        </button>
                    </div>

                    <div className="absolute bottom-5 left-5">
                        <div className="bg-primary/90 backdrop-blur-md text-white px-5 py-2 rounded-2xl font-bold text-xs shadow-lg">
                           ${prop.price} <span className="opacity-60 font-medium">/mo</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 px-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-manrope font-extrabold text-primary-dark leading-none group-hover:text-primary transition-colors">{prop.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-primary-dark/40">
                       <MapPin size={12} className="text-primary/60" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">{prop.location}</p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <span className="text-[9px] font-extrabold uppercase px-3 py-1.5 bg-[#4F7C2C]/5 text-[#4F7C2C] rounded-xl border border-[#4F7C2C]/10">
                        {prop.type === 'hostel' ? 'WiFi Included' : 'Furnished'}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-3 py-1.5 bg-primary/5 text-primary-dark/60 rounded-xl border border-primary/5">
                        Verified Listing
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

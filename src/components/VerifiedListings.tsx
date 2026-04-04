import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'
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
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-manrope font-extrabold text-primary-dark">Verified Listings</h2>
            <p className="text-primary-dark/40 font-dm-sans">Hand-picked, inspected, and certified residences.</p>
          </div>
          <Link to="/explorer" className="flex items-center gap-2 text-primary-dark font-bold hover:underline group">
            Explore All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3].map(i => (
               <div key={i} className="aspect-[4/3] bg-surface-bright animate-pulse rounded-[2.5rem]" />
             ))
          ) : (
            featured.map((prop, idx) => (
              <motion.div 
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/property/${prop.id}`}>
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-primary/5 bg-gray-100">
                    <img 
                      src={getImageUrl(prop.image_url)} 
                      alt={prop.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <Star size={14} className="text-accent-gold fill-accent-gold" />
                      <span className="text-[11px] font-bold text-primary-dark">{prop.rating || '4.8'} ({prop.reviews_count || '12'} Reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start px-2">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-manrope font-extrabold text-primary-dark leading-none">{prop.title}</h3>
                      <p className="text-xs text-primary-dark/40 font-bold uppercase tracking-widest">{prop.location}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest">Monthly</p>
                       <p className="text-xl font-black text-primary-dark">${prop.price}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 px-2">
                    <span className="text-[9px] font-extrabold uppercase px-3 py-1 bg-[#4F7C2C]/5 text-[#4F7C2C] rounded-full border border-[#4F7C2C]/10">
                      {prop.type === 'hostel' ? 'WiFi Included' : 'Furnished'}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-3 py-1 bg-primary/5 text-primary-dark/60 rounded-full border border-primary/5">
                      Verified
                    </span>
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

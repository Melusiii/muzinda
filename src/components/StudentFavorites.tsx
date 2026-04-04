import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProperties } from '../hooks/useSupabase'
import { getImageUrl } from '../utils/supabase-helpers'

export const StudentFavorites = () => {
  const { properties, loading } = useProperties()
  
  // Use first 2 properties from database or fallback to empty
  const favorites = properties?.slice(0, 2).map((p: any, i: number) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    reviewer: i === 0 ? "Rudo M." : "Tinashe G.",
    review: p.description || (i === 0 ? "Best study environment in Mutare. The backup solar power makes exam week stress-free." : "Great community vibe and very close to the shuttle stop. The kitchen is always clean."),
    image: getImageUrl(p.image_url),
    badge: i === 0 ? "Top Rated" : "Most Popular",
    tag: p.type === 'hostel' ? 'Includes Laundry' : 'Shared Kitchen'
  })) || []

  if (loading || favorites.length === 0) return null

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-manrope text-4xl font-extrabold text-primary-dark mb-16 px-2">
          Student Favorites
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {favorites.map((fav: any, index: number) => (
            <motion.div 
              key={fav.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 items-start group p-6 rounded-[3rem] hover:bg-surface-bright/50 transition-all cursor-pointer border border-transparent hover:border-primary/5"
            >
              <div className="w-full md:w-56 aspect-square rounded-[2.5rem] overflow-hidden shrink-0 shadow-xl shadow-primary/5">
                <img 
                  src={fav.image} 
                  alt={fav.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="flex-1 py-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#D4AF37]/10 text-[#B8860B] text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/10">
                    {fav.badge}
                  </span>
                  <div className="flex gap-0.5 text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                </div>
                <div className="space-y-2">
                   <h3 className="font-manrope text-3xl font-extrabold text-primary-dark tracking-tight">{fav.name}</h3>
                   <p className="text-primary-dark/60 text-sm italic font-dm-sans leading-relaxed">
                     "{fav.review}" <span className="font-bold not-italic ml-1 opacity-100 text-primary-dark">— {fav.reviewer}</span>
                   </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-2xl font-black text-primary-dark">${fav.price}/mo</span>
                  <span className="text-primary-dark/30 text-[10px] font-bold uppercase tracking-widest">{fav.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

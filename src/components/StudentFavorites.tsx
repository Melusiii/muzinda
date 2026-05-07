import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProperties } from '../hooks/useSupabase'
import { getImageUrl } from '../utils/supabase-helpers'

export const StudentFavorites = () => {
  const { properties, loading } = useProperties()
  
  // Use first 2 properties from database or fallback to empty
  const favorites = properties?.slice(0, 2).map((p: any, i: number) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    reviewer: i === 0 ? "Rudo M." : "Tinashe G.",
    review: p.description || (i === 0 ? "Best study environment in Mutare. The backup solar power makes exam week stress-free." : "Great community vibe and very close to the shuttle stop. The kitchen is always clean."),
    image: getImageUrl(p.image_url),
    badge: i === 0 ? "Top Rated" : "Most Popular",
    tag: p.type === 'hostel' ? 'Includes Laundry' : 'Shared Kitchen'
  })) || []

  if (loading || favorites.length === 0) return null

  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex items-center gap-4">
           <div className="h-[2px] w-12 bg-primary opacity-20" />
           <h2 className="font-manrope text-4xl md:text-5xl font-extrabold text-primary-dark tracking-tight">
             Student <span className="text-primary">Favorites</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {favorites.map((fav: any, index: number) => (
            <motion.div 
              key={fav.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 items-stretch group p-8 rounded-[3.5rem] bg-surface-bright/30 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-primary/10 shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="w-full md:w-56 aspect-square rounded-[2.5rem] overflow-hidden shrink-0 shadow-xl shadow-primary/5">
                <img 
                  src={fav.image} 
                  alt={fav.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#D4AF37]/10 text-[#B8860B] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#D4AF37]/10">
                      {fav.badge}
                    </span>
                    <div className="flex gap-0.5 text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                  </div>
                  <div className="relative">
                     <Quote className="absolute -top-4 -left-4 text-primary/10" size={40} />
                     <p className="text-primary-dark/60 text-sm md:text-base italic font-dm-sans leading-relaxed relative z-10">
                       "{fav.review}"
                     </p>
                     <p className="text-xs font-black text-primary-dark mt-4">— {fav.reviewer}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary-dark">${fav.price}</span>
                    <span className="text-[10px] font-bold text-primary-dark/30 uppercase">/month</span>
                  </div>
                  <span className="text-primary-dark/30 text-[9px] font-black uppercase tracking-[0.2em]">{fav.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

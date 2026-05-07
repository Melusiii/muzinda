import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight, Sparkles } from 'lucide-react'
import { useProperties } from '../hooks/useSupabase'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/supabase-helpers'

export const Neighborhoods = () => {
  const { properties, loading } = useProperties()
  
  // Calculate counts for each unique location
  const counts = properties.reduce((acc: any, p) => {
    acc[p.location] = (acc[p.location] || 0) + 1
    return acc
  }, {})

  const neighborhoods = Object.entries(counts).map(([name, count]) => {
    // Find the first property in this neighborhood to use its image
    const propInHood = properties.find(p => p.location === name);
    return {
      name,
      count: count as number,
      image: getImageUrl(propInHood?.image_url || null)
    }
  }).slice(0, 4) // Show top 4

  return (
    <section className="py-24 px-5 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
             <div className="flex gap-2 items-center text-accent-gold">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trending Now</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-manrope font-black text-primary-dark tracking-tighter">
               Find your <span className="text-primary-dark/20 italic">local vibe</span>
             </h2>
          </div>
          <p className="text-primary-dark/40 font-dm-sans max-w-xs md:text-right italic">
            Discover the unique personality of Mutare's most beloved student communities.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-8 pb-12 no-scrollbar -mx-5 px-5 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0 md:mx-0">
          {loading ? (
             [1,2,3,4].map(i => (
               <div key={i} className="min-w-[75vw] h-[450px] bg-surface-bright animate-pulse rounded-[3rem]" />
             ))
          ) : (
            neighborhoods.map((n, idx) => (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.7 }}
                className="group relative h-[450px] min-w-[75vw] md:min-w-0 snap-center rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl shadow-primary/5"
              >
                <img 
                  src={n.image} 
                  alt={n.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                
                <div className="absolute inset-x-0 bottom-0 p-10 text-white space-y-4">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-primary">
                            <MapPin size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{n.count} Listings</span>
                         </div>
                         <h3 className="text-3xl font-manrope font-black tracking-tight">{n.name}</h3>
                      </div>
                      <Link to="/explorer" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-dark opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-xl">
                         <ArrowUpRight size={24} />
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

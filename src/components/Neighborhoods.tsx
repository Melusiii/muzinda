import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { useProperties } from '../hooks/useSupabase'
import { Link } from 'react-router-dom'

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
      image: propInHood?.image_url || 'https://images.unsplash.com/photo-1592591502264-745a727dca82?q=80&w=2070&auto=format&fit=crop'
    }
  }).slice(0, 4) // Show top 4

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
             <div className="flex gap-2 items-center text-[#4F7C2C]">
                <div className="w-8 h-[2px] bg-current opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neighborhoods</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-manrope font-black text-primary-dark tracking-tighter">
               Find your <span className="text-primary-dark/40 italic">local vibe</span>
             </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             [1,2,3,4].map(i => (
               <div key={i} className="h-[400px] bg-surface-bright animate-pulse rounded-[3rem]" />
             ))
          ) : (
            neighborhoods.map((n, idx) => (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-[400px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl shadow-primary/5"
              >
                <img 
                  src={n.image} 
                  alt={n.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                            <MapPin size={14} className="text-white" />
                         </div>
                         <h3 className="text-2xl font-manrope font-black tracking-tight">{n.name}</h3>
                      </div>
                      <Link to="/explorer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                         <ArrowUpRight size={20} className="text-white" />
                      </Link>
                   </div>
                   <p className="text-sm font-dm-sans text-white/60 font-bold uppercase tracking-widest">{n.count} Properties</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Star, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProperties } from '../hooks/useSupabase'

const isNew = (created_at: string) => {
  const diffHours = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60)
  return diffHours < 24
}

export const VerifiedListings = () => {
  const { properties, loading, error } = useProperties()
  
  // Show only first 3 for the homepage section
  const featured = properties?.slice(0, 3) || []

  if (error) return null // Hide section if error

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-manrope font-extrabold text-primary-dark">Verified Listings</h2>
            <p className="text-primary-dark/40 font-dm-sans">Hand-picked, inspected, and AU-approved residences.</p>
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
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-primary/5">
                    <img 
                      src={prop.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Verified / Pending badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      {prop.verified ? (
                        <><Star size={14} className="text-accent-gold fill-accent-gold" />
                        <span className="text-[11px] font-bold text-primary-dark">AU Verified</span></>
                      ) : (
                        <><ShieldCheck size={14} className="text-amber-500" />
                        <span className="text-[11px] font-bold text-amber-600">Pending</span></>
                      )}
                    </div>
                    {/* NEW badge for fresh listings */}
                    {prop.created_at && isNew(prop.created_at) && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        NEW
                      </div>
                    )}
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

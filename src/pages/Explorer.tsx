import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { Map as MapIcon, Wifi, Zap, ArrowRight, Search, Filter, Star, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useProperties } from '../hooks/useSupabase'

const Explorer = () => {
  const [searchParams] = useSearchParams()
  const { properties, loading, error } = useProperties()
  const [search, setSearch] = useState('')
  const [selectedGender, setSelectedGender] = useState('All')
  const [priceRange, setPriceRange] = useState(500)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.location.toLowerCase().includes(search.toLowerCase())
    const matchesGender = selectedGender === 'All' || p.gender_preference === selectedGender || p.gender_preference === 'Mixed'
    const matchesPrice = p.price <= priceRange
    return matchesSearch && matchesGender && matchesPrice
  })

  return (
    <Layout>
      <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 space-y-10 border border-primary/5 shadow-sm sticky top-32">
            {/* Search Input in Sidebar */}
            <div className="space-y-4">
               <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.2em]">Quick Search</h3>
               <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/20" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Area, hostel..."
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F9F8] rounded-2xl border border-primary/5 outline-none text-sm font-dm-sans focus:border-primary/20 transition-all font-bold"
                  />
               </div>
            </div>

            <div>
              <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.2em] mb-4">Location Focus</h3>
              <div className="relative h-40 w-full rounded-[2rem] overflow-hidden bg-[#F8F9F8] border border-primary/5">
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <MapIcon className="text-primary/20" size={48} />
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-sm border border-primary/5 text-center">
                  <span className="text-[10px] font-black text-primary tracking-tighter uppercase">Africa University Area</span>
                </div>
              </div>
            </div>

            {/* Gender Filter */}
            <div className="space-y-5">
              <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.2em]">Gender Preference</h3>
              <div className="flex flex-col gap-4">
                {['Female Only', 'Male Only', 'Mixed', 'All'].map((gender) => (
                  <button 
                    key={gender} 
                    onClick={() => setSelectedGender(gender)}
                    className="flex items-center gap-3 group text-left"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center",
                      selectedGender === gender ? "border-primary bg-primary" : "border-primary/10 bg-white group-hover:border-primary/30"
                    )}>
                      {selectedGender === gender && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={cn(
                      "text-sm font-bold transition-colors",
                      selectedGender === gender ? "text-primary-dark" : "text-primary-dark/40 group-hover:text-primary-dark"
                    )}>{gender}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-5">
               <div className="flex justify-between items-end">
                <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.2em]">Budget Cap</h3>
                <span className="text-primary font-black text-lg">${priceRange}</span>
               </div>
              <input 
                type="range" 
                min="100" 
                max="1000" 
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F8F9F8] rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div className="flex justify-between text-[9px] text-primary-dark/30 font-black uppercase tracking-widest">
                <span>$100</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex gap-2 items-center text-[#4F7C2C] mb-2">
                 <div className="w-8 h-[2px] bg-current opacity-20" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Stays</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-primary-dark font-manrope leading-none">Discover Homes</h1>
              <p className="text-primary-dark/40 font-bold uppercase tracking-widest text-[10px] mt-4">{filtered.length} verified properties found</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm">
              <Filter size={14} className="text-primary/40" />
              <span className="text-[10px] font-black text-primary-dark/40 uppercase tracking-widest">Sort:</span>
              <select className="bg-transparent border-none text-xs font-black text-primary focus:ring-0 cursor-pointer p-0 pr-8">
                <option>Distance</option>
                <option>Price (Low)</option>
                <option>Price (High)</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {loading ? (
               [1,2,3,4].map(i => (
                 <div key={i} className="aspect-[4/5] bg-surface-bright animate-pulse rounded-[3rem]" />
               ))
            ) : error ? (
               <div className="col-span-full py-20 text-center">
                  <p className="text-red-500 font-bold">Failed to load listings. Please try again later.</p>
               </div>
            ) : filtered.length === 0 ? (
               <div className="col-span-full py-32 text-center space-y-4">
                  <div className="w-20 h-20 bg-[#F8F9F8] rounded-[2.5rem] flex items-center justify-center mx-auto text-primary/10">
                     <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-manrope font-black text-primary-dark">No matches found</h3>
                  <p className="text-primary-dark/40 font-dm-sans max-w-xs mx-auto">Try adjusting your filters or searching for a different area in Mutare.</p>
                  <button onClick={() => {setSearch(''); setSelectedGender('All'); setPriceRange(500);}} className="text-primary font-black uppercase tracking-widest text-xs mt-4 hover:underline">Clear all filters</button>
               </div>
            ) : (
              <AnimatePresence>
                {filtered.map((prop, idx) => (
                  <motion.div
                    key={prop.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-[3rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >
                    <Link to={`/property/${prop.id}`}>
                      <div className="relative h-72 overflow-hidden">
                        <img 
                          src={prop.image_url} 
                          alt={prop.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6">
                          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                            <Star size={14} className="text-accent-gold fill-accent-gold" />
                            <span className="text-[11px] font-black text-primary-dark">{prop.rating || '4.8'}</span>
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 flex gap-2">
                          <span className="bg-primary-dark/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.1em]">
                            {prop.type || 'Hostel'}
                          </span>
                          <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-primary-dark uppercase tracking-[0.1em] shadow-sm">
                            Verified
                          </span>
                        </div>
                      </div>
                      <div className="p-10">
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <div className="min-w-0 flex-1">
                            <h2 className="text-2xl lg:text-3xl font-black text-primary-dark font-manrope tracking-tighter leading-tight mb-2 break-words">{prop.title}</h2>
                            <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <MapPin size={10} className="text-[#4F7C2C]" /> {prop.location}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-primary-dark font-black text-2xl lg:text-3xl tracking-tighter font-manrope">${prop.price}</span>
                            <p className="text-[9px] text-primary-dark/30 font-bold uppercase tracking-[0.2em] mt-1">Monthly</p>
                          </div>
                        </div>
                        
                        <p className="text-primary-dark/50 text-sm font-dm-sans line-clamp-2 mb-10 leading-relaxed font-bold">
                          {prop.description || "Premium student accommodation with modern amenities and high-speed fiber."}
                        </p>
                        
                        <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-primary-dark/30">
                              <Wifi size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Fiber</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary-dark/30">
                              <Zap size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Solar</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                            View Spot <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Explorer

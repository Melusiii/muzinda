import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'
import { 
  Wifi, 
  Zap, 
  ArrowRight, 
  Search, 
  Filter, 
  MapPin, 
  X, 
  Home, 
  Users, 
  Building2, 
  Heart,
  Droplets,
  Shield,
  Coffee,
  Wind,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useProperties, useFavorites } from '../hooks/useSupabase'
import { getImageUrl } from '../utils/supabase-helpers'
import { PageHeader } from '../components/PageHeader'

const AMENITY_LIST = [
  { id: 'wifi', label: 'Fiber Wifi', icon: Wifi },
  { id: 'solar', label: 'Solar Power', icon: Zap },
  { id: 'borehole', label: 'Borehole', icon: Droplets },
  { id: 'security', label: '24/7 Security', icon: Shield },
  { id: 'kitchen', label: 'Shared Kitchen', icon: Coffee },
  { id: 'ac', label: 'AC Ready', icon: Wind }
]

export const Explorer = () => {
  const [searchParams] = useSearchParams()
  const { properties, loading, error } = useProperties()
  const { toggleFavorite, isFavorited } = useFavorites()
  
  const [search, setSearch] = useState('')
  const [selectedGender, setSelectedGender] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [priceRange, setPriceRange] = useState(1200)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.location.toLowerCase().includes(search.toLowerCase())
    
    // Universal Gender Logic
    let matchesGender = true
    if (selectedGender === 'Boys Only') {
      matchesGender = p.gender_preference === 'Boys Only' || p.gender_preference === 'Mixed'
    } else if (selectedGender === 'Girls Only') {
      matchesGender = p.gender_preference === 'Girls Only' || p.gender_preference === 'Mixed'
    } else if (selectedGender === 'Mixed') {
      matchesGender = p.gender_preference === 'Mixed'
    }

    const matchesPrice = p.price <= priceRange
    const matchesType = selectedType === 'All' || p.type === selectedType

    // Amenities Logic
    const matchesAmenities = selectedAmenities.every(a => p.amenities?.includes(a))

    return matchesSearch && matchesGender && matchesPrice && matchesType && matchesAmenities
  })

  const propertyTypes = [
    { label: 'All', icon: Search },
    { label: 'Single', icon: Home },
    { label: 'Shared', icon: Users },
    { label: 'Apartment', icon: Building2 },
    { label: 'Hostel', icon: Building2 },
  ]

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Navbar />
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-8 md:p-8 min-h-screen relative">
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left) */}
          <section className="lg:col-span-8 space-y-12">
            <PageHeader 
              title="Find your Spot" 
              subtitle={`${filtered.length} verified results across Mutare`}
            >
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm self-start md:self-auto">
                <Filter size={14} className="text-primary/40" />
                <span className="text-[10px] font-black text-primary-dark/40 uppercase tracking-widest">Sort:</span>
                <select className="bg-transparent border-none text-xs font-black text-primary focus:ring-0 cursor-pointer p-0 pr-8 outline-none">
                  <option>Distance</option>
                  <option>Price (Low)</option>
                  <option>Price (High)</option>
                </select>
              </div>
            </PageHeader>

            {/* Quick Type Selection */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
               {propertyTypes.map((type) => (
                 <button
                  key={type.label}
                  onClick={() => setSelectedType(type.label)}
                  className={cn(
                    "px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap shadow-sm border",
                    selectedType === type.label 
                      ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                      : "bg-white text-primary-dark/40 border-primary/5 hover:border-primary/20"
                  )}
                 >
                   <type.icon size={16} />
                   {type.label}
                 </button>
               ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-white border border-primary/5 animate-pulse rounded-[2rem]" />
                ))
              ) : error ? (
                <div className="col-span-full py-20 text-center">
                    <p className="text-red-500 font-bold">Unable to sync property data. Please try again.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full py-32 text-center space-y-4">
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-primary/10 shadow-sm border border-primary/5">
                      <Search size={40} />
                    </div>
                    <h3 className="text-2xl font-manrope font-black text-primary-dark">Zero matches found</h3>
                    <p className="text-primary-dark/40 font-dm-sans max-w-xs mx-auto text-sm">Try removing filters or expanding your budget.</p>
                    <button onClick={() => {setSearch(''); setSelectedGender('All'); setSelectedType('All'); setPriceRange(1200); setSelectedAmenities([]);}} className="text-primary font-black uppercase tracking-widest text-[10px] mt-4 hover:underline">Clear all filters</button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((prop, idx) => (
                    <motion.div
                      key={prop.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-white rounded-[2rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left"
                    >
                      <Link to={`/property/${prop.id}`}>
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={getImageUrl(prop.image_url)} 
                            alt={prop.title} 
                            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                            }}
                          />
                          <div className="absolute top-6 right-6 z-10">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(prop.id);
                              }}
                              className={cn(
                                "w-10 h-10 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300",
                                isFavorited(prop.id) ? "bg-red-500 text-white border-red-400" : "bg-white/20 text-white hover:bg-white/40"
                              )}
                            >
                              <Heart size={18} className={isFavorited(prop.id) ? "fill-current" : ""} />
                            </button>
                          </div>
                          <div className="absolute top-6 left-6">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                              <CheckCircle2 size={14} className="text-primary" />
                              <span className="text-[11px] font-black text-primary-dark">{prop.rating || '4.8'}</span>
                            </div>
                          </div>
                          <div className="absolute bottom-6 left-6 flex gap-2">
                            <span className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.1em]">
                              {prop.type}
                            </span>
                            <span className={cn(
                               "bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-sm",
                               prop.gender_preference === 'Boys Only' ? "text-blue-500" : prop.gender_preference === 'Girls Only' ? "text-pink-500" : "text-primary-dark"
                            )}>
                              {prop.gender_preference || 'Mixed'}
                            </span>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-4 gap-4">
                            <div className="min-w-0 flex-1">
                              <h2 className="text-xl font-black text-primary-dark font-manrope tracking-tighter leading-tight mb-2 truncate">{prop.title}</h2>
                              <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                <MapPin size={10} className="text-primary" /> {prop.location}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-primary-dark font-black text-xl tracking-tighter font-manrope">${prop.price}</span>
                              <p className="text-[9px] text-primary-dark/30 font-bold uppercase tracking-[0.2em] mt-1 leading-none">/mo</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                            <div className="flex gap-4">
                               {prop.amenities?.slice(0, 2).map((aId: string) => {
                                  const amenity = AMENITY_LIST.find(al => al.id === aId);
                                  if (!amenity) return null;
                                  return (
                                    <div key={aId} className="flex items-center gap-2 text-primary-dark/30">
                                      <amenity.icon size={14} />
                                      <span className="text-[9px] font-black uppercase tracking-widest">{amenity.label.split(' ')[0]}</span>
                                    </div>
                                  )
                               })}
                            </div>
                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                              View <ArrowRight size={16} />
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

          {/* Sidebar Filters (Right) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] p-10 space-y-12 border border-primary/5 shadow-sm sticky top-32 overflow-y-auto max-h-[80vh] scrollbar-hide pb-12">
              <div className="space-y-6">
                <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Search for Houses</h3>
                <div className="relative">
                    <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Neighborhood or house..."
                      className="w-full pl-16 pr-6 py-5 bg-surface-bright rounded-[1rem] border border-primary/5 outline-none text-sm font-dm-sans focus:border-primary/20 transition-all font-bold"
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-dark/20 hover:text-primary">
                        <X size={16} />
                      </button>
                    )}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Living Preference</h3>
                <div className="flex flex-col gap-4">
                  {['Girls Only', 'Boys Only', 'Mixed', 'All'].map((gender) => (
                    <button 
                      key={gender} 
                      onClick={() => setSelectedGender(gender)}
                      className="flex items-center gap-4 group text-left"
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center",
                        selectedGender === gender ? "border-primary bg-primary" : "border-primary/10 bg-white group-hover:border-primary/30"
                      )}>
                        {selectedGender === gender && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={cn(
                        "text-sm font-bold transition-colors",
                        selectedGender === gender ? "text-primary-dark" : "text-primary-dark/40 group-hover:text-primary-dark"
                      )}>{gender}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                 <div className="flex justify-between items-end">
                  <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Budget Limit</h3>
                  <span className="text-primary font-black text-2xl font-manrope tracking-tighter">${priceRange}</span>
                 </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1200" 
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-surface-bright rounded-lg appearance-none cursor-pointer accent-primary" 
                />
                <div className="flex justify-between text-[10px] text-primary-dark/30 font-black uppercase tracking-widest leading-none">
                  <span>$50</span>
                  <span>$1200+</span>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Key Amenities</h3>
                <div className="grid grid-cols-1 gap-4">
                   {AMENITY_LIST.map(amenity => (
                     <button 
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className="flex items-center gap-4 group"
                     >
                        <div className={cn(
                          "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                          selectedAmenities.includes(amenity.id) ? "border-primary bg-primary" : "border-primary/10 group-hover:border-primary/30"
                        )}>
                           {selectedAmenities.includes(amenity.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div className="flex items-center gap-2">
                           <amenity.icon size={14} className={cn(
                             selectedAmenities.includes(amenity.id) ? "text-primary" : "text-primary-dark/20"
                           )} />
                           <span className={cn(
                             "text-xs font-bold transition-colors",
                             selectedAmenities.includes(amenity.id) ? "text-primary-dark" : "text-primary-dark/40 group-hover:text-primary-dark"
                           )}>
                             {amenity.label}
                           </span>
                        </div>
                     </button>
                   ))}
                </div>
              </div>

              <div className="pt-8 border-t border-primary/5">
                <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 border-dashed text-center">
                  <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-2 leading-none">Notice</p>
                  <p className="text-xs text-primary-dark/60 font-dm-sans leading-relaxed">All properties listed are manually verified by Muzinda Concierge teams.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Explorer


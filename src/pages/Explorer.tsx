import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
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
  CheckCircle2,
  Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useProperties, useFavorites } from '../hooks/supabase/useProperties'
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
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState('All')

  const UNIVERSITIES = [
    { id: 'All', label: 'All areas' },
    { id: 'UZ', label: 'Near UZ' },
    { id: 'MSU', label: 'Near MSU' },
    { id: 'NUST', label: 'Near NUST' },
    { id: 'CUT', label: 'Near CUT' },
    { id: 'HIT', label: 'Near HIT' },
  ]

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
    const matchesAmenities = (selectedAmenities || []).every(a => (p.amenities || []).includes(a))

    const matchesUniversity = selectedUniversity === 'All' || 
                             (p.nearby_university || '').toLowerCase() === (selectedUniversity || '').toLowerCase()

    return matchesSearch && matchesGender && matchesPrice && matchesType && matchesAmenities && matchesUniversity
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

  const filterPanelContent = (
    <>
      {/* Search */}
      <div className="space-y-4">
        <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Search</h3>
        <div className="relative">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-dark/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Neighbourhood or house..."
            className="w-full pl-14 pr-5 py-4 bg-surface-bright rounded-[1rem] border border-primary/5 outline-none text-sm font-dm-sans focus:border-primary/20 transition-all font-bold"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-primary-dark/20">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Near campus */}
      <div className="space-y-4">
        <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Near campus</h3>
        <div className="flex flex-wrap gap-2">
          {UNIVERSITIES.map((uni) => (
            <button
              key={uni.id}
              onClick={() => setSelectedUniversity(uni.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                selectedUniversity === uni.id
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-bright text-primary-dark/50 border-primary/5 hover:border-primary/20"
              )}
            >
              {uni.label}
            </button>
          ))}
        </div>
      </div>

      {/* Living Preference */}
      <div className="space-y-4">
        <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Living Preference</h3>
        <div className="grid grid-cols-2 gap-3">
          {['All', 'Girls Only', 'Boys Only', 'Mixed'].map((gender) => (
            <button
              key={gender}
              onClick={() => setSelectedGender(gender)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-bold border transition-all text-left",
                selectedGender === gender
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-bright text-primary-dark/50 border-primary/5 shadow-sm"
              )}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Budget Limit</h3>
          <div className="text-right">
             <span className="text-primary font-black text-xl font-manrope">${priceRange}</span>
             <p className="text-[10px] text-primary-dark/30 font-bold">All prices in USD.</p>
          </div>
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
        <div className="flex justify-between text-[10px] text-primary-dark/30 font-black uppercase tracking-widest">
          <span>$50</span><span>$1200+</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Key Amenities</h3>
        <div className="grid grid-cols-2 gap-3">
          {AMENITY_LIST.map(amenity => (
            <button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all",
                selectedAmenities.includes(amenity.id)
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-bright border-primary/5 text-primary-dark/40"
              )}
            >
              <amenity.icon size={14} />
              {amenity.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div className="flex bg-surface-bright min-h-screen font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-32 md:pt-32 md:p-8 min-h-screen relative pb-safe md:pb-8">
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Left) */}
          <section className="lg:col-span-8 space-y-12">
            <PageHeader 
              title="Search for Houses" 
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

            {/* Mobile filter trigger */}
            <div className="lg:hidden sticky top-[90px] z-20 -mx-6 px-6 py-3 bg-surface-bright/90 backdrop-blur-md border-b border-primary/5 flex gap-3 mb-6 overflow-hidden">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-primary/5 shadow-sm font-black text-[10px] text-primary-dark/60 uppercase tracking-widest"
              >
                <Filter size={14} className="text-primary" />
                Filters
                {(selectedAmenities.length > 0 || selectedGender !== 'All' || selectedType !== 'All' || selectedUniversity !== 'All') && (
                  <span className="w-5 h-5 bg-primary text-white rounded-full text-[10px] flex items-center justify-center font-black">
                    {selectedAmenities.length + (selectedGender !== 'All' ? 1 : 0) + (selectedType !== 'All' ? 1 : 0) + (selectedUniversity !== 'All' ? 1 : 0)}
                  </span>
                )}
              </button>
              <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
                {propertyTypes.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => setSelectedType(type.label)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap border transition-all flex-shrink-0",
                      selectedType === type.label
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-primary-dark/40 border-primary/5"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Quick Type Selection (hidden on mobile) */}
            <div className="hidden lg:flex gap-3 overflow-x-auto pb-4 no-scrollbar">
               {propertyTypes.map((type) => (
                 <button
                  key={type.label}
                  onClick={() => setSelectedType(type.label)}
                  className={cn(
                    "px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap shadow-sm border",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="h-44 md:h-64 bg-white border border-primary/5 animate-pulse rounded-[2rem]" />
                    <div className="space-y-3 px-4">
                      <div className="h-4 w-3/4 bg-white border border-primary/5 animate-pulse rounded-lg" />
                      <div className="h-3 w-1/2 bg-white border border-primary/5 animate-pulse rounded-lg" />
                    </div>
                  </div>
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
                      key={prop.id || `prop-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      className="group bg-white rounded-[1.5rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left"
                    >
                       <Link to={`/property/${prop.id}`}>
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={getImageUrl(prop.image_url)} 
                            alt={prop.title} 
                            className={cn(
                              "w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110",
                              prop.available_rooms === 0 && "grayscale contrast-125 opacity-50"
                            )}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
                            }}
                          />
                          {prop.available_rooms === 0 && (
                            <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                               <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/20">
                                  <Lock size={16} className="text-primary-dark/40" />
                                  <span className="text-[11px] font-black text-primary-dark uppercase tracking-widest">Fully Occupied</span>
                               </div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                              {prop.rating ? (
                                <>
                                  <CheckCircle2 size={12} className="text-primary" />
                                  <span className="text-[11px] font-black text-primary-dark">{prop.rating}</span>
                                </>
                              ) : (
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">New House</span>
                              )}
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 flex gap-2">
                            <span className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.1em]">
                              {prop.type}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 md:p-6">
                          <div className="flex justify-between items-start mb-3 gap-4">
                            <div className="min-w-0 flex-1">
                              <h2 className="text-md md:text-lg font-extrabold text-primary-dark font-manrope tracking-tighter leading-tight truncate">{prop.title || prop.name || 'Untitled House'}</h2>
                              <p className="text-[11px] text-primary-dark/40 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none mt-2">
                                <MapPin size={10} className="text-primary" strokeWidth={3} /> {prop.location || 'Mutare, ZW'}
                              </p>
                            </div>
                            <div className="shrink-0 pt-1 text-right">
                              <span className="text-primary-dark font-extrabold text-md md:text-lg tracking-tighter font-manrope italic">${prop.price}</span>
                              <p className="text-[11px] text-primary-dark/30 font-bold uppercase tracking-[0.2em] leading-none">USD</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-5 border-t border-primary/5 mt-2">
                            <div className="flex gap-4">
                               {prop.amenities?.slice(0, 2).map((aId: string) => {
                                  const amenity = AMENITY_LIST.find(al => al.id === aId);
                                  if (!amenity) return null;
                                  const Icon = amenity.icon;
                                  return (
                                    <div key={aId} className="flex items-center gap-2 text-primary-dark/30">
                                      <Icon size={12} />
                                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{amenity.label.split(' ')[0]}</span>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(prop.id);
                                }}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all group/like",
                                  isFavorited(prop.id) 
                                    ? "bg-red-50 text-white shadow-lg shadow-red-500/20" 
                                    : "bg-primary/5 text-primary hover:bg-primary/10"
                                )}
                              >
                                 <Heart 
                                  size={13} 
                                  className={cn(
                                    "transition-transform",
                                    isFavorited(prop.id) ? "fill-current scale-110" : "group-hover/like:scale-125"
                                  )} 
                                 />
                                 <span className="text-[10px] font-black tracking-widest">{prop.likes_count || 0}</span>
                              </button>
                              <div className="hidden md:flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                                View <ArrowRight size={16} />
                              </div>
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

          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[1.5rem] p-8 space-y-10 border border-primary/5 shadow-sm sticky top-32 overflow-y-auto max-h-[80vh] scrollbar-hide pb-12">
              {filterPanelContent}
              <div className="pt-8 border-t border-primary/5">
                <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 border-dashed text-center">
                  <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-2 leading-none">Notice</p>
                  <p className="text-xs text-primary-dark/60 font-dm-sans leading-relaxed">All properties listed are manually verified by Muzinda Concierge teams.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter bottom sheet */}
          <AnimatePresence>
            {showFilters && (
              <div className="fixed inset-0 z-[60] lg:hidden">
                {/* backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
                />
                {/* sheet */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] max-h-[85vh] overflow-y-auto pb-10 shadow-2xl"
                >
                  {/* drag handle */}
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-primary/10 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center px-10 pb-6">
                    <h3 className="font-manrope font-black text-primary-dark text-xl italic tracking-tighter">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-11 h-11 rounded-full bg-surface-bright flex items-center justify-center text-primary-dark/40 border border-primary/5"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="px-10 space-y-10">
                    {filterPanelContent}
                  </div>
                  <div className="px-10 pt-10">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-manrope font-black text-sm shadow-xl shadow-primary/20"
                    >
                      Show {filtered.length} Results
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default Explorer

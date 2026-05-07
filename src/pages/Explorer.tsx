import { useState, useEffect } from 'react'
import { 
  Wifi, 
  Zap, 
  Search, 
  X, 
  Droplets,
  Shield,
  Coffee,
  Wind,
  SlidersHorizontal,
  ChevronDown,
  Map as MapIcon
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { useProperties } from '../hooks/supabase/useProperties'
import { useFavorites } from '../hooks/supabase/useFavorites'

// Components
import { PropertyCard } from '../components/PropertyCard'
import { ExplorerMap } from '../components/ExplorerMap'
import { PropertyCardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Layout } from '../components/Layout'

const AMENITY_LIST = [
  { id: 'wifi', label: 'Fiber Wifi', icon: Wifi },
  { id: 'solar', label: 'Solar Power', icon: Zap },
  { id: 'borehole', label: 'Borehole', icon: Droplets },
  { id: 'security', label: '24/7 Security', icon: Shield },
  { id: 'kitchen', label: 'Shared Kitchen', icon: Coffee },
  { id: 'ac', label: 'AC Ready', icon: Wind }
]

const UNIVERSITIES = [
  { id: 'All', label: 'All areas' },
  { id: 'AU', label: 'Near Africa Univ' },
  { id: 'Poly', label: 'Near Mutare Poly' },
  { id: 'MSU', label: 'Near MSU' },
]

export const Explorer = () => {
  const [searchParams] = useSearchParams()
  const { properties, loading, error } = useProperties()
  const { toggleFavorite, isFavorited } = useFavorites()
  
  const [search, setSearch] = useState(() => searchParams.get('q') || '')
  const [selectedGender, setSelectedGender] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [priceRange, setPriceRange] = useState(1200)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState('All')
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null)
  const [showMobileMap, setShowMobileMap] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    const type = searchParams.get('type')
    
    if (q !== null && q !== search) setSearch(q)
    if (type !== null && type !== selectedType) setSelectedType(type.charAt(0).toUpperCase() + type.slice(1))
  }, [searchParams])

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.location.toLowerCase().includes(search.toLowerCase())
    
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
    const matchesAmenities = (selectedAmenities || []).every(a => (p.amenities || []).includes(a))
    const matchesUniversity = selectedUniversity === 'All' || 
                             (p.nearby_university || '').toLowerCase().includes((selectedUniversity || '').toLowerCase())

    return matchesSearch && matchesGender && matchesPrice && matchesType && matchesAmenities && matchesUniversity
  })

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const filterPanelContent = (
    <div className="space-y-10">
      {/* Budget */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Budget Limit</h3>
          <div className="text-right">
             <span className="text-primary font-black text-xl font-manrope">${priceRange}</span>
          </div>
        </div>
        <input
          type="range"
          min="50"
          max="1200"
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[9px] text-primary-dark/30 font-black uppercase tracking-widest">
          <span>$50</span><span>$1200+</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Must-Have Amenities</h3>
        <div className="grid grid-cols-2 gap-2">
          {AMENITY_LIST.map(amenity => (
            <button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border text-[11px] font-bold transition-all",
                selectedAmenities.includes(amenity.id)
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white border-primary/5 text-primary-dark/40 hover:border-primary/20"
              )}
            >
              <amenity.icon size={14} />
              {amenity.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-80px)] mt-20 flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* Top Navigation & Quick Filters */}
      <header className="flex-shrink-0 pt-28 pb-6 px-6 md:px-10 border-b border-primary/5 bg-white/80 backdrop-blur-xl z-40">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 max-w-xl">
             <div className="relative group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-dark/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by neighborhood or house name..."
                  className="w-full pl-14 pr-5 py-4 bg-primary/5 rounded-[1.25rem] border border-transparent outline-none text-sm font-bold text-primary-dark focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                />
             </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
             {/* Quick Type Toggles */}
             <div className="flex bg-primary/5 p-1 rounded-2xl border border-primary/10">
                {['All', 'Hostel', 'Apartment', 'Shared'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      selectedType === type 
                        ? "bg-white text-primary shadow-md" 
                        : "text-primary-dark/40 hover:text-primary-dark"
                    )}
                  >
                    {type}
                  </button>
                ))}
             </div>

             <div className="h-8 w-[1px] bg-primary/10 hidden md:block" />

             {/* More Filters Toggle */}
             <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-3 px-6 py-3 bg-primary-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-primary-dark/20 shrink-0"
             >
                <SlidersHorizontal size={14} />
                Filters
                {(selectedAmenities.length > 0 || selectedUniversity !== 'All' || selectedGender !== 'All') && (
                  <span className="w-5 h-5 bg-white text-primary-dark rounded-full flex items-center justify-center">
                    {selectedAmenities.length + (selectedUniversity !== 'All' ? 1 : 0) + (selectedGender !== 'All' ? 1 : 0)}
                  </span>
                )}
             </button>
          </div>
        </div>
      </header>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Results Pane */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-32">
          <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10">
            <div className="flex items-end justify-between">
              <div>
                 <h2 className="text-3xl md:text-4xl font-manrope font-black text-primary-dark tracking-tighter">
                   Housing in <span className="text-primary/30 italic">Mutare</span>
                 </h2>
                 <p className="text-primary-dark/40 font-bold text-sm mt-2">{filtered.length} verified listings found</p>
              </div>
              
              <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/5">
                <span className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest">Sort:</span>
                <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                  Popularity <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="py-20 text-center glass rounded-[2.5rem] border border-red-500/10">
                 <p className="text-red-500 font-black uppercase tracking-widest text-xs">Error Loading Houses</p>
                 <p className="text-primary-dark/40 font-bold mt-2 text-sm">Our team is stabilizing the connection. Please try refreshing.</p>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState 
                icon={<Search size={32} className="text-primary/20" />}
                title="Zero matches found" 
                description="Try broadening your search or removing some filters."
                action={{
                  label: "Reset Search",
                  onClick: () => {
                    setSearch(''); 
                    setSelectedGender('All'); 
                    setSelectedType('All'); 
                    setPriceRange(1200); 
                    setSelectedAmenities([]);
                    setSelectedUniversity('All');
                  }
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filtered.map((prop) => (
                    <div 
                      key={prop.id}
                      id={`prop-${prop.id}`}
                      onMouseEnter={() => setHoveredPropertyId(prop.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                    >
                      <PropertyCard 
                        property={prop} 
                        isFavorited={isFavorited(prop.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Map Pane (Desktop Only) */}
        <div className="hidden lg:block w-[450px] xl:w-[600px] border-l border-primary/5 relative">
           <div className="absolute inset-4">
              <ExplorerMap 
                properties={filtered} 
                activeId={hoveredPropertyId} 
                onPinClick={(id) => {
                  const el = document.getElementById(`prop-${id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setHoveredPropertyId(id);
                }}
              />
           </div>
        </div>

        {/* Mobile Map Drawer Overlay */}
        <AnimatePresence>
          {showMobileMap && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileMap(false)}
                className="lg:hidden fixed inset-0 bg-primary-dark/20 backdrop-blur-sm z-[150]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[3rem] shadow-2xl z-[160] overflow-hidden flex flex-col"
              >
                {/* Drag Handle */}
                <div className="w-full flex justify-center py-4 border-b border-primary/5">
                   <div className="w-12 h-1.5 bg-primary/10 rounded-full" />
                </div>
                
                <div className="flex-1 relative">
                  <ExplorerMap 
                    properties={filtered} 
                    activeId={hoveredPropertyId} 
                    onPinClick={(id) => {
                      const el = document.getElementById(`prop-${id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setHoveredPropertyId(id);
                      setShowMobileMap(false); // Close map on selection
                    }}
                  />
                  
                  {/* Mobile Map Close Button */}
                  <button 
                    onClick={() => setShowMobileMap(false)}
                    className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-primary-dark z-[1000]"
                  >
                    <X size={20} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile FABs */}
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
            <button 
              onClick={() => setShowMobileMap(true)}
              className="bg-primary-dark text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-white/10 active:scale-95 transition-all"
            >
              <MapIcon size={16} /> Map
            </button>
            <button 
              onClick={() => setShowFilters(true)}
              className="bg-white text-primary-dark px-8 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-primary/5 active:scale-95 transition-all"
            >
              <SlidersHorizontal size={16} />
            </button>
        </div>
      </div>

      {/* Filter Slide-over / Bottom Sheet */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-primary/5">
                <h2 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary-dark hover:bg-primary/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar pb-32">
                 <div className="space-y-12">
                    {/* Near Campus */}
                    <div className="space-y-4">
                      <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Location Hub</h3>
                      <div className="flex flex-wrap gap-2">
                        {UNIVERSITIES.map((uni) => (
                          <button
                            key={uni.id}
                            onClick={() => setSelectedUniversity(uni.id)}
                            className={cn(
                              "px-5 py-3 rounded-xl text-xs font-bold border transition-all",
                              selectedUniversity === uni.id
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-white text-primary-dark/50 border-primary/5 hover:border-primary/20"
                            )}
                          >
                            {uni.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender Preference */}
                    <div className="space-y-4">
                      <h3 className="text-primary-dark font-manrope font-black text-[10px] uppercase tracking-[0.3em]">Living Preference</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['All', 'Girls Only', 'Boys Only', 'Mixed'].map((gender) => (
                          <button
                            key={gender}
                            onClick={() => setSelectedGender(gender)}
                            className={cn(
                              "px-4 py-4 rounded-2xl text-xs font-black border transition-all text-center uppercase tracking-widest",
                              selectedGender === gender
                                ? "bg-primary text-white border-primary shadow-lg"
                                : "bg-white text-primary-dark/40 border-primary/5"
                            )}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filterPanelContent}
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-white border-t border-primary/5">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-manrope font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Show {filtered.length} Listings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </Layout>
  )
}

export default Explorer

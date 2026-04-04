import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Hero = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/explorer?q=${encodeURIComponent(query)}`)
    } else {
      navigate('/explorer')
    }
  }

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <h1 className="font-manrope text-6xl md:text-[5.5rem] font-extrabold tracking-tight text-primary-dark leading-[1.05]">
              Secure. Verified. <br />
              <span className="text-[#4F7C2C]">Student Living.</span>
            </h1>
            <p className="text-primary-dark/60 text-lg md:text-xl max-w-xl leading-relaxed font-dm-sans text-balance">
              The premium concierge for discerning students. Find trusted housing and essential services with editorial clarity and guaranteed safety.
            </p>
          </div>

          {/* Unified Pill Search Bar */}
          <div className="relative max-w-2xl group">
             <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative flex items-center bg-white rounded-2xl md:rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-primary/5">
                <div className="flex-1 flex items-center px-6 gap-4">
                   <Search className="text-primary-dark/20" size={24} />
                   <input 
                     type="text" 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                     placeholder="Search by area or hostel name..."
                     className="w-full py-4 bg-transparent border-none focus:ring-0 text-primary-dark text-lg placeholder:text-primary-dark/30 font-dm-sans outline-none"
                   />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-[#1E3011] hover:bg-black text-white px-10 py-4 rounded-xl md:rounded-full font-bold font-manrope transition-all active:scale-95 text-lg"
                >
                  Search
                </button>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Image Container */}
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop" 
              alt="Muzinda Student Housing" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
            />
          </div>

          {/* Floating Badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-primary/5"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
              <div className="w-7 h-7 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <div className="w-2 h-2 bg-white rounded-full translate-y-[2px]" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary-dark/40 mb-1">Muzinda Premium</p>
              <p className="font-manrope font-extrabold text-primary-dark text-lg leading-none">100% Certified</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


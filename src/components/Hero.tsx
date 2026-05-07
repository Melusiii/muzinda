import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Search, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export const Hero = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -50])
  const y2 = useTransform(scrollY, [0, 500], [0, 50])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/explorer?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 px-5 md:px-6 overflow-hidden bg-white">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-primary/5 rounded-l-[10rem] -mr-20 hidden lg:block -z-0" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-[60px] lg:hidden -z-0" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-gold/5 rounded-full blur-[100px] -ml-32 -z-0" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

        {/* Text + CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 md:space-y-10"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified Student Hub</span>
            </div>

            <h1 className="font-manrope text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-primary-dark leading-[0.95] md:leading-[0.9]">
              Find your room<br />
              <span className="text-primary italic">near campus.</span>
            </h1>

            <p className="text-primary-dark/50 text-base md:text-xl max-w-xl leading-relaxed font-dm-sans font-medium">
              Mutare's #1 student housing platform. Join 1,200+ students finding inspected stays with Muzinda.
            </p>
          </div>

          {/* Minimalist Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="relative max-w-lg group"
          >
            <div className="relative bg-white border border-primary/10 p-2 rounded-[2rem] shadow-2xl shadow-primary/10 flex items-center gap-2 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
              <div className="pl-4 text-primary-dark/20">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search neighborhood..."
                className="flex-1 bg-transparent border-none outline-none font-dm-sans font-bold text-sm py-4"
              />
              <button 
                type="submit"
                className="bg-primary text-white w-14 h-14 md:w-auto md:px-8 rounded-[1.5rem] font-black text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <span className="hidden md:inline uppercase tracking-widest">Search</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          {/* Mobile Category Pills - App Style */}
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar lg:hidden -mx-5 px-5">
            {[
              { label: 'Hostels', path: '/explorer?type=hostel' },
              { label: 'Apartments', path: '/explorer?type=apartment' },
              { label: 'Shared', path: '/explorer?type=shared' },
              { label: 'Cottages', path: '/explorer?type=cottage' },
            ].map((cat) => (
              <Link 
                key={cat.label}
                to={cat.path}
                className="whitespace-nowrap px-6 py-3.5 bg-primary-dark/5 border border-primary-dark/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-dark/70 hover:bg-primary/10 hover:text-primary transition-all"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hero Image - NEW */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:hidden w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
              alt="Muzinda Student Housing"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-0">
            <Link
              to="/signup"
              className="bg-primary-dark text-white px-8 py-5 rounded-2xl font-black font-manrope text-sm uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:translate-y-[-2px] active:scale-95 transition-all text-center"
            >
              Get started — it's free
            </Link>
            <Link
              to="/auth"
              className="bg-white text-primary-dark border-2 border-primary/5 px-8 py-5 rounded-2xl font-black font-manrope text-sm uppercase tracking-widest hover:bg-primary/5 transition-all text-center"
            >
              Sign in
            </Link>
          </div>

          {/* University Trust Indicators */}
          <div className="pt-6 space-y-5">
            <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-[0.3em]">Trusted by Mutare Students</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
               <span className="font-manrope font-black text-lg tracking-tighter">AFRICA UNIVERSITY</span>
               <span className="font-manrope font-black text-lg tracking-tighter">MUTARE POLY</span>
               <span className="font-manrope font-black text-lg tracking-tighter">MSU</span>
            </div>
          </div>
        </motion.div>

        {/* Hero image — desktop only */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative hidden lg:block"
        >
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
              alt="Muzinda Student Housing"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Refined Floating badge */}
          <motion.div
            style={{ y: y2 }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="absolute -bottom-12 -left-12 bg-white p-8 rounded-[3rem] shadow-2xl flex items-center gap-5 border border-primary/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-dark/20 mb-1">Status</p>
              <p className="font-manrope font-black text-primary-dark text-2xl leading-none">Verified Hub</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, ShieldCheck, Star } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 px-5 md:px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Text + CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-xs font-black text-primary uppercase tracking-widest">Verified student housing</span>
            </div>

            <h1 className="font-manrope text-4xl sm:text-5xl md:text-[5rem] font-extrabold tracking-tight text-primary-dark leading-[1.05]">
              Find your room<br />
              <span className="text-[#4F7C2C]">near campus.</span>
            </h1>

            <p className="text-primary-dark/60 text-base md:text-xl max-w-xl leading-relaxed font-dm-sans">
              Browse inspected rooms and hostels in Mutare. Apply directly to landlords and move in with confidence.
            </p>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Verified listings', value: '120+' },
              { label: 'Students housed', value: '800+' },
              { label: 'Avg rating', value: '4.7★' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-manrope font-black text-primary-dark">{stat.value}</p>
                <p className="text-[11px] font-bold text-primary-dark/40 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="bg-[#1E3011] text-white px-8 py-4 rounded-2xl font-bold font-manrope text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              Get started — it's free
            </Link>
            <Link
              to="/auth"
              className="bg-white text-primary-dark border border-primary/10 px-8 py-4 rounded-2xl font-bold font-manrope text-base hover:bg-surface-bright transition-all text-center"
            >
              Sign in
            </Link>
          </div>

          {/* Location pill */}
          <p className="flex items-center gap-2 text-xs font-bold text-primary-dark/40">
            <MapPin size={12} className="text-primary" />
            Currently serving Mutare — expanding soon
          </p>
        </motion.div>

        {/* Hero image — desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative hidden lg:block"
        >
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
              alt="Muzinda Student Housing"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
            />
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-6 -left-6 bg-white p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-primary/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Star size={20} className="text-[#D4AF37] fill-[#D4AF37]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary-dark/40 mb-0.5">Muzinda</p>
              <p className="font-manrope font-extrabold text-primary-dark text-base leading-none">100% Verified</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

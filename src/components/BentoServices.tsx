import { Wrench, Bus, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'

export const BentoServices = () => {
  const { isAuthenticated } = useAuth()

  return (
    <section className="px-6 py-24 bg-[#F8F9F8] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
              <Zap size={14} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Muzinda Ecosystem</span>
           </div>
           <h2 className="font-manrope text-4xl md:text-6xl font-black text-primary-dark tracking-tighter">Beyond Just <span className="text-primary/20 italic">Four Walls</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Maintenance */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[3.5rem] flex flex-col justify-between border border-primary/5 group shadow-xl shadow-primary/5"
          >
            <div>
              <div className="w-16 h-16 bg-[#4F7C2C]/10 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                <Wrench className="text-[#4F7C2C]" size={28} />
              </div>
              <h3 className="font-manrope text-4xl font-black text-primary-dark mb-6 tracking-tight">On-Demand<br />Maintenance</h3>
              <p className="text-primary-dark/50 font-dm-sans text-lg mb-10 leading-relaxed max-w-xs italic">
                Broken tap? Electrical issues? Our verified handymen are just a tap away with flat-rate student pricing.
              </p>
            </div>
            <Link 
              to={isAuthenticated ? "/dashboard" : "/auth"} 
              className="bg-primary-dark text-white px-10 py-5 rounded-[1.5rem] font-bold font-manrope self-start hover:bg-primary transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group-hover:gap-4"
            >
              Book a Repair <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Transport */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary-dark p-12 rounded-[3.5rem] text-white flex flex-col justify-between group shadow-2xl shadow-primary-dark/20"
          >
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                <Bus className="text-white" size={28} />
              </div>
              <h3 className="font-manrope text-4xl font-black mb-6 tracking-tight">Shuttle &<br />Transport</h3>
              <p className="text-white/40 font-dm-sans text-lg mb-10 leading-relaxed max-w-xs italic">
                Reliable commutes to campus. Safety-tracked rides for night studies and weekend supply runs.
              </p>
            </div>
            <Link 
              to={isAuthenticated ? "/transport" : "/auth"} 
              className="bg-accent-amber text-white px-10 py-5 rounded-[1.5rem] font-bold font-manrope self-start hover:scale-105 transition-all shadow-xl shadow-accent-amber/20 flex items-center gap-2 group-hover:gap-4"
            >
              Request Ride <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Partner with Muzinda CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-16 rounded-[4rem] border border-primary/5 shadow-2xl shadow-primary/5 flex flex-col lg:flex-row items-center justify-between gap-16"
        >
          <div className="space-y-6 text-center lg:text-left flex-1">
             <div className="flex items-center gap-2 text-primary justify-center lg:justify-start">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Growth Opportunities</span>
             </div>
            <h3 className="font-manrope text-4xl md:text-5xl font-black text-primary-dark tracking-tighter">Partner with <span className="text-primary italic">Muzinda</span></h3>
            <p className="text-primary-dark/40 text-lg font-dm-sans leading-relaxed max-w-xl italic">
              Are you a landlord or service provider? List your property or service and reach thousands of students instantly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link to="/auth?role=landlord" className="bg-primary-dark text-white px-12 py-5 rounded-[1.5rem] font-bold font-manrope text-center shadow-2xl shadow-primary-dark/20 hover:scale-105 transition-all">
              List Property
            </Link>
            <Link to="/auth?role=provider" className="bg-[#EEEEEE] text-primary-dark px-12 py-5 rounded-[1.5rem] font-bold font-manrope text-center hover:bg-black hover:text-white transition-all">
              Join as Provider
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

import { Wrench, Bus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const BentoServices = () => {
  const { isAuthenticated } = useAuth()

  return (
    <section className="px-6 py-24 bg-[#F8F9F8]">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="font-manrope text-4xl font-extrabold text-primary-dark text-center">Beyond Just Four Walls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Maintenance */}
          <div className="bg-[#f0f2f0] p-12 rounded-[3.5rem] flex flex-col justify-between border border-primary/5 group">
            <div>
              <div className="w-14 h-14 bg-[#4F7C2C]/10 rounded-2xl flex items-center justify-center mb-8">
                <Wrench className="text-[#4F7C2C]" size={24} />
              </div>
              <h3 className="font-manrope text-4xl font-black text-primary-dark mb-4 tracking-tight">On-Demand Maintenance</h3>
              <p className="text-primary-dark/50 font-dm-sans text-lg mb-8 leading-relaxed max-w-sm">
                Broken tap? Electrical issues? Our verified handymen are just a tap away with flat-rate student pricing.
              </p>
            </div>
            <Link 
              to={isAuthenticated ? "/dashboard" : "/auth"} 
              className="bg-white text-primary-dark border border-primary/10 px-10 py-5 rounded-2xl font-bold font-manrope self-start hover:bg-primary-dark hover:text-white transition-all shadow-sm flex items-center gap-2"
            >
              Book a Repair <ArrowRight size={18} />
            </Link>
          </div>

          {/* Transport */}
          <div className="bg-[#1E3011] p-12 rounded-[3.5rem] text-white flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <Bus className="text-white" size={24} />
              </div>
              <h3 className="font-manrope text-4xl font-black mb-4 tracking-tight">Shuttle & Transport</h3>
              <p className="text-white/50 font-dm-sans text-lg mb-8 leading-relaxed max-w-sm">
                Reliable commutes to campus. Safety-tracked rides for night studies and weekend supply runs.
              </p>
            </div>
            <Link 
              to={isAuthenticated ? "/transport" : "/auth"} 
              className="bg-[#D4AF37] text-white px-10 py-5 rounded-2xl font-bold font-manrope self-start hover:scale-105 transition-transform shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
            >
              Request Ride <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Partner with Muzinda CTA */}
        <div className="bg-white p-12 rounded-[3.5rem] border border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center lg:text-left flex-1">
            <h3 className="font-manrope text-4xl font-black text-primary-dark tracking-tight italic">Partner with Muzinda</h3>
            <p className="text-primary-dark/50 text-lg font-dm-sans leading-relaxed">
              Are you a landlord or service provider? List your property or service and reach thousands of students instantly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link to="/auth" className="bg-[#1E3011] text-white px-12 py-5 rounded-2xl font-bold font-manrope text-center shadow-xl shadow-[#1E3011]/20 hover:scale-105 transition-transform">
              List Property
            </Link>
            <Link to="/auth" className="bg-[#EEEEEE] text-primary-dark px-12 py-5 rounded-2xl font-bold font-manrope text-center hover:bg-black hover:text-white transition-all">
              Join as Provider
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

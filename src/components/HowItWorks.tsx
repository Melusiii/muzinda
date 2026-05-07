import { motion } from 'framer-motion'
import { Search, ShieldCheck, Key, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse hundreds of verified rooms and hostels in Mutare's best student neighborhoods.",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    description: "Every listing is manually inspected. Review high-quality photos and 100% trust scores.",
    color: "bg-[#4F7C2C]/10 text-[#4F7C2C]"
  },
  {
    icon: Key,
    title: "Secure",
    description: "Apply instantly, pay through our secure portal, and get your keys without the stress.",
    color: "bg-amber-500/10 text-amber-600"
  }
]

export const HowItWorks = () => {
  return (
    <section className="py-32 px-6 bg-[#FBFBFB] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-24">
           <div className="inline-flex items-center gap-2 text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
              <span className="text-[10px] font-black uppercase tracking-widest">Simple Process</span>
           </div>
           <h2 className="font-manrope text-4xl md:text-6xl font-black text-primary-dark tracking-tighter">Your journey to a <span className="text-primary italic">perfect stay</span></h2>
           <p className="text-primary-dark/40 font-dm-sans text-lg max-w-xl mx-auto italic">Finding housing shouldn't be a full-time job. We've made it a breeze.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="relative group"
            >
              {/* Connector Line (Desktop) */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-12 left-[6rem] right-[-3rem] h-[1px] bg-gradient-to-r from-primary/20 via-primary/20 to-transparent z-0" />
              )}
              
              <div className="space-y-8 relative z-10 text-center md:text-left">
                <div className={`w-24 h-24 ${step.color} rounded-[2rem] flex items-center justify-center shadow-inner mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon size={40} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tight">
                    <span className="text-primary/20 mr-3">0{idx + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-primary-dark/50 font-dm-sans leading-relaxed text-lg italic">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 flex justify-center md:justify-start">
                   <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100">
                      Learn more <ArrowRight size={16} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

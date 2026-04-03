import { Layout } from '../components/Layout'
import { motion, AnimatePresence } from 'framer-motion'
import { School, Building, Briefcase, Wrench, Bus, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { useEffect } from 'react'

const Signup = () => {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord' | 'provider'>('student')
  const [selectedCategory, setSelectedCategory] = useState<'handyman' | 'transport' | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { signup, isAuthenticated, user, loading: authLoading } = useAuth()

  // Automated redirection once authenticated and profile is ready
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      const target = user.role === 'student' ? '/dashboard' : (user.role === 'landlord' ? '/landlord' : '/provider');
      console.log("Signup: Account ready, redirecting to", target);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log("Signup: Starting registration process");
      await signup(email, password, {
        name: name || email.split('@')[0],
        role: selectedRole,
        category: selectedCategory,
      })
      setLoading(false)
      // We don't navigate here anymore; the useEffect above handles it
    } catch (err: any) {
      console.error("Signup: error", err)
      setLoading(false)
      alert(err.message || "Failed to create account. Please check your details.")
    }
  }

  const roleOptions = [
    { id: 'student', title: "I'm a Student", icon: School, desc: "Search and secure AU housing.", theme: 'green' },
    { id: 'landlord', title: "I'm a Landlord", icon: Building, desc: "List and manage your properties.", theme: 'dark' },
    { id: 'provider', title: "Service Provider", icon: Briefcase, desc: "Offer maintenance or transport.", theme: 'dark' },
  ]

  const providerCategories = [
    { id: 'handyman', title: "Handyman", icon: Wrench, desc: "Maintenance & repairs." },
    { id: 'transport', title: "Transport", icon: Bus, desc: "Shuttle & logistics." },
  ]

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 min-h-screen bg-[#F8F9F8] flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Role Selection (Shared with Auth) */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-manrope font-black text-primary-dark mb-2 px-2">Join Muzinda</h2>
            <div className="grid gap-6 flex-1">
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  disabled={step > 1}
                  onClick={() => setSelectedRole(role.id as any)}
                  className={cn(
                    "relative p-8 rounded-[2.5rem] text-left transition-all duration-500 overflow-hidden group flex flex-col justify-between h-48",
                    selectedRole === role.id 
                      ? (role.id === 'student' ? "bg-[#1E3011] text-white shadow-2xl scale-[1.02]" : "bg-[#1E1E1E] text-white shadow-2xl scale-[1.02]")
                      : "bg-white text-primary-dark border border-primary/5 hover:border-primary/20",
                    step > 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                      selectedRole === role.id ? "bg-white/10" : "bg-primary/5"
                    )}>
                      <role.icon size={28} className={selectedRole === role.id ? "text-white" : "text-primary-dark/40"} />
                    </div>
                    {selectedRole === role.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-primary rounded-full p-1.5 shadow-lg">
                        <ShieldCheck size={18} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-manrope font-black mb-1">{role.title}</h3>
                    <p className={cn(
                      "text-sm font-dm-sans leading-tight",
                      selectedRole === role.id ? "text-white/60" : "text-primary-dark/40"
                    )}>{role.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Multi-step Signup Form */}
          <div className="bg-white rounded-[3.5rem] p-8 md:p-16 border border-primary/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#4F7C2C]">
                       <div className="w-8 h-[2px] bg-current opacity-20" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Step 01 / 02</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-manrope font-black text-primary-dark tracking-tighter">
                      Confirm your <br />
                      <span className="text-primary-dark/40">identity role</span>
                    </h1>
                  </div>

                  <p className="text-primary-dark/50 text-lg font-dm-sans leading-relaxed">
                    You've selected <span className="text-primary-dark font-black capitalize">{selectedRole}</span>. 
                    {selectedRole === 'student' ? " You will need a verified Africa University email to complete registration." : " You will need to provide business verification details later."}
                  </p>

                  <button
                    onClick={() => {
                      if (selectedRole === 'provider') setStep(2)
                      else setStep(3)
                    }}
                    className="w-full bg-[#1E3011] text-white py-6 rounded-2xl font-manrope font-black text-xl shadow-2xl shadow-[#1E3011]/20 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                  >
                    Continue Registration
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-center pt-8 border-t border-primary/5">
                     <p className="text-primary-dark/40 font-dm-sans">
                       Already a member? <Link to="/auth" className="text-[#4F7C2C] font-black hover:underline ml-1">Sign In</Link>
                     </p>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#4F7C2C]">
                       <button onClick={() => setStep(1)} className="text-primary-dark/40 hover:text-primary-dark transition-colors mr-2">
                          <ArrowRight size={20} className="rotate-180" />
                       </button>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Step 02 / 03</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-manrope font-black text-primary-dark tracking-tighter">
                      Service <br />
                      <span className="text-primary-dark/40">Specialization</span>
                    </h1>
                  </div>

                  <div className="grid gap-4">
                    {providerCategories.map((cat) => (
                       <button
                         key={cat.id}
                         onClick={() => {
                            setSelectedCategory(cat.id as any)
                            setStep(3)
                         }}
                         className="flex items-center gap-6 p-6 rounded-3xl border border-primary/5 hover:border-primary/20 hover:bg-[#F8F9F8] transition-all group"
                       >
                          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary-dark group-hover:scale-110 transition-transform">
                             <cat.icon size={28} />
                          </div>
                          <div className="text-left">
                             <h4 className="text-xl font-manrope font-black text-primary-dark">{cat.title}</h4>
                             <p className="text-sm font-dm-sans text-primary-dark/40">{cat.desc}</p>
                          </div>
                       </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                   <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#4F7C2C]">
                       <button onClick={() => setStep(selectedRole === 'provider' ? 2 : 1)} className="text-primary-dark/40 hover:text-primary-dark transition-colors mr-2">
                          <ArrowRight size={20} className="rotate-180" />
                       </button>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Final Step</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-manrope font-black text-primary-dark tracking-tighter">
                      Create your <br />
                      <span className="text-primary-dark/40">Credentials</span>
                    </h1>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" size={20} />
                        <input 
                          type="text" 
                          placeholder="Full Name" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-16 pr-8 py-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 outline-none font-dm-sans transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" size={20} />
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-16 pr-8 py-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 outline-none font-dm-sans transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" size={20} />
                        <input 
                          type="password" 
                          placeholder="Password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-16 pr-8 py-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 outline-none font-dm-sans transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1E3011] text-white py-6 rounded-2xl font-manrope font-black text-xl shadow-2xl shadow-[#1E3011]/20 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                    >
                      {loading ? "Creating Account..." : "Complete Registration"}
                      <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Signup

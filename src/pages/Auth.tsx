import { Layout } from '../components/Layout'
import { motion, AnimatePresence } from 'framer-motion'
import { School, Building, Briefcase, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { useEffect } from 'react'

export const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord' | 'provider'>('student')
  const [showPortal, setShowPortal] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user, loading: authLoading } = useAuth()

  // Automated redirection once authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      let from = (location.state as any)?.from?.pathname;
      
      if (!from || from === '/') {
        if (user.role === 'student') from = '/dashboard';
        else if (user.role === 'landlord') from = '/landlord';
        else if (user.role === 'provider') {
          from = user.category === 'transport' ? '/transport-hub' : '/provider';
        } else {
          from = '/dashboard';
        }
      }

      console.log("Auth: Authenticated, redirecting to", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log("Auth: Starting login process for", email);
      await login(email, password)
      // Note: We don't set loading(false) here because the global loading state (authLoading)
      // will take over until the profile is fetched. The useEffect below handles navigation.
    } catch (err: any) {
      console.error("Auth: Login error:", err)
      setLoading(false)
      alert(err.message || "Failed to sign in. Please check your credentials.")
    }
  }

  const roleOptions = [
    { id: 'student', title: "I'm a Student", icon: School, desc: "Search and secure Premium housing.", theme: 'green' },
    { id: 'landlord', title: "I'm a Landlord", icon: Building, desc: "List and manage your properties.", theme: 'dark' },
    { id: 'provider', title: "Service Provider", icon: Briefcase, desc: "Offer maintenance or transport.", theme: 'dark' },
  ]

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 min-h-screen bg-[#F8F9F8] flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Role Selection */}
          <div className={cn("flex flex-col gap-6", showPortal ? "hidden lg:flex" : "flex")}>
            <h2 className="text-2xl font-manrope font-extrabold text-primary-dark mb-1 px-2">Access Portal</h2>
            <div className="grid gap-6 flex-1">
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id as any)
                    setShowPortal(true)
                  }}
                  className={cn(
                    "relative p-6 rounded-[2rem] text-left transition-all duration-500 overflow-hidden group flex flex-col justify-between h-40",
                    selectedRole === role.id 
                      ? (role.id === 'student' ? "bg-[#1E3011] text-white shadow-2xl shadow-[#1E3011]/20 scale-[1.02]" : "bg-[#1E1E1E] text-white shadow-2xl scale-[1.02]")
                      : "bg-white text-primary-dark border border-primary/5 hover:border-primary/20 hover:bg-[#F0F2F0]"
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
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-manrope font-extrabold mb-0.5">{role.title}</h3>
                      <p className={cn(
                        "text-sm font-dm-sans leading-tight",
                        selectedRole === role.id ? "text-white/60" : "text-primary-dark/40"
                      )}>{role.desc}</p>
                    </div>
                    <div className="lg:hidden bg-white/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={20} className="text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Guest CTA for Signup visibility */}
            <div className="lg:hidden text-center py-4 bg-white/50 rounded-3xl border border-primary/5">
                <p className="text-primary-dark/40 text-xs font-dm-sans">
                  Don't have an account? <button onClick={() => navigate('/signup', { state: { role: selectedRole } })} className="text-[#4F7C2C] font-black underline ml-1">Join Muzinda</button>
                </p>
            </div>
          </div>

          {/* Right Column: Integrated Login Form */}
          <div className={cn(
            "bg-white rounded-[2.5rem] p-8 md:p-14 border border-primary/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col justify-center",
            !showPortal && "hidden lg:flex"
          )}>
            <AnimatePresence mode="wait">
              {!loading ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#4F7C2C]">
                       <div className="w-8 h-[2px] bg-current opacity-20" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Welcome Back</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-manrope font-extrabold text-primary-dark tracking-tighter">
                      Login to <br />
                      <span className="text-primary-dark/40 font-manrope">Muzinda Portal</span>
                    </h1>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" size={20} />
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-16 pr-8 py-3.5 rounded-xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none font-dm-sans transition-all"
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
                          className="w-full pl-16 pr-8 py-3.5 rounded-xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none font-dm-sans transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20" />
                          <span className="text-sm font-dm-sans text-primary-dark/50 group-hover:text-primary-dark transition-colors">Remember me</span>
                       </label>
                       <Link to="/auth" className="text-sm font-bold text-primary-dark/40 hover:text-primary transition-colors">Forgot Password?</Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1E3011] text-white py-4.5 rounded-xl font-manrope font-extrabold text-lg shadow-2xl shadow-[#1E3011]/20 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                    >
                      Log In
                      <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <div className="text-center pt-8 border-t border-primary/5 space-y-4">
                     <p className="text-primary-dark/40 font-dm-sans">
                       First time at Muzinda? <button onClick={() => navigate('/signup', { state: { role: selectedRole } })} className="text-[#4F7C2C] font-black hover:underline ml-1">Create Account</button>
                     </p>
                     <button 
                       onClick={() => setShowPortal(false)}
                       className="lg:hidden text-[10px] font-black uppercase tracking-widest text-primary-dark/20 hover:text-primary transition-colors"
                     >
                       Change Role
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-8"
                >
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-manrope font-black text-primary-dark">Authenticating...</h2>
                    <p className="text-primary-dark/40 font-dm-sans max-w-xs mx-auto">Verifying your credentials with premium security protocols.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Auth

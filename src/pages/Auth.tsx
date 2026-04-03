import { Layout } from '../components/Layout'
import { motion, AnimatePresence } from 'framer-motion'
import { School, Building, Briefcase, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { useEffect } from 'react'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord' | 'provider'>('student')
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user, loading: authLoading } = useAuth()

  // Automated redirection once authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      const from = (location.state as any)?.from?.pathname || 
                   (user.role === 'student' ? '/dashboard' : `/${user.role}`);
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
      setLoading(false)
      // We don't navigate here anymore; the useEffect above handles it
      // once the AuthContext updates with the user profile.
    } catch (err: any) {
      console.error("Auth: Login error:", err)
      setLoading(false)
      alert(err.message || "Failed to sign in. Please check your credentials.")
    }
  }

  const roleOptions = [
    { id: 'student', title: "I'm a Student", icon: School, desc: "Search and secure AU housing.", theme: 'green' },
    { id: 'landlord', title: "I'm a Landlord", icon: Building, desc: "List and manage your properties.", theme: 'dark' },
    { id: 'provider', title: "Service Provider", icon: Briefcase, desc: "Offer maintenance or transport.", theme: 'dark' },
  ]

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 min-h-screen bg-[#F8F9F8] flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Role Selection */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-manrope font-black text-primary-dark mb-2 px-2">Access Portal</h2>
            <div className="grid gap-6 flex-1">
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as any)}
                  className={cn(
                    "relative p-8 rounded-[2.5rem] text-left transition-all duration-500 overflow-hidden group flex flex-col justify-between h-48",
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

          {/* Right Column: Integrated Login Form */}
          <div className="bg-white rounded-[3.5rem] p-8 md:p-16 border border-primary/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col justify-center">
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
                    <h1 className="text-4xl md:text-5xl font-manrope font-black text-primary-dark tracking-tighter">
                      Login with <br />
                      <span className="text-primary-dark/40">Africa University</span>
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
                          className="w-full pl-16 pr-8 py-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none font-dm-sans transition-all"
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
                          className="w-full pl-16 pr-8 py-5 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none font-dm-sans transition-all"
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
                      className="w-full bg-[#1E3011] text-white py-6 rounded-2xl font-manrope font-black text-xl shadow-2xl shadow-[#1E3011]/20 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                    >
                      Log In
                      <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <div className="text-center pt-8 border-t border-primary/5">
                     <p className="text-primary-dark/40 font-dm-sans">
                       First time at Muzinda? <Link to="/signup" className="text-[#4F7C2C] font-black hover:underline ml-1">Create Account</Link>
                     </p>
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
                    <p className="text-primary-dark/40 font-dm-sans max-w-xs mx-auto">Verifying your credentials with Africa University security protocols.</p>
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

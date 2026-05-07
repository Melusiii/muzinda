import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is in a recovery session
        toast.info('You can now set a new password.')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      
      toast.success('Password updated successfully! Redirecting...')
      setTimeout(() => navigate('/explorer'), 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-6 font-dm-sans">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-primary/10 shadow-2xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-inner">
              <KeyRound size={32} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-primary-dark font-manrope tracking-tighter uppercase italic">Set New Password</h1>
              <p className="text-[10px] text-primary-dark/40 font-black uppercase tracking-[0.5em]">Secure Your Muzinda Portal</p>
            </div>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-6 rounded-[1.5rem] bg-[#F4F8F5] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-6 rounded-[1.5rem] bg-[#F4F8F5] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-6 rounded-2xl font-bold font-manrope shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Updating...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <button 
            onClick={() => navigate('/auth')}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-primary-dark/30 uppercase tracking-widest hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword

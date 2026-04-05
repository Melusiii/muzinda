import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ChevronLeft, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'
import { supabase } from '../lib/supabase'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user, logout } = useAuth()

  if (!isOpen || !user) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center md:justify-end">
        {/* Responsive Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-dark/60 backdrop-blur-xl cursor-pointer"
        />
        
        <motion.div 
          initial={{ y: "100%", x: 0 }}
          animate={{ y: 0, x: 0 }}
          exit={{ y: "100%", x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "relative bg-white shadow-2xl flex flex-col overflow-hidden",
            "h-[92vh] mt-auto w-full rounded-t-[3rem]",
            "md:h-full md:mt-0 md:max-w-md md:rounded-none"
          )}
        >
          {/* Mobile Handle */}
          <div className="md:hidden flex justify-center py-4 shrink-0">
            <div className="w-12 h-1.5 bg-primary-dark/5 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-8 pb-8 md:p-8 border-b border-primary/5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
               <button 
                 onClick={onClose} 
                 className="md:hidden p-2 -ml-2 text-primary hover:bg-primary/5 rounded-xl flex items-center gap-1 transition-all"
               >
                 <ChevronLeft size={20} />
                 <span className="text-xs font-bold font-manrope uppercase tracking-tight">Back</span>
               </button>
               <div>
                 <h2 className="text-xl md:text-2xl font-manrope font-extrabold text-primary-dark tracking-tight">Edit Profile</h2>
                 <p className="hidden md:block text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-1">Institutional Identity • {user.role}</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:flex p-3 hover:bg-white rounded-2xl transition-all text-primary-dark/20 hover:text-primary-dark shadow-sm border border-transparent hover:border-primary/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile Editor Content */}
          <div className="flex-1 p-8 md:p-10 overflow-y-auto">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img 
                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-[2rem] object-cover shadow-xl border-4 border-white transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                     <User size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !user) return;

                      try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                        const filePath = `${fileName}`;

                        const { error: uploadError } = await supabase.storage
                          .from('avatars')
                          .upload(filePath, file);

                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = supabase.storage
                          .from('avatars')
                          .getPublicUrl(filePath);

                        const { error: updateError } = await supabase
                          .from('profiles')
                          .update({ avatar_url: publicUrl })
                          .eq('id', user.id);

                        if (updateError) throw updateError;

                        alert("Profile photo updated! Refreshing...");
                        window.location.reload();
                      } catch (err: any) {
                        console.error(err);
                        alert("Upload failed: " + err.message);
                      }
                    }}
                  />
                  <label 
                    htmlFor="avatar-upload"
                    className="text-[10px] font-black text-primary px-6 py-4 bg-primary/5 rounded-2xl hover:bg-primary hover:text-white transition-all cursor-pointer inline-block uppercase tracking-widest font-manrope shadow-md hover:shadow-primary/20"
                  >
                    Change Profile Photo
                  </label>
                  <p className="text-[9px] text-primary-dark/20 font-bold uppercase tracking-widest mt-3 ml-1">Synced with local storage</p>
                </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const full_name = formData.get('full_name') as string;
                  const phone = formData.get('phone') as string;
                  const bio = formData.get('bio') as string;
                  const gender = formData.get('gender') as any;
                  
                  if (user) {
                    try {
                      const { error } = await supabase.from('profiles').update({ 
                        full_name, 
                        phone, 
                        bio,
                        gender
                      }).eq('id', user.id);
                      
                      if (error) throw error;
                      alert("Profile updated successfully!");
                      window.location.reload();
                    } catch (err) {
                      console.error(err);
                      alert("Failed to update profile.");
                    }
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest ml-1">Display Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      defaultValue={user?.name}
                      className="w-full p-5 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-dm-sans text-sm font-bold text-primary-dark transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest ml-1">Contact Link</label>
                    <input 
                      type="tel" 
                      name="phone"
                      defaultValue={user?.phone || ''}
                      placeholder="+263 ..."
                      className="w-full p-5 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-dm-sans text-sm font-bold text-primary-dark transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest ml-1">Identity Gender</label>
                     <select 
                       name="gender"
                       defaultValue={user?.gender || 'preferred_not_to_say'}
                       className="w-full p-5 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-dm-sans text-sm font-bold text-primary-dark transition-all appearance-none"
                     >
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                       <option value="preferred_not_to_say">Preferred not to say</option>
                     </select>
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-primary-dark/40 uppercase tracking-widest ml-1">Professional Bio</label>
                    <textarea 
                      name="bio"
                      defaultValue={user?.bio || ''}
                      rows={4}
                      placeholder="Share your experience with the community..."
                      className="w-full p-5 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-dm-sans text-sm font-bold text-primary-dark resize-none transition-all"
                    />
                </div>

                <div className="flex justify-end pt-6">
                  <button type="submit" className="w-full md:w-auto bg-primary text-white px-10 py-5 rounded-[1.5rem] font-bold font-manrope shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest">
                    Update Professional Hub
                  </button>
                </div>
              </form>

              {/* Security & Sessions */}
              <div className="mt-12 pt-12 border-t border-primary/5 space-y-8 pb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                      <Shield size={20} />
                   </div>
                   <div>
                     <h3 className="text-sm font-manrope font-black text-primary-dark uppercase tracking-tight">Security & Sessions</h3>
                     <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest">Institutional Integrity Guard</p>
                   </div>
                </div>

                <div className="bg-orange-500/5 p-8 rounded-[2.5rem] border border-orange-500/10 space-y-6">
                   <div className="space-y-2">
                      <p className="text-xs font-bold text-orange-950/80 leading-relaxed">Protect your account by invalidating active sessions on other hardware or public devices.</p>
                   </div>
                   <button 
                     onClick={async () => {
                       if (confirm("Are you sure you want to sign out of all devices? This will invalidate your current session as well.")) {
                         try {
                           await logout('global');
                           onClose();
                           window.location.href = '/';
                         } catch (err) {
                           console.error("Global logout failed", err);
                           alert("Failed to sign out from all devices. Please try again.");
                         }
                       }
                     }}
                     className="w-full py-4 bg-white text-orange-600 border border-orange-200 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm"
                   >
                     <LogOut size={14} />
                     Sign out from all devices
                   </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { X, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user } = useAuth()

  if (!isOpen || !user) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-dark/40 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[500px]"
        >
          {/* Header */}
          <div className="p-8 border-b border-primary/5 flex items-center justify-between bg-surface-bright">
            <div>
              <h2 className="text-2xl font-manrope font-extrabold text-primary-dark tracking-tight">Edit Professional Profile</h2>
              <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-1">Institutional Identity • {user.role}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white rounded-2xl transition-all text-primary-dark/20 hover:text-primary-dark shadow-sm border border-transparent hover:border-primary/5"
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
                        const { supabase } = await import('../lib/supabase');
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
                      const { supabase } = await import('../lib/supabase');
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
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

import { useState, useEffect, useRef } from 'react'
import { X, Camera, DollarSign, TextQuote, Bus, Upload, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateProviderService, uploadServiceImage } from '../hooks/useSupabase'

interface ManageServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: any
  onUpdate: () => void
}

export const ManageServiceModal = ({ isOpen, onClose, service, onUpdate }: ManageServiceModalProps) => {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    capacity: '14'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        price: service.price?.toString() || '',
        description: service.description || '',
        image_url: service.image_url || '',
        capacity: service.capacity?.toString() || '14'
      })
      setPreviewUrl(service.image_url || '')
    }
  }, [service])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalImageUrl = formData.image_url

      if (selectedFile) {
        finalImageUrl = await uploadServiceImage(selectedFile)
      }

      await updateProviderService(service.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: finalImageUrl,
        capacity: parseInt(formData.capacity)
      })
      onUpdate()
      onClose()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary-dark/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic">Manage Car Service</h2>
                <p className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest mt-1">Post your car & monthly subscription details</p>
              </div>
              <button onClick={onClose} className="p-3 bg-surface-bright text-primary-dark/20 hover:text-primary rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Service/Car Name</label>
                  <div className="relative">
                    <Bus className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/20" size={18} />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Damascus Comfort Shuttle"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-bold text-primary-dark"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Monthly Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/20" size={18} />
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="40"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-bold text-primary-dark"
                    />
                  </div>
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Vehicle Capacity (Total Seats)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/20" size={18} />
                  <input 
                    type="number" 
                    required
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    placeholder="14"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-bold text-primary-dark"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Car/Shuttle Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full group relative h-48 rounded-[2.5rem] border-2 border-dashed border-primary/10 hover:border-primary/30 bg-surface-bright transition-all overflow-hidden flex flex-col items-center justify-center gap-3"
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <Upload className="text-primary-dark" size={32} />
                        <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest bg-white/80 px-4 py-2 rounded-xl backdrop-blur-md">Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="text-primary-dark/20 group-hover:text-primary transition-colors" size={40} />
                      <div className="text-center">
                        <p className="text-xs font-black text-primary-dark/40 uppercase tracking-widest">Select Car Image</p>
                        <p className="text-[9px] text-primary-dark/20 font-bold mt-1 italic">PNG, JPG up to 5MB</p>
                      </div>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Service Description</label>
                <div className="relative">
                  <TextQuote className="absolute left-4 top-6 text-primary-dark/20" size={18} />
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your route, vehicle type, and why students should choose you..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-bright border border-primary/5 focus:border-primary/20 outline-none font-bold text-primary-dark resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-manrope font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Publish Service Details'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

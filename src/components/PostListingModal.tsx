import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Upload, ArrowRight, Loader2, CheckCircle2,
  Home, Phone, DollarSign,
  Image as ImageIcon
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

const NEIGHBOURHOODS = [
  'Sakubva', 'Dangamvura', 'Chikanga', 'Fairbridge Park',
  'Murambi', 'Morningside', 'Palmerstone', 'Yeovil',
  'Westlea', 'Avenues', 'Greenside', 'Florida'
]

const PROPERTY_TYPES = [
  { id: 'studio', label: 'Studio' },
  { id: 'shared', label: 'Shared' },
  { id: 'apartment', label: 'Apartment' },
]

const GENDER_OPTIONS = [
  { id: 'Mixed', label: 'Mixed' },
  { id: 'Male Only', label: 'Male Only' },
  { id: 'Female Only', label: 'Female Only' },
]

const AMENITIES_LIST = [
  'High-speed WiFi', 'Solar Power Backup', 'Air Conditioning',
  'Communal Kitchen', '24/7 Security', 'Weekly Cleaning',
  'Parking', 'Water Included', 'Furnished',
  'Swimming Pool', 'Laundry Room', 'Study Room',
]

interface PostListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const PostListingModal = ({ isOpen, onClose, onSuccess }: PostListingModalProps) => {
  const { user } = useAuth()

  // Form state
  const [title, setTitle] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('')
  const [propertyType, setPropertyType] = useState<'studio' | 'shared' | 'apartment'>('shared')
  const [gender, setGender] = useState<'Mixed' | 'Male Only' | 'Female Only'>('Mixed')
  const [price, setPrice] = useState('')
  const [totalRooms, setTotalRooms] = useState('')
  const [availableRooms, setAvailableRooms] = useState('')
  const [distance, setDistance] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  // UI state
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remaining = 3 - photos.length
    const toAdd = files.slice(0, remaining)

    setPhotos(prev => [...prev, ...toAdd])
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotoPreviews(prev => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
    // Reset input so same file can be re-selected if removed
    e.target.value = ''
  }

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const toggleAmenity = (a: string) => {
    setAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  const uploadPhoto = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()
    const fileName = `listings/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, { upsert: false })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('property-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (photos.length < 3) {
      setError('Please upload exactly 3 photos.')
      return
    }
    if (!neighbourhood) {
      setError('Please select a neighbourhood.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Upload all 3 photos
      const urls = await Promise.all(photos.map(uploadPhoto))

      // 2. Build the description string (phone embedded at top)
      const fullDescription = `📞 Contact: ${phone}\n\n${description}`

      // 3. Insert the property row
      const { error: insertError } = await supabase.from('properties').insert({
        title,
        type: propertyType,
        price: Number(price),
        currency: '$',
        period: 'month',
        location: neighbourhood,
        distance,
        image_url: urls[0],
        images: [urls[1], urls[2]],
        verified: false,
        landlord_id: user.id,
        description: fullDescription,
        amenities,
        total_rooms: Number(totalRooms),
        available_rooms: Number(availableRooms),
        gender_preference: gender,
        monthly_revenue: 0,
        occupancy_count: 0,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
        resetForm()
      }, 2000)
    } catch (err: any) {
      console.error('PostListingModal: error', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle(''); setNeighbourhood(''); setPropertyType('shared')
    setGender('Mixed'); setPrice(''); setTotalRooms(''); setAvailableRooms('')
    setDistance(''); setPhone(''); setDescription(''); setAmenities([])
    setPhotos([]); setPhotoPreviews([]); setSuccess(false); setError(null)
  }

  const inputClass = "w-full px-6 py-4 rounded-2xl bg-[#F8F9F8] border border-primary/5 focus:bg-white focus:border-primary/20 outline-none font-dm-sans transition-all text-primary-dark placeholder:text-primary-dark/30"
  const labelClass = "text-[10px] font-black text-primary-dark/40 uppercase tracking-[0.25em] mb-2 block"

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-dark/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-primary/5 shrink-0">
              <div>
                <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter">Post a Listing</h2>
                <p className="text-xs text-primary-dark/40 font-dm-sans mt-1">All fields are required. Your property starts as unverified.</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#F8F9F8] text-primary-dark/40 hover:text-primary-dark hover:bg-primary/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Success State */}
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-14 text-center">
                <div className="w-24 h-24 bg-[#4F7C2C]/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-[#4F7C2C]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-manrope font-black text-primary-dark tracking-tighter">Listing Posted!</h3>
                  <p className="text-primary-dark/50 font-dm-sans">Your property is now live on PaMuzinda.<br />It will appear once AU verifies it.</p>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-8 space-y-8">

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-dm-sans font-bold">
                    {error}
                  </div>
                )}

                {/* Section: Photos */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                      <ImageIcon size={16} className="text-primary" />
                    </div>
                    <h3 className="font-manrope font-black text-lg text-primary-dark">Property Photos <span className="text-red-400">*</span></h3>
                    <span className="text-xs text-primary-dark/30 font-dm-sans">(exactly 3)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className="aspect-[4/3] rounded-[1.5rem] overflow-hidden border-2 border-dashed border-primary/10 bg-[#F8F9F8] relative group">
                        {photoPreviews[idx] ? (
                          <>
                            <img src={photoPreviews[idx]} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X size={14} />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full backdrop-blur-sm">
                              {idx === 0 ? 'Cover' : `Photo ${idx + 1}`}
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={photos.length >= 3}
                            className="w-full h-full flex flex-col items-center justify-center gap-2 text-primary-dark/30 hover:text-primary transition-colors disabled:cursor-not-allowed"
                          >
                            <Upload size={22} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{idx === 0 ? 'Cover' : `Photo ${idx + 1}`}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />

                  {photos.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 rounded-2xl border border-dashed border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={14} /> Upload Photos ({photos.length}/3)
                    </button>
                  )}
                </div>

                {/* Section: Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                      <Home size={16} className="text-primary" />
                    </div>
                    <h3 className="font-manrope font-black text-lg text-primary-dark">Property Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Property Title</label>
                      <input type="text" required placeholder="e.g. Chikanga Executive Studios" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
                    </div>

                    <div>
                      <label className={labelClass}>Neighbourhood</label>
                      <select required value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)} className={inputClass}>
                        <option value="">Select area...</option>
                        {NEIGHBOURHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Distance from AU</label>
                      <input type="text" required placeholder='e.g. "5 min walk"' value={distance} onChange={e => setDistance(e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Property Type</label>
                    <div className="flex gap-3">
                      {PROPERTY_TYPES.map(t => (
                        <button
                          key={t.id} type="button"
                          onClick={() => setPropertyType(t.id as any)}
                          className={cn(
                            "flex-1 py-3 rounded-2xl text-sm font-black transition-all border",
                            propertyType === t.id
                              ? "bg-[#1E3011] text-white border-transparent shadow-lg"
                              : "bg-[#F8F9F8] text-primary-dark/50 border-primary/5 hover:border-primary/20"
                          )}
                        >{t.label}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Gender Preference</label>
                    <div className="flex gap-3">
                      {GENDER_OPTIONS.map(g => (
                        <button
                          key={g.id} type="button"
                          onClick={() => setGender(g.id as any)}
                          className={cn(
                            "flex-1 py-3 rounded-2xl text-sm font-black transition-all border",
                            gender === g.id
                              ? "bg-[#1E3011] text-white border-transparent shadow-lg"
                              : "bg-[#F8F9F8] text-primary-dark/50 border-primary/5 hover:border-primary/20"
                          )}
                        >{g.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section: Pricing & Rooms */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                      <DollarSign size={16} className="text-primary" />
                    </div>
                    <h3 className="font-manrope font-black text-lg text-primary-dark">Pricing & Capacity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Monthly Price (USD)</label>
                      <input type="number" required min="1" placeholder="e.g. 120" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Total Rooms</label>
                      <input type="number" required min="1" placeholder="e.g. 10" value={totalRooms} onChange={e => setTotalRooms(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Available Rooms</label>
                      <input type="number" required min="0" placeholder="e.g. 4" value={availableRooms} onChange={e => setAvailableRooms(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Section: Contact & Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <h3 className="font-manrope font-black text-lg text-primary-dark">Contact & Description</h3>
                  </div>
                  <div>
                    <label className={labelClass}>Your Phone Number (visible to students)</label>
                    <input type="tel" required placeholder="e.g. +263 77 123 4567" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>About This Property</label>
                    <textarea
                      required rows={4}
                      placeholder="Describe your property — location feel, security, access to transport..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className={cn(inputClass, "resize-none")}
                    />
                  </div>
                </div>

                {/* Section: Amenities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-primary" />
                    </div>
                    <h3 className="font-manrope font-black text-lg text-primary-dark">Amenities</h3>
                    <span className="text-xs text-primary-dark/30 font-dm-sans">(select all that apply)</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES_LIST.map(a => (
                      <button
                        key={a} type="button"
                        onClick={() => toggleAmenity(a)}
                        className={cn(
                          "py-3 px-4 rounded-2xl text-xs font-black text-left transition-all border flex items-center gap-2",
                          amenities.includes(a)
                            ? "bg-[#1E3011] text-white border-transparent shadow-md"
                            : "bg-[#F8F9F8] text-primary-dark/50 border-primary/5 hover:border-primary/20"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                          amenities.includes(a) ? "bg-white border-white" : "border-primary/20"
                        )}>
                          {amenities.includes(a) && <CheckCircle2 size={10} className="text-[#1E3011]" />}
                        </div>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pb-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3011] text-white py-6 rounded-2xl font-manrope font-black text-xl shadow-2xl shadow-[#1E3011]/20 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 size={24} className="animate-spin" /> Publishing Listing...</>
                    ) : (
                      <> Post Listing <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Plus, 
  LayoutDashboard, 
  DollarSign, 
  Search,
  TrendingUp, 
  MapPin, 
  Check, 
  Camera, 
  Wifi, 
  Wind, 
  Droplets, 
  Zap, 
  Shield, 
  Trash2, 
  ChevronLeft, 
  Loader2, 
  AlertCircle,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'
import { 
  useLandlordStats, 
  useLandlordApplications, 
  updateApplicationStatus, 
  addProperty, 
  updatePropertyDetails,
  uploadServiceImage,
  useLandlordFinance
} from '../hooks/useSupabase'
import { getImageUrl } from '../lib/supabase'
import { LandlordFinance } from '../components/LandlordFinance'

const PROPERTY_TYPES = ['Single', 'Shared', 'Apartment', 'Hostel']
const GENDER_PREFERENCES = ['Boys Only', 'Girls Only', 'Mixed']

export const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { stats, loading: statsLoading, refetch: refetchStats } = useLandlordStats()
  const { finance, loading: financeLoading, refetch: refetchFinance } = useLandlordFinance()
  const { applications, loading: appsLoading, refetch: refetchApps } = useLandlordApplications()
  
  const [showAddFlow, setShowAddFlow] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActioning, setIsActioning] = useState<string | null>(null)
  const [managedPropertyId, setManagedPropertyId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [reviewsVisible, setReviewsVisible] = useState(false)

  // New Property / Edit Property State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState('Mixed')
  const [selectedType, setSelectedType] = useState('Single')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsActioning(id)
    try {
      await updateApplicationStatus(id, status)
      await refetchApps()
      await refetchStats()
    } catch (err) {
      console.error(err)
    } finally {
      setIsActioning(null)
    }
  }

  const handleDeleteListing = async (_id: string) => {
    if (!confirm("Are you sure you want to remove this house listing?")) return
    try {
      // In a real app, we'd have a deleteProperty function in useSupabase
      // For now, we'll just alert that this requires admin rights or a specific backend check
      alert("Removal request sent to moderation.")
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      let imageUrl = ''
      if (selectedFile) {
        imageUrl = await uploadServiceImage(selectedFile)
      }

      await addProperty({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        location: formData.get('location') as string,
        type: selectedType,
        gender_preference: selectedGender,
        amenities: selectedAmenities,
        image_url: imageUrl,
        available_rooms: 1, // Default to 1 for new listing
        verified: false
      })

      setShowSuccess(true)
      await refetchStats()
      setTimeout(() => {
        setShowSuccess(false)
        setShowAddFlow(false)
        setSelectedAmenities([])
        setSelectedGender('Mixed')
        setSelectedType('Single')
        setSelectedFile(null)
        setPreviewUrl(null)
      }, 2500)
    } catch (err) {
      console.error(err)
      alert("Failed to list your house. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProperty = async (e: React.FormEvent<HTMLFormElement>, propId: string, currentImageUrl: string) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      let imageUrl = currentImageUrl
      if (selectedFile) {
        imageUrl = await uploadServiceImage(selectedFile)
      }

      await updatePropertyDetails(propId, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        location: formData.get('location') as string,
        type: selectedType,
        gender_preference: selectedGender,
        amenities: selectedAmenities,
        image_url: imageUrl
      })

      setIsEditing(false)
      await refetchStats()
      await refetchFinance()
    } catch (err) {
      console.error(err)
      alert("Failed to update house details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex bg-[#F4F8F5] min-h-screen font-dm-sans relative max-w-[100vw] overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-48 w-[35rem] h-[35rem] bg-primary/3 rounded-full blur-[120px]" 
        />
      </div>
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 min-h-screen relative z-10">
        {(statsLoading && activeTab === 'overview') || (appsLoading && activeTab === 'applications') ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6 md:space-y-12"
          >
            {/* Main Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <h2 className="text-3xl md:text-5xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase leading-none">
                     {activeTab === 'overview' ? 'My Hub' : activeTab === 'applications' ? 'Applicants' : 'Earnings'}
                   </h2>
                </div>
                <p className="text-[10px] text-primary-dark/30 font-black uppercase tracking-[0.5em] italic">
                   {activeTab === 'overview' ? 'Personal Management Center' : activeTab === 'applications' ? 'Review Student Requests' : 'Financial History Hub'}
                </p>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full lg:w-auto">
                <nav className="hidden md:flex p-1.5 bg-white/40 backdrop-blur-2xl rounded-2xl border border-white shadow-xl w-full lg:w-auto">
                  {['overview', 'applications', 'finance'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest transition-all",
                        activeTab === tab ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-primary-dark/40 hover:text-primary"
                      )}
                    >
                      {tab === 'overview' ? 'Summary' : tab === 'applications' ? 'Applicants' : 'Earnings'}
                    </button>
                  ))}
                </nav>
                <button 
                  onClick={() => setShowAddFlow(true)}
                  className="bg-primary text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-primary/30 border border-white/20 hover:scale-105 active:scale-95 transition-all group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">List My House</span>
                </button>
              </div>
            </header>

            {/* Quick Stats Banner (Only on Overview) */}
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {[
                  { label: 'Portfolio Value', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
                  { label: 'Occupancy', value: `${stats.occupancy}%`, icon: Users, color: 'text-blue-500' },
                  { label: 'Active Houses', value: stats.listings, icon: LayoutDashboard, color: 'text-accent-amber' },
                  { label: 'Applicants', value: applications.filter(a => a.status === 'pending').length, icon: Users, color: 'text-green-500' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 shadow-xl flex items-center gap-3 md:gap-6 group hover:translate-y-[-4px] transition-all bg-white/40"
                  >
                    <div className={cn("p-3 md:p-4 rounded-xl shadow-inner border border-white bg-white/50 group-hover:scale-110 transition-transform", stat.color)}>
                      <stat.icon size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="relative">
                      <h4 className="text-xl md:text-4xl font-manrope font-black text-primary-dark tracking-tighter italic leading-none">{stat.value}</h4>
                      <p className="text-[7px] md:text-[9px] font-black text-primary-dark/30 uppercase tracking-[0.3em] mt-2 leading-none">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className={cn(
              "grid gap-10",
              activeTab === 'finance' ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
            )}>
              <section className={cn(
                "space-y-12",
                activeTab === 'finance' ? "" : "lg:col-span-8"
              )}>
                {activeTab === 'overview' ? (
                  <div className="space-y-12 md:space-y-20 pb-20">
                     {/* Your Houses */}
                     <div className="space-y-8">
                        <div className="flex justify-between items-end px-4">
                           <div className="space-y-1">
                              <h3 className="text-2xl md:text-3xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase">Your Houses</h3>
                              <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.4em]">Active Portfolio</p>
                           </div>
                           <button 
                             onClick={() => setReviewsVisible(!reviewsVisible)}
                             className={cn(
                               "px-6 py-3 rounded-xl text-[8px] font-black transition-all uppercase tracking-widest shadow-sm",
                               reviewsVisible ? "bg-primary text-white shadow-primary/30" : "bg-white text-primary-dark/40 border border-white"
                             )}
                           >
                              {reviewsVisible ? 'Portal Active' : 'Stealth Mode'}
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                           {stats?.properties?.map((prop: any, pIdx: number) => (
                             <motion.div 
                               key={prop.id} 
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: 0.3 + (pIdx * 0.1) }}
                               className="group glass rounded-[2rem] overflow-hidden border border-white/40 shadow-xl hover:shadow-primary/20 transition-all duration-700 bg-white/60 flex flex-col relative"
                             >
                                <div className="relative h-48 overflow-hidden">
                                  <img src={getImageUrl(prop.image_url)} alt={prop.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary-dark/80 backdrop-blur-md rounded-full text-[8px] font-black uppercase text-white tracking-widest border border-white/20">
                                     {prop.status === 'occupied' ? 'Full' : `${prop.available_rooms || 1} Open`}
                                  </div>
                                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                     <div className="flex-1 bg-white/90 backdrop-blur-xl p-3 rounded-xl border border-white shadow-xl flex justify-between items-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex flex-col">
                                           <span className="text-[7px] font-black uppercase text-primary-dark/30 tracking-widest leading-none mb-1">Price</span>
                                           <span className="text-sm font-black text-primary-dark font-manrope leading-none">${prop.price}<span className="text-[9px] font-bold opacity-30">/mo</span></span>
                                        </div>
                                     </div>
                                  </div>
                                </div>
                                <div className="p-6 space-y-6">
                                  <div className="space-y-1">
                                    <h4 className="font-manrope font-black text-lg text-primary-dark tracking-tighter leading-tight italic uppercase group-hover:text-primary transition-colors">{prop.title}</h4>
                                    <p className="text-[9px] text-primary-dark/40 font-bold uppercase tracking-[0.2em] flex items-center gap-1 font-dm-sans italic">
                                      <MapPin size={10} className="text-primary" /> {prop.location}
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                     <button 
                                       onClick={() => {
                                           setManagedPropertyId(prop.id)
                                           setIsEditing(false)
                                           setSelectedFile(null)
                                           setPreviewUrl(null)
                                           setSelectedAmenities(prop.amenities || [])
                                           setSelectedGender(prop.gender_preference || 'Mixed')
                                           setSelectedType(prop.type || 'Single')
                                       }}
                                       className="flex-1 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                     >
                                       Manage
                                     </button>
                                     <button 
                                       onClick={() => handleDeleteListing(prop.id)}
                                       className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 flex items-center justify-center"
                                     >
                                        <Trash2 size={16}/>
                                     </button>
                                  </div>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </div>

                     {/* Activity Ledger */}
                     <div className="glass p-8 md:p-12 rounded-[3.5rem] border border-white shadow-xl space-y-10 relative overflow-hidden bg-white/30">
                        <div className="flex justify-between items-center px-2 relative">
                           <div className="space-y-1">
                              <h3 className="text-2xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">Activity</h3>
                              <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.5em]">Real-time system events</p>
                           </div>
                           <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-primary border border-white">
                              <BarChart3 size={20} />
                           </div>
                        </div>
                        
                        <div className="space-y-6 relative px-2">
                           <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.6em]">Live Today</h4>
                           {[
                             { icon: Check, title: 'Handshake Secured', time: '2h ago', desc: 'Blessing M. confirmed payment for Fern Valley Heights.', color: 'text-primary' },
                             { icon: AlertCircle, title: 'Inquiry Logged', time: '5h ago', desc: 'Message from Takunda in Unit 4B about water pressure.', color: 'text-accent-amber' },
                             { icon: Plus, title: 'Listed New House', time: 'Yesterday', desc: 'Mutare Heights added to your portfolio.', color: 'text-blue-500' }
                           ].map((activity, idx) => (
                             <motion.div 
                               key={idx} 
                               className="flex gap-6 p-6 rounded-[2rem] glass border border-white/60 hover:bg-white hover:shadow-xl transition-all duration-500 group bg-white/40"
                             >
                                <div className={cn("w-12 h-12 p-3 rounded-xl bg-white shadow-md flex items-center justify-center border border-white shrink-0", activity.color)}>
                                   <activity.icon size={20} />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                   <div className="flex justify-between items-center">
                                      <h5 className="font-manrope font-black text-primary-dark text-sm uppercase tracking-tighter italic leading-none">{activity.title}</h5>
                                      <span className="text-[8px] font-black text-primary-dark/20 uppercase tracking-widest leading-none">{activity.time}</span>
                                   </div>
                                   <p className="text-[10px] text-primary-dark/50 font-bold leading-relaxed">{activity.desc}</p>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>
                ) : activeTab === 'applications' ? (
                  <div className="space-y-10 pb-20">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                        <div className="space-y-1">
                           <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase">Applicants</h3>
                           <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.5em]">Review student requests</p>
                        </div>
                        <div className="relative w-full md:w-auto">
                           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-dark/20" size={16} />
                           <input placeholder="Search applicants..." className="pl-14 pr-8 py-4 glass bg-white/40 border border-white rounded-2xl text-[10px] font-black outline-none focus:border-primary/20 transition-all w-full md:w-64" />
                        </div>
                     </div>

                     <div className="space-y-6">
                        {applications.map((app, aIdx) => (
                           <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: aIdx * 0.1 }}
                            className="glass p-6 md:p-8 rounded-[2.5rem] border border-white/40 shadow-xl hover:shadow-primary/10 transition-all bg-white/60 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
                           >
                              <div className="flex items-center gap-6 flex-1 w-full relative z-10">
                                 <div className="w-16 h-16 rounded-xl bg-white shadow-lg border border-white p-1 overflow-hidden group-hover:scale-105 transition-all shrink-0">
                                    <div className="w-full h-full rounded-lg overflow-hidden bg-primary/5 flex items-center justify-center">
                                       {app.student?.avatar_url ? (
                                         <img src={getImageUrl(app.student.avatar_url)} alt="" className="w-full h-full object-cover" />
                                       ) : (
                                         <Users size={24} className="text-primary/10" />
                                       )}
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <h4 className="font-manrope font-black text-xl text-primary-dark tracking-tighter leading-none italic uppercase">{app.student?.full_name}</h4>
                                    <p className="text-[9px] text-primary-dark/40 font-black uppercase tracking-widest leading-none italic">Applying For • {app.property?.title}</p>
                                 </div>
                              </div>

                              <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-primary/10 pt-6 md:pt-0 md:pl-8 relative z-10">
                                 {app.status === 'pending' ? (
                                    <>
                                       <button 
                                         disabled={isActioning === app.id}
                                         onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                         className="flex-1 md:flex-none px-8 py-3 bg-white border border-white rounded-xl text-[9px] font-black uppercase tracking-widest text-primary-dark/40 hover:text-red-500 hover:bg-red-50 transition-all"
                                       >
                                         Decline
                                       </button>
                                       <button 
                                         disabled={isActioning === app.id}
                                         onClick={() => handleUpdateStatus(app.id, 'approved')}
                                         className="flex-1 md:flex-none px-10 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                       >
                                         {isActioning === app.id ? <Loader2 className="animate-spin" size={16} /> : 'Accept'}
                                       </button>
                                    </>
                                 ) : (
                                    <div className={cn(
                                      "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all",
                                      app.status === 'approved' ? "bg-primary/10 text-primary border-primary/20" : "bg-red-50 text-red-500 border-red-100"
                                    )}>
                                       {app.status}
                                    </div>
                                 )}
                              </div>
                           </motion.div>
                        ))}
                        {applications.length === 0 && (
                           <div className="py-24 text-center glass rounded-[3rem] border border-dashed border-primary/20 bg-white/40">
                              <p className="text-primary-dark/40 font-black uppercase tracking-[0.5em] text-[10px] font-manrope italic">No pending requests</p>
                           </div>
                        )}
                     </div>
                  </div>
                ) : (
                  <div className="pb-24">
                     <LandlordFinance data={finance} loading={financeLoading} />
                  </div>
                )}
              </section>

              {activeTab !== 'finance' && (
                <aside className="lg:col-span-4 space-y-8 pb-24">
                  <div className="glass p-10 rounded-[3rem] border border-white shadow-xl space-y-8 bg-white/40">
                    <div className="flex justify-between items-center px-2">
                       <div className="space-y-1">
                          <h3 className="font-manrope font-black text-2xl text-primary-dark tracking-tighter uppercase italic">Checks</h3>
                          <p className="text-[8px] font-black text-primary-dark/30 uppercase tracking-widest">Ongoing Maintenance</p>
                       </div>
                       <span className="w-3 h-3 bg-accent-amber rounded-full shadow-[0_0_10px_rgba(212,160,23,0.6)]" />
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-xl space-y-4">
                      <div className="space-y-1">
                         <h5 className="font-manrope font-black text-primary-dark text-md italic uppercase">Tap Leak reported</h5>
                         <p className="text-[8px] text-primary-dark/40 font-black uppercase tracking-[0.2em]">Fern Valley Heights • Unit 4B</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                         <TrendingUp size={14} className="text-primary" />
                         <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active Check</span>
                      </div>
                      <button className="w-full py-4 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        Assign Staff
                      </button>
                    </div>
                    <button className="w-full py-4 text-[8px] font-black text-primary-dark/20 uppercase tracking-[0.5em] hover:text-primary transition-colors">History</button>
                  </div>
                </aside>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* List My House Overlay */}
      <AnimatePresence>
        {showAddFlow && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-y-auto bg-[#F4F8F5]/95 backdrop-blur-xl"
          >
            <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[90vh]">
               <header className="p-8 border-b border-primary/5 flex justify-between items-center bg-white sticky top-0 z-20">
                  <div className="space-y-1">
                     <h2 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter uppercase italic">List My House</h2>
                     <p className="text-[10px] text-primary-dark/30 font-bold uppercase tracking-[0.5em]">Create a premium property profile</p>
                  </div>
                  <button onClick={() => setShowAddFlow(false)} className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                     <X size={24} />
                  </button>
               </header>

               <form onSubmit={handleAddProperty} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-16">
                  {/* Image Section */}
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Cover Photo</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="aspect-video rounded-[2.5rem] bg-primary/5 border-2 border-dashed border-primary/10 flex flex-col items-center justify-center overflow-hidden group relative">
                           {previewUrl ? (
                             <>
                               <img src={previewUrl} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Camera className="text-white" size={32} />
                               </div>
                             </>
                           ) : (
                             <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                                   <Camera size={32} />
                                </div>
                                <p className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest">Select Property Image</p>
                             </div>
                           )}
                           <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} required />
                        </div>
                        <div className="flex flex-col justify-center space-y-4">
                           <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-2">
                              <h5 className="font-bold text-sm text-primary-dark">Quality Selection</h5>
                              <p className="text-xs text-primary-dark/50 leading-relaxed">Choose a bright, wide-angle shot of your house exterior or main room. Clear photos attract 3x more students.</p>
                           </div>
                           <div className="p-6 rounded-[2rem] bg-accent-gold/5 border border-accent-gold/10 space-y-2">
                              <h5 className="font-bold text-sm text-accent-gold">Verification</h5>
                              <p className="text-xs text-primary-dark/40 leading-relaxed italic">Your house will be marked as "Reviewing" until our team performs an identity check.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Basic Details */}
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Main Details</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">House Title</label>
                           <input name="title" required placeholder="e.g. Fern Valley Heights" className="w-full p-6 rounded-[1.5rem] bg-[#F4F8F5] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Price (per month)</label>
                           <div className="relative">
                              <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                              <input name="price" type="number" required placeholder="450" className="w-full pl-14 pr-8 py-6 rounded-[1.5rem] bg-[#F4F8F5] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner" />
                           </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                           <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Description</label>
                           <textarea name="description" required rows={4} placeholder="Describe your house, room sizes, and proximity to campus..." className="w-full p-8 rounded-[2rem] bg-[#F4F8F5] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner resize-none" />
                        </div>
                     </div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Classification</h4>
                        <div className="flex flex-wrap gap-3">
                           {PROPERTY_TYPES.map(type => (
                             <button
                               key={type}
                               type="button"
                               onClick={() => setSelectedType(type)}
                               className={cn(
                                 "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                 selectedType === type ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-white text-primary-dark/40 border-primary/5 hover:border-primary/20"
                               )}
                             >
                               {type}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Gender Preference</h4>
                        <div className="flex flex-wrap gap-3">
                           {GENDER_PREFERENCES.map(gender => (
                             <button
                               key={gender}
                               type="button"
                               onClick={() => setSelectedGender(gender)}
                               className={cn(
                                 "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                 selectedGender === gender ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-white text-primary-dark/40 border-primary/5 hover:border-primary/20"
                               )}
                             >
                               {gender}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Features</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
                          { id: 'water', icon: Droplets, label: 'Water' },
                          { id: 'elec', icon: Zap, label: 'Power' },
                          { id: 'furniture', icon: Check, label: 'Furniture' },
                          { id: 'security', icon: Shield, label: 'Security' },
                          { id: 'ac', icon: Wind, label: 'A/C' }
                        ].map(feature => (
                          <button
                            key={feature.id}
                            type="button"
                            onClick={() => handleToggleAmenity(feature.label)}
                            className={cn(
                              "p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all",
                              selectedAmenities.includes(feature.label) ? "bg-primary/5 border-primary text-primary shadow-inner" : "bg-white border-primary/5 text-primary-dark/30 hover:border-primary/10"
                            )}
                          >
                             <feature.icon size={24} />
                             <span className="text-[9px] font-black uppercase tracking-widest">{feature.label}</span>
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Location</h4>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">House Location</label>
                        <div className="relative">
                           <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                           <input name="location" required placeholder="e.g. Greenside, Mutare" className="w-full pl-14 pr-8 py-6 rounded-[1.5rem] bg-[#F4F8F5] border border-primary/5 font-bold outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner" />
                        </div>
                     </div>
                  </div>

                  <div className="h-24" /> {/* Spacer */}
               </form>

               <footer className="p-8 border-t border-primary/5 bg-white flex justify-end items-center sticky bottom-0 z-20">
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setShowAddFlow(false)} className="px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-dark/40 hover:bg-primary/5 transition-all">Cancel</button>
                     <button 
                       type="submit" 
                       disabled={isSubmitting}
                       className="px-12 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                     >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> List My House</>}
                     </button>
                  </div>
               </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary-dark/95 backdrop-blur-3xl">
             <motion.div initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} className="text-center space-y-8">
                <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center text-primary mx-auto shadow-2xl">
                   <Check size={64} strokeWidth={3} />
                </div>
                <div className="space-y-2">
                   <h2 className="text-5xl font-manrope font-black text-white italic uppercase tracking-tighter">House Listed</h2>
                   <p className="text-white/40 text-[10px] font-black tracking-[0.5em] uppercase">Updating your portfolio...</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage House Overlay */}
      <AnimatePresence>
        {managedPropertyId && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[120] bg-[#F4F8F5] overflow-y-auto"
          >
              <div className="min-h-screen p-4 md:p-12 space-y-12 max-w-7xl mx-auto">
                <header className="flex justify-between items-center bg-white/40 backdrop-blur-3xl p-4 md:p-6 rounded-[2rem] border border-white shadow-xl sticky top-4 z-50">
                   <button 
                     onClick={() => { setManagedPropertyId(null); setIsEditing(false); }}
                     className="flex items-center gap-4 text-primary-dark hover:text-primary transition-all group"
                   >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-white">
                         <ChevronLeft size={18} />
                      </div>
                      <span className="hidden md:block text-[9px] font-black uppercase tracking-widest italic">Back to Portfolio</span>
                   </button>
                   <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">{isEditing ? 'Edit Mode' : 'House Management'}</span>
                   </div>
                </header>

                {(() => {
                   const prop = stats?.properties?.find((p: any) => p.id === managedPropertyId)
                   if (!prop) return null
                   
                   return (
                     <div className="space-y-12 pb-24">
                        {isEditing ? (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-4xl mx-auto">
                            <div className="space-y-4">
                              <h2 className="text-5xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase leading-none">Update House Details</h2>
                              <p className="text-primary-dark/30 font-black uppercase tracking-[0.5em] text-[10px]">Adjust pricing or description.</p>
                            </div>
                            
                            <form className="space-y-12" onSubmit={(e) => handleEditProperty(e, prop.id, prop.image_url)}>
                              {/* Edit Image */}
                              <div className="space-y-8">
                                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] border-l-2 border-primary pl-4">Cover Image</h4>
                                 <div className="aspect-video rounded-[3rem] bg-white border border-white shadow-xl relative overflow-hidden group">
                                    <img src={previewUrl || getImageUrl(prop.image_url)} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-3 font-black uppercase text-[10px] tracking-widest">
                                       <Camera size={24} /> Update Image
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">House Title</label>
                                    <input name="title" required defaultValue={prop.title} className="w-full p-6 rounded-[1.5rem] bg-white border border-primary/5 font-bold outline-none shadow-sm focus:border-primary/20 transition-all text-primary-dark" />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Price ($)</label>
                                    <input name="price" type="number" required defaultValue={prop.price} className="w-full p-6 rounded-[1.5rem] bg-white border border-primary/5 font-bold outline-none shadow-sm focus:border-primary/20 transition-all text-primary-dark" />
                                 </div>
                                 <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-primary-dark/30 uppercase tracking-widest ml-4">Full Narrative</label>
                                    <textarea name="description" required rows={6} defaultValue={prop.description} className="w-full p-8 rounded-[2rem] bg-white border border-primary/5 font-bold outline-none shadow-sm focus:border-primary/20 transition-all text-primary-dark resize-none" />
                                 </div>
                              </div>

                              {/* Reusable Category Selectors could be added here if needed */}

                              <div className="flex gap-4 pt-6">
                                 <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-5 bg-white border border-primary/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-dark/40 hover:text-primary transition-all">Cancel Edits</button>
                                 <button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Finalize Changes</>}
                                 </button>
                              </div>
                            </form>
                          </motion.div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                             <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="space-y-2">
                                   <h2 className="text-5xl font-manrope font-black text-primary-dark tracking-tighter italic uppercase leading-none">{prop.title}</h2>
                                   <div className="flex items-center gap-3">
                                      <div className="px-4 py-1.5 bg-primary-dark text-white rounded-full text-[9px] font-black uppercase tracking-widest">{prop.type}</div>
                                      <p className="text-primary-dark/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic">
                                         <MapPin size={12} className="text-primary" /> {prop.location}
                                      </p>
                                   </div>
                                </div>
                                <div className="flex gap-4">
                                   <button 
                                     onClick={() => setIsEditing(true)}
                                     className="px-10 py-5 bg-white text-primary-dark rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/5 border border-white hover:scale-105 transition-all flex items-center gap-3"
                                   >
                                      Edit Details
                                   </button>
                                   <button className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3">
                                      View as Student
                                   </button>
                                </div>
                             </div>

                             <div className="lg:col-span-8 space-y-12">
                                <div className="aspect-[21/9] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl">
                                   <img src={getImageUrl(prop.image_url)} className="w-full h-full object-cover" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                   <div className="glass p-8 rounded-[2.5rem] border border-white shadow-xl bg-white/60 space-y-2">
                                      <span className="text-[9px] font-black text-primary-dark/20 uppercase tracking-widest">Monthly Rate</span>
                                      <h4 className="text-4xl font-manrope font-black text-primary-dark italic">${prop.price}</h4>
                                   </div>
                                   <div className="glass p-8 rounded-[2.5rem] border border-white shadow-xl bg-white/60 space-y-2">
                                      <span className="text-[9px] font-black text-primary-dark/20 uppercase tracking-widest">Available Spots</span>
                                      <h4 className="text-4xl font-manrope font-black text-primary-dark italic">{prop.available_rooms || 1}</h4>
                                   </div>
                                   <div className="glass p-8 rounded-[2.5rem] border border-white shadow-xl bg-white/60 space-y-2">
                                      <span className="text-[9px] font-black text-primary-dark/20 uppercase tracking-widest">Total Checks</span>
                                      <h4 className="text-4xl font-manrope font-black text-primary-dark italic">12</h4>
                                   </div>
                                </div>

                                <div className="glass p-12 rounded-[3.5rem] border border-white shadow-xl bg-white/40 space-y-8">
                                   <h3 className="text-2xl font-manrope font-black text-primary-dark italic uppercase tracking-tighter">About this House</h3>
                                   <p className="text-primary-dark/60 text-sm font-bold leading-relaxed whitespace-pre-wrap">{prop.description}</p>
                                </div>
                             </div>

                             <div className="lg:col-span-4 space-y-8">
                                <div className="glass p-10 rounded-[3rem] border border-white shadow-xl bg-primary-dark space-y-8 relative overflow-hidden">
                                   <div className="relative space-y-6">
                                      <h3 className="text-2xl font-manrope font-black text-white italic uppercase tracking-tighter">Applicants</h3>
                                      <div className="space-y-4">
                                         {applications.filter(app => app.property_id === managedPropertyId).slice(0, 3).map((app: any) => (
                                           <div key={app.id} className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center gap-4">
                                              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-black">{app.student?.full_name?.charAt(0)}</div>
                                              <div className="flex-1">
                                                 <p className="text-[10px] font-black text-white italic uppercase">{app.student?.full_name}</p>
                                                 <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">{app.status}</p>
                                              </div>
                                           </div>
                                         ))}
                                         {applications.filter(app => app.property_id === managedPropertyId).length === 0 && (
                                           <p className="text-white/30 text-[9px] font-black uppercase tracking-widest italic text-center py-4">No active applicants</p>
                                         )}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                   )
                })()}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Heart, ChevronLeft, ChevronRight, ShieldCheck, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { getImageUrl } from '../utils/supabase-helpers'
import type { Property } from '../hooks/supabase/types'
import { useAuth } from '../hooks/useAuth'

interface PropertyCardProps {
  property: Property
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
}

export const PropertyCard = ({ property, isFavorited, onToggleFavorite }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.image_url]

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-[2rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
      <Link to={`/property/${property.id}`} className="block">
        {/* Image Carousel Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={getImageUrl(images[currentImageIndex])}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "w-full h-full object-cover",
                property.available_rooms === 0 && "grayscale contrast-125 opacity-50"
              )}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
              }}
            />
          </AnimatePresence>

          {/* Fully Occupied Overlay */}
          {property.available_rooms === 0 && (
            <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-[2px] flex items-center justify-center z-20">
               <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/20">
                  <span className="text-[11px] font-black text-primary-dark uppercase tracking-widest">Fully Occupied</span>
               </div>
            </div>
          )}

          {/* Carousel Controls (Show on hover) */}
          {images.length > 1 && isHovered && (
            <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
              <button 
                onClick={prevImage}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary-dark transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary-dark transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    currentImageIndex === idx ? "bg-white w-4" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20 self-start">
                {property.rating ? (
                  <>
                    <Star size={12} className="text-accent-amber fill-current" />
                    <span className="text-[11px] font-black text-primary-dark">{property.rating}</span>
                  </>
                ) : (
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">New House</span>
                )}
              </div>
              {property.verified && (
                <div className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 text-white shadow-lg self-start">
                  <ShieldCheck size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                </div>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!user) {
                  navigate('/auth');
                  return;
                }
                onToggleFavorite(property.id);
              }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                isFavorited 
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110" 
                  : "bg-white/40 backdrop-blur-md text-white hover:bg-white hover:text-red-500 shadow-xl"
              )}
            >
              <Heart size={18} className={cn(isFavorited && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-manrope font-black text-primary-dark tracking-tighter leading-tight truncate">
                {property.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-primary-dark/40 font-bold text-[11px] uppercase tracking-widest">
                <MapPin size={12} className="text-primary" />
                {property.location}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-manrope font-black text-primary-dark tracking-tighter italic leading-none">
                ${property.price}
              </div>
              <p className="text-[10px] font-bold text-primary-dark/30 uppercase tracking-widest mt-1">Per month</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {property.type && (
              <span className="px-3 py-1 bg-surface-bright border border-primary/5 rounded-lg text-[10px] font-black text-primary-dark/60 uppercase tracking-widest">
                {property.type}
              </span>
            )}
            {property.distance && (
              <span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                {property.distance}
              </span>
            )}
            {property.gender_preference && (
              <span className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded-lg text-[10px] font-black text-accent-gold uppercase tracking-widest">
                {property.gender_preference}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

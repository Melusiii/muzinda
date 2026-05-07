import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { Navigation, ZoomIn, ZoomOut, Layers, Map as MapIcon } from 'lucide-react'
import { cn } from '../utils/cn'
import type { Property } from '../hooks/supabase/types'
import { getImageUrl } from '../utils/supabase-helpers'

// Fix Leaflet marker icon issue
import 'leaflet/dist/leaflet.css'

interface ExplorerMapProps {
  properties: Property[]
  activeId?: string | null
  onPinClick?: (id: string) => void
}

// Component to handle map centering/zooming
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export const ExplorerMap = ({ properties, activeId, onPinClick }: ExplorerMapProps) => {
  const mutareCenter: [number, number] = [-18.9742, 32.6514]
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'terrain'>('streets')

  const mapTyles = {
    streets: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    satellite: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    terrain: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
  }

  const createPriceIcon = (price: number, isActive: boolean) => {
    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div class="relative px-3 py-2 rounded-xl font-manrope font-black text-xs shadow-2xl transition-all duration-300 ${
          isActive 
            ? 'bg-primary text-white scale-125 z-[1000]' 
            : 'bg-white text-primary-dark hover:bg-primary-dark hover:text-white'
        }">
          $${price}
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
            isActive ? 'bg-primary' : 'bg-white'
          }"></div>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 30]
    })
  }

  return (
    <div className="relative w-full h-full bg-[#f8f9fa] overflow-hidden rounded-[2.5rem] border border-primary/10 shadow-inner">
      <MapContainer 
        center={mutareCenter} 
        zoom={14} 
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={mapTyles[mapType as keyof typeof mapTyles]}
        />
        
        {properties.map((prop) => {
          if (!prop.lat || !prop.lng) return null;
          const isActive = activeId === prop.id;
          
          return (
            <Marker 
              key={prop.id} 
              position={[prop.lat, prop.lng]}
              icon={createPriceIcon(prop.price, isActive)}
              eventHandlers={{
                click: () => onPinClick?.(prop.id)
              }}
            >
              <Popup>
                <div className="min-w-[180px] font-dm-sans">
                  <div className="aspect-video w-full rounded-lg overflow-hidden mb-2">
                    <img 
                      src={getImageUrl(prop.image_url)} 
                      className="w-full h-full object-cover" 
                      alt={prop.title}
                    />
                  </div>
                  <h4 className="text-xs font-black text-primary-dark truncate leading-none mb-1">{prop.title}</h4>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">${prop.price} / Month</p>
                </div>
              </Popup>
            </Marker>
          )
        })}

        <MapController center={mutareCenter} zoom={14} />
      </MapContainer>

      {/* Premium Overlay Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-[1000] pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <MapIcon size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark/40 leading-none mb-1">Location</p>
              <p className="text-sm font-black text-primary-dark leading-none">Mutare City</p>
            </div>
          </div>

          {/* Layer Switcher */}
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-white/20 flex gap-1">
            {(['streets', 'satellite', 'terrain'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  mapType === type 
                    ? "bg-primary text-white" 
                    : "text-primary-dark/40 hover:text-primary-dark"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          {[ZoomIn, ZoomOut, Layers].map((Icon, idx) => (
            <button 
              key={idx}
              className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20 flex items-center justify-center text-primary-dark/60 hover:text-primary hover:scale-110 transition-all"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Floating Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6 z-[1000] pointer-events-none">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary-dark/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 text-white flex items-center justify-between pointer-events-auto"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Navigation size={20} className="text-accent-gold" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Real-time Map</p>
                <p className="text-sm font-bold">Showing {properties.length} active listings</p>
             </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Redo Search
          </button>
        </motion.div>
      </div>
    </div>
  )
}

import { useState, useEffect } from "react"
import { 
  Phone, 
  Bell, 
  Shield, 
  Navigation, 
  MapPin, 
  PhoneCall, 
  LifeBuoy, 
  HeartPulse, 
  Zap, 
  Bus, 
  Flame, 
  AlertCircle,
  Stethoscope,
  Info,
  Activity
} from "lucide-react"

export default function Ambulance() {
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [nearestHospital, setNearestHospital] = useState(null)

  const nationalNumbers = [
    { name: "National Ambulance", number: "108",  desc: "Free government emergency service", icon: Bus, color: "text-red-600", bg: "bg-red-50" },
    { name: "National Emergency", number: "112",  desc: "All-in-one helpline service",      icon: LifeBuoy, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Police",             number: "100",  desc: "Accidents and law enforcement",      icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Fire Brigade",       number: "101",  desc: "Fire and rescue emergencies",        icon: Flame, color: "text-red-500", bg: "bg-red-50" },
  ]

  const hospitals = [
    { id: 1,  name: "RIMS",                        city: "Ranchi",     phone: "0651-2451070", ambulance: "0651-2451071", lat: 23.3561, lng: 85.3096 },
    { id: 2,  name: "Medanta Hospital Ranchi",      city: "Ranchi",     phone: "0651-3520000", ambulance: "0651-3520001", lat: 23.3441, lng: 85.3096 },
    { id: 3,  name: "AIIMS Ranchi",                 city: "Ranchi",     phone: "0651-2451100", ambulance: "0651-2451101", lat: 23.3200, lng: 85.2800 },
    { id: 4,  name: "Tata Main Hospital (TMH)",     city: "Jamshedpur", phone: "0657-2428570", ambulance: "0657-2428571", lat: 22.8046, lng: 86.2029 },
    { id: 5,  name: "MGM Medical College",          city: "Jamshedpur", phone: "0657-2387100", ambulance: "0657-2387101", lat: 22.8200, lng: 86.2200 },
    { id: 6,  name: "Brahmanand Narayana Hospital", city: "Jamshedpur", phone: "0657-6677777", ambulance: "0657-6677778", lat: 22.7800, lng: 86.1800 },
    { id: 7,  name: "SNMMCH Saraidhela",            city: "Dhanbad",    phone: "0326-2310627", ambulance: "0326-2310628", lat: 23.7957, lng: 86.4304 },
    { id: 8,  name: "Bokaro General Hospital",      city: "Bokaro",     phone: "06542-233100", ambulance: "06542-233101", lat: 23.6693, lng: 86.1511 },
    { id: 9,  name: "Sadar Hospital Hazaribagh",    city: "Hazaribagh", phone: "06546-222344", ambulance: "06546-222345", lat: 23.9925, lng: 85.3637 },
    { id: 10, name: "AIIMS Deoghar",                city: "Deoghar",    phone: "06432-222100", ambulance: "06432-222101", lat: 24.4800, lng: 86.7000 },
  ]

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
  }

  const getLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(coords); setLocating(false)
        const nearest = hospitals.reduce((closest, hospital) => {
          const dist = parseFloat(getDistance(coords.lat, coords.lng, hospital.lat, hospital.lng))
          return dist < closest.distance ? { ...hospital, distance: dist } : closest
        }, { distance: Infinity })
        setNearestHospital(nearest)
      },
      () => setLocating(false),
      { timeout: 10000 }
    )
  }

  useEffect(() => { getLocation() }, [])

  const sortedHospitals = location
    ? [...hospitals].map(h => ({ ...h, distance: parseFloat(getDistance(location.lat, location.lng, h.lat, h.lng)) })).sort((a, b) => a.distance - b.distance)
    : hospitals

  return (
    <div className="min-h-screen bg-white py-12 px-6 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">

        {/* SOS HEADER */}
        <div className="relative bg-red-600 rounded-[48px] p-10 md:p-16 text-center mb-12 overflow-hidden shadow-2xl shadow-red-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center mb-8 animate-pulse border border-white/30 backdrop-blur-sm">
              <Bell size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-none">
              Emergency SOS
            </h1>
            <p className="text-red-100 font-medium mb-10 max-w-sm mx-auto uppercase tracking-widest text-xs">
              Direct connection to Jharkhand medical rescue
            </p>
            <a href="tel:108" className="group relative bg-white text-red-600 px-12 py-5 rounded-[24px] font-black text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4">
              <Phone size={28} className="animate-bounce" /> Call 108 Now
              <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <div className="flex items-center gap-2 mt-8 text-white/60 text-[10px] font-black uppercase tracking-widest">
              <Zap size={14} className="text-yellow-400" /> Free Service · 24/7 Response · Nationwide
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* NEAREST FACILITY */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <MapPin className="text-red-600" /> Nearest Rescue Facility
            </h2>
            
            {locating ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[32px] p-12 text-center">
                <HeartPulse className="text-red-300 w-12 h-12 mx-auto mb-4 animate-ping" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Triangulating Location...</p>
              </div>
            ) : nearestHospital ? (
              <div className="bg-white border-2 border-red-600 rounded-[40px] p-8 relative overflow-hidden shadow-2xl shadow-red-50">
                <div className="absolute top-0 right-0 bg-red-600 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">
                  Priority Access
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{nearestHospital.name}</h3>
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{nearestHospital.city}, Jharkhand</p>
                  </div>
                  <div className="bg-red-50 px-4 py-2 rounded-2xl flex flex-col items-center">
                    <span className="text-red-600 font-black text-xl">{nearestHospital.distance}</span>
                    <span className="text-red-400 font-black text-[9px] uppercase">Kilometers</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={`tel:${nearestHospital.ambulance}`} className="bg-red-600 text-white p-5 rounded-[24px] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-100">
                    <Bus size={20} /> Ambulance
                  </a>
                  <a href={`tel:${nearestHospital.phone}`} className="bg-gray-900 text-white p-5 rounded-[24px] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-gray-100">
                    <PhoneCall size={20} /> Front Desk
                  </a>
                </div>
                
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.lat},${nearestHospital.lng}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">
                  <Navigation size={12} /> Get GPS Navigation
                </a>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-[32px] p-8 text-center border border-gray-100">
                <AlertCircle className="text-gray-300 w-10 h-10 mx-auto mb-3" />
                <p className="text-gray-400 font-bold text-sm mb-4">Positioning unavailable</p>
                <button onClick={getLocation} className="bg-white border border-gray-200 px-8 py-3 rounded-2xl font-bold text-xs hover:bg-white hover:shadow-md transition-all">Manual Triangulation</button>
              </div>
            )}
          </div>

          {/* QUICK HELPLINES */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Activity className="text-orange-500" /> Instant Helplines
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {nationalNumbers.map((n) => (
                <a key={n.number} href={`tel:${n.number}`} className="group flex items-center justify-between bg-white border-2 border-gray-50 p-5 rounded-[28px] hover:border-red-600 hover:shadow-xl hover:shadow-red-50 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${n.bg} rounded-2xl flex items-center justify-center ${n.color} transition-colors group-hover:bg-red-600 group-hover:text-white`}>
                      <n.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{n.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{n.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-black text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                    <span className="text-[10px] text-gray-300 uppercase mr-1 mt-1 font-black">Call</span>
                    {n.number}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ALL FACILITIES */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Stethoscope className="text-teal-600" /> Hospital Network
            </h2>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
              <Info size={14} className="text-gray-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sorted by distance</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedHospitals.map((h) => (
              <div key={h.id} className="bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-2xl hover:shadow-gray-100 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-gray-900 text-base leading-tight group-hover:text-teal-600 transition-colors">{h.name}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {h.city}
                    </p>
                  </div>
                  {h.distance && (
                    <span className="bg-teal-50 text-teal-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                      {h.distance} km
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${h.ambulance}`} className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-red-600 hover:text-white transition-all shadow-sm">
                    Ambulance
                  </a>
                  <a href={`tel:${h.phone}`} className="flex-1 bg-gray-50 text-gray-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-gray-900 hover:text-white transition-all">
                    Inquiry
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
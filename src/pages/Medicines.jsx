import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  ShoppingBag, 
  ClipboardList, 
  Smartphone, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  AlertCircle, 
  Droplets, 
  Thermometer, 
  Activity, 
  Heart, 
  Sun, 
  Flame, 
  Shield,
  Stethoscope,
  ChevronRight
} from "lucide-react"

export default function Medicines() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")

  const platforms = [
    {
      name: "1mg",
      tagline: "India's most trusted delivery",
      desc: "Order medicines, book lab tests, consult doctors online.",
      color: "bg-red-50/50 border-red-100",
      btnColor: "bg-red-600 hover:bg-red-700",
      textColor: "text-red-600",
      icon: ShoppingBag,
      url: "https://www.1mg.com",
      searchUrl: "https://www.1mg.com/search/all?name=",
      features: ["2hr delivery", "Home Lab tests", "Genuine meds"],
    },
    {
      name: "Netmeds",
      tagline: "India ki pharmacy",
      desc: "Prescription and OTC medicines delivered to your door.",
      color: "bg-blue-50/50 border-blue-100",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-blue-600",
      icon: Activity,
      url: "https://www.netmeds.com",
      searchUrl: "https://www.netmeds.com/catalogsearch/result?q=",
      features: ["25% discount", "PAN India", "Licensed pharmacists"],
    },
    {
      name: "PharmEasy",
      tagline: "Making health accessible",
      desc: "Order medicines and diagnostics with fast delivery.",
      color: "bg-teal-50/50 border-teal-100",
      btnColor: "bg-teal-600 hover:bg-teal-700",
      textColor: "text-teal-600",
      icon: Stethoscope,
      url: "https://pharmeasy.in",
      searchUrl: "https://pharmeasy.in/search/all?name=",
      features: ["Same day delivery", "Diagnostics", "Health packs"],
    },
  ]

  const commonMedicines = [
    { name: "Paracetamol",  use: "Fever & Pain",        icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "ORS Sachets",  use: "Dehydration",         icon: Droplets,    color: "text-blue-500",   bg: "bg-blue-50" },
    { name: "Metformin",    use: "Diabetes",            icon: Activity,    color: "text-red-500",    bg: "bg-red-50" },
    { name: "Amlodipine",   use: "Blood Pressure",      icon: Heart,       color: "text-rose-500",   bg: "bg-rose-50" },
    { name: "Cetirizine",   use: "Allergy",             icon: Sun,         iconAlt: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
  ]

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.open("https://www.1mg.com/search/all?name=" + encodeURIComponent(searchTerm), "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-6 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] mb-6 shadow-sm border border-teal-100">
              <Zap size={14} className="animate-pulse" /> Medicine Marketplace
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
              Pharmacy <span className="text-teal-600">Network</span>
            </h1>
            <p className="text-gray-400 font-medium text-lg">
              Compare prices across India's top platforms. Get medicines delivered directly to your doorstep anywhere in Jharkhand.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100"></div>)}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Trusted by 50k+ Users</p>
          </div>
        </div>

        {/* SMART SEARCH */}
        <div className="bg-gray-50 rounded-[40px] p-8 md:p-12 mb-16 border border-gray-100 relative overflow-hidden shadow-2xl shadow-gray-50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 px-1">Universal Medicine Search</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter medicine name (e.g. Paracetamol)..."
                  className="w-full bg-white border-2 border-transparent px-8 py-5 rounded-[24px] font-bold text-lg focus:outline-none focus:border-teal-600 transition-all pl-16 shadow-xl shadow-gray-100"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-600 transition-colors" size={24} />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gray-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
              >
                Find Best Price
              </button>
            </div>
            
            {searchTerm.trim() && (
              <div className="mt-8 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-full mb-1">Search specifically on:</p>
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.searchUrl + encodeURIComponent(searchTerm)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-all shadow-sm"
                  >
                    <p.icon size={14} /> {p.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PLATFORM GRIDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {platforms.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-[40px] border-2 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-100 group ${p.color}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform duration-500">
                  <p.icon size={28} className={p.textColor} />
                </div>
                <div className="text-right">
                  <h3 className={`font-black text-2xl tracking-tighter ${p.textColor}`}>{p.name}</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[2px]">{p.tagline}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed mb-8 flex-1">{p.desc}</p>
              <div className="space-y-3 mb-10">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <CheckCircle size={14} className="text-teal-500" /> {f}
                  </div>
                ))}
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-5 rounded-[24px] text-white font-black text-[11px] uppercase tracking-widest text-center transition-all shadow-xl shadow-gray-100 flex items-center justify-center gap-2 ${p.btnColor}`}
              >
                Open Store <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>

        {/* COMMONLY NEEDED */}
        <div className="bg-gray-900 rounded-[48px] p-10 md:p-12 mb-16 text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-8">Essentials Quick Search</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {commonMedicines.map((m) => (
                <button
                  key={m.name}
                  onClick={() => window.open("https://www.1mg.com/search/all?name=" + encodeURIComponent(m.name), "_blank")}
                  className="bg-white/5 border border-white/10 p-6 rounded-[32px] text-center hover:bg-white hover:text-gray-900 transition-all duration-500 group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <m.icon size={24} />
                  </div>
                  <p className="font-black text-xs mb-1">{m.name}</p>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-tighter">{m.use}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRESCRIPTION ACTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-teal-600 rounded-[40px] p-10 text-white shadow-2xl shadow-teal-100 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center mb-8">
                <ClipboardList size={32} />
              </div>
              <h2 className="text-3xl font-black mb-4">Have a Prescription?</h2>
              <p className="text-teal-50 font-medium leading-relaxed mb-10">
                Upload your medical prescription to your profile. Doctors can review it during consultations for better care.
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-white text-teal-600 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-teal-50 transition-all shadow-xl shadow-teal-900/10"
            >
              Upload to Digital Profile
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 flex items-center gap-6 group hover:border-teal-200 transition-all">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                <Zap size={32} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Analyze your medical reports with our advanced Health AI for deeper insights.
                </p>
                <button onClick={() => navigate("/ai-recommend")} className="mt-4 flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">
                  Get Started <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 flex items-center gap-6 group hover:border-orange-200 transition-all">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-2">Verified Stores</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Only licensed pharmacies with genuine medicines are part of our network.
                </p>
                <div className="mt-4 flex items-center gap-1.5">
                  {[1,2,3].map(i => <CheckCircle key={i} size={14} className="text-orange-500" />)}
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
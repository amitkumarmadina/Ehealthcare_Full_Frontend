import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { 
  Video, Calendar, MapPin, Star, Clock, CreditCard, Shield, 
  Phone, MessageSquare, AlertCircle, ArrowRight, ArrowLeft, 
  CheckCircle, Stethoscope, Search, Monitor, Zap, User, Activity, Banknote
} from "lucide-react"
import { API_BASE_URL } from "../config/api"

const API = API_BASE_URL

export default function VideoConsult() {
  const navigate = useNavigate()

  const [step, setStep]                     = useState(1)
  const [city, setCity]                     = useState("All")
  const [cities, setCities]                 = useState(["All"])
  const [doctors, setDoctors]               = useState([])
  const [fetching, setFetching]             = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [problem, setProblem]               = useState("")
  const [problemError, setProblemError]     = useState("")
  const [isEmergency, setIsEmergency]       = useState(false)
  const [consultType, setConsultType]       = useState("video")
  const [paymentDone, setPaymentDone]       = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [inCall, setInCall]                 = useState(false)
  const [callEnded, setCallEnded]           = useState(false)

  useEffect(() => {
    axios.get(API + "/hospitals/cities")
      .then((res) => setCities(["All", ...res.data]))
      .catch(() => setCities(["All","Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih","Dumka"]))
  }, [])

  useEffect(() => {
    setFetching(true)
    const url = city === "All"
      ? API + "/doctors?limit=12"
      : API + "/doctors?city=" + city + "&limit=12"
    axios.get(url)
      .then((res) => setDoctors(res.data.doctors || res.data))
      .catch(() => setDoctors([]))
      .finally(() => setFetching(false))
  }, [city])

  const handlePayment = async () => {
    setPaymentLoading(true)
    try {
      const token = localStorage.getItem("token")
      const user  = JSON.parse(localStorage.getItem("user") || "{}")
      await axios.post(
        API + "/appointments",
        {
          patientName: user.name,
          city: selectedDoctor.city,
          hospital: selectedDoctor.hospital,
          speciality: selectedDoctor.speciality,
          doctorName: selectedDoctor.name,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }),
          consultType, problem, isEmergency,
          fee: selectedDoctor.fee,
          status: "confirmed",
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      setTimeout(() => { setPaymentDone(true); setPaymentLoading(false) }, 2000)
    } catch (err) {
      setPaymentLoading(false)
    }
  }

  const handleContinueToPayment = () => {
    if (!problem.trim()) {
      setProblemError("Please describe your problem before continuing")
      return
    }
    if (problem.trim().length < 10) {
      setProblemError("Description must be at least 10 characters")
      return
    }
    setProblemError("")
    setStep(3)
  }

  if (inCall && selectedDoctor) {
    return <CallScreen doctor={selectedDoctor} onEnd={() => { setInCall(false); setCallEnded(true) }} />
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-md w-full border border-gray-100 relative overflow-hidden animate-in zoom-in duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-[40px] rounded-full"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-indigo-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-indigo-600 shadow-xl shadow-indigo-100">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Session Complete</h2>
            <p className="text-gray-500 font-medium mb-8">Your consultation with Dr. {selectedDoctor.name.split(' ')[0]} is successfully concluded.</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate("/profile")} className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                View Medical Records
              </button>
              <button onClick={() => navigate("/medicines")} className="w-full bg-white border-2 border-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm">
                Order E-Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-700">
      
      {/* ── PREMIUM HEADER ── */}
      <div className="bg-gray-900 pt-16 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-white/10 text-white mb-6 border border-white/5 backdrop-blur-md shadow-2xl">
            <Video size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">Care Hub</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">
            Connect instantly with top specialists across the network for secure, high-definition tele-consultations.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20">
        
        {/* ── STEPPER ── */}
        <div className="bg-white rounded-[32px] shadow-2xl p-6 md:p-8 flex items-center justify-between md:justify-center md:gap-12 mb-12 border border-gray-100">
          {[
            { id: 1, icon: Stethoscope, label: "Specialist" },
            { id: 2, icon: Activity,    label: "Symptoms" },
            { id: 3, icon: CreditCard,  label: "Payment" },
            { id: 4, icon: Monitor,     label: "Session" },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-500 shadow-sm ${
                  step > s.id ? "bg-indigo-600 text-white shadow-teal-200" :
                  step === s.id ? "bg-gray-900 text-white shadow-gray-300 scale-110" :
                  "bg-gray-50 text-gray-400 border border-gray-100"
                }`}>
                  <s.icon size={20} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-3 hidden md:block ${
                  step >= s.id ? "text-gray-900" : "text-gray-400"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div className={`w-12 md:w-24 h-1 mx-4 rounded-full transition-all duration-500 ${
                  step > s.id ? "bg-indigo-600" : "bg-gray-100"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: SELECT DOCTOR ── */}
        {step === 1 && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Select Specialist</h2>
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <button key={c} onClick={() => setCity(c)}
                    className={`px-5 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                      city === c ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {fetching ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finding Specialists...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                <Stethoscope size={48} className="mx-auto text-gray-300 mb-6" />
                <p className="text-gray-500 font-bold mb-2">No specialists found in {city}</p>
                <button onClick={() => setCity("All")} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Locations</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-teal-200 transition-all duration-300 group flex flex-col justify-between">
                    <div className="flex gap-5 mb-6">
                      <div className="w-20 h-20 rounded-[24px] bg-gray-50 flex items-center justify-center text-indigo-600 font-black text-2xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                        {doctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-black text-gray-900 text-lg leading-tight">{doctor.name}</h3>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${doctor.available ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                            {doctor.available ? "Online" : "Offline"}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">{doctor.speciality}</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                          <MapPin size={14} className="text-gray-400" /> {doctor.hospital}, {doctor.city}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Star size={14} className="text-orange-400 fill-orange-400" /> {doctor.rating} · {doctor.experience}Y Exp.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Consultation Fee</p>
                        <p className="font-black text-gray-900 text-lg">₹{doctor.fee}</p>
                      </div>
                      <button onClick={() => { setSelectedDoctor(doctor); setStep(2) }}
                        disabled={!doctor.available}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-gray-200 flex items-center gap-2">
                        {doctor.available ? <>Select <ArrowRight size={14} /></> : "Unavailable"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: DETAILS ── */}
        {step === 2 && (
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 animate-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-900">Consultation Details</h2>
              <button onClick={() => setStep(1)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-1 transition">
                <ArrowLeft size={12} /> Change Doctor
              </button>
            </div>
            
            {/* Selected Doctor Banner */}
            <div className="bg-gray-50 rounded-[24px] p-5 mb-10 flex items-center gap-5 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-900 font-black shadow-sm">
                {selectedDoctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
              </div>
              <div>
                <p className="font-black text-gray-900 text-lg">{selectedDoctor.name}</p>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{selectedDoctor.speciality} · {selectedDoctor.hospital}</p>
              </div>
            </div>

            <div className="space-y-10">
              {/* Type */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 block">Mode of Consultation</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "video",    label: "Video Session", icon: Video,         desc: "Secure WebRTC",     color: "teal" },
                    { value: "whatsapp", label: "WhatsApp",      icon: MessageSquare, desc: "Text & Voice",      color: "green" },
                    { value: "inperson", label: "In-Person",     icon: User,          desc: "Clinic Visit",      color: "blue" },
                  ].map((t) => (
                    <div key={t.value} onClick={() => setConsultType(t.value)}
                      className={`border-2 rounded-[24px] p-5 cursor-pointer transition-all duration-300 group ${
                        consultType === t.value ? `border-${t.color}-500 bg-${t.color}-50 shadow-md shadow-${t.color}-100` : `border-gray-100 hover:border-gray-300`
                      }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                        consultType === t.value ? `bg-${t.color}-600 text-white` : `bg-gray-50 text-gray-400 group-hover:bg-gray-100`
                      }`}>
                        <t.icon size={18} />
                      </div>
                      <p className={`font-black text-sm mb-1 ${consultType === t.value ? `text-${t.color}-900` : `text-gray-800`}`}>{t.label}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${consultType === t.value ? `text-${t.color}-600` : `text-gray-400`}`}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 block">Describe Symptoms</label>
                <div className="relative">
                  <textarea
                    value={problem}
                    onChange={(e) => { setProblem(e.target.value); if(problemError) setProblemError("") }}
                    placeholder="E.g., I've been experiencing severe migraines and nausea for the past 48 hours..."
                    rows={4}
                    className={`w-full bg-gray-50 border-2 px-6 py-5 rounded-[24px] font-medium text-gray-800 focus:outline-none transition-all resize-none ${
                      problemError ? "border-red-400 focus:border-red-500 bg-red-50/30" : "border-gray-50 focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                  {problemError && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 px-2 flex items-center gap-1.5"><AlertCircle size={12} /> {problemError}</p>}
                </div>
              </div>

              {/* Emergency */}
              <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/20 blur-[40px] rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                      <AlertCircle className="text-red-400" /> Emergency Protocol
                    </h3>
                    <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-sm">
                      If this is a life-threatening medical emergency, bypass this queue immediately.
                    </p>
                  </div>
                  <div className="flex gap-3 bg-white/5 p-1.5 rounded-[20px] backdrop-blur-md border border-white/10 shrink-0">
                    <button onClick={() => setIsEmergency(false)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!isEmergency ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-white"}`}>
                      Standard
                    </button>
                    <button onClick={() => setIsEmergency(true)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isEmergency ? "bg-red-600 text-white shadow-lg shadow-red-900/50" : "text-gray-400 hover:text-white"}`}>
                      Critical
                    </button>
                  </div>
                </div>
                {isEmergency && (
                  <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs font-bold text-red-200 flex items-center gap-3">
                    <Phone className="animate-pulse text-red-400" size={16} /> Contact National Emergency (108) immediately for ambulance dispatch.
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleContinueToPayment}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[2px] transition-all shadow-xl shadow-indigo-100 flex items-center gap-3">
                  Proceed to Payment <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step === 3 && (
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 animate-in slide-in-from-right-8 duration-500">
             <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-900">Secure Checkout</h2>
              <button onClick={() => setStep(2)} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-1 transition">
                <ArrowLeft size={12} /> Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Summary */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6">Order Summary</h3>
                <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 font-black">
                        {selectedDoctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{selectedDoctor.name}</p>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{selectedDoctor.speciality}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500">Consultation Fee</span>
                      <span className="font-bold text-gray-900">₹{selectedDoctor.fee}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500">Platform Charge</span>
                      <span className="font-bold text-gray-900">₹0</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500">Mode</span>
                      <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider bg-white px-2 py-1 rounded-md border border-gray-100">{consultType}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-6 border-t border-gray-200">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black text-indigo-600">₹{selectedDoctor.fee}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6">Payment Method</h3>
                {!paymentDone ? (
                  <div className="space-y-8">
                    <div className="flex flex-col gap-3">
                      {[
                        { id: 'upi',  label: "UPI Payment",    icon: Zap,        desc: "Google Pay, PhonePe" },
                        { id: 'card', label: "Credit / Debit", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
                        { id: 'bank', label: "Net Banking",    icon: Banknote,   desc: "All Indian Banks" },
                      ].map((m) => (
                        <label key={m.id} className="flex items-center justify-between p-4 rounded-[20px] border-2 border-gray-50 hover:border-teal-200 cursor-pointer group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                              <m.icon size={18} />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm mb-0.5">{m.label}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{m.desc}</p>
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-500 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button onClick={handlePayment} disabled={paymentLoading}
                      className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[2px] transition-all disabled:opacity-50 shadow-xl shadow-gray-200 flex justify-center items-center gap-3">
                      {paymentLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing Auth...</> : <>Pay ₹{selectedDoctor.fee} Securely <Shield size={16}/></>}
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center bg-indigo-50/50 rounded-[32px] border border-indigo-100 p-8 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-indigo-100 rounded-[24px] flex items-center justify-center text-indigo-600 mb-6 shadow-xl shadow-indigo-100/50">
                      <CheckCircle size={40} />
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-2">Payment Verified</p>
                    <p className="text-gray-500 font-medium text-sm mb-8">Transaction ID: TXN-{Math.floor(Math.random()*1000000)}</p>
                    <button onClick={() => setStep(4)}
                      className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                      {consultType === "video" ? "Initialize Session" : "View Instructions"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: CALL ACTION ── */}
        {step === 4 && (
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-12 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
            {consultType === "video" && (
              <>
                <div className="w-24 h-24 bg-gray-900 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-gray-300 relative">
                  <Video size={40} />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500 border-2 border-white"></span>
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Ready for Session</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Please ensure you are in a quiet room with good internet connectivity before joining the room.</p>
                <button onClick={() => setInCall(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[2px] transition-all shadow-xl shadow-teal-200">
                  Join Virtual Clinic
                </button>
              </>
            )}
            
            {consultType === "whatsapp" && (
              <>
                <div className="w-24 h-24 bg-green-100 rounded-[32px] flex items-center justify-center text-green-600 mx-auto mb-8 shadow-2xl shadow-green-100">
                  <MessageSquare size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">WhatsApp Consult</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Click below to open WhatsApp and send your pre-filled symptom details to Dr. {selectedDoctor.name.split(' ')[0]}.</p>
                <a href={`https://wa.me/91${selectedDoctor.phone || "9999999999"}?text=Hello Dr. ${selectedDoctor.name}, I have confirmed a consultation via Svasthya Connect. My symptoms: ${problem}`}
                  target="_blank" rel="noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[2px] transition-all shadow-xl shadow-green-200">
                  Launch WhatsApp
                </a>
              </>
            )}

            {consultType === "inperson" && (
              <>
                <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-2xl shadow-blue-100">
                  <MapPin size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Clinic Visit Confirmed</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Your slot at <strong>{selectedDoctor.hospital}</strong> is reserved. Please arrive 10 minutes prior to your scheduled time.</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => navigate("/profile")} className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-gray-200">
                    My Appointments
                  </button>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${selectedDoctor.hospital}`} target="_blank" rel="noreferrer"
                    className="bg-white border-2 border-gray-100 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                    Get Directions
                  </a>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function CallScreen({ doctor, onEnd }) {
  const roomName = "SvasthyaConnect-" + doctor.name.replace(/\s+/g, "-") + "-" + Math.floor(Math.random()*1000)
  const jitsiUrl = "https://meet.jit.si/" + roomName
  return (
    <div className="min-h-screen bg-black flex flex-col animate-in fade-in duration-500">
      <div className="bg-gray-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-teal-900/50">
            {doctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none mb-1">{doctor.name}</p>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{doctor.speciality}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
            <Shield size={14} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">E2E Encrypted</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Live Session</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative bg-gray-900">
        {/* Placeholder background while iframe loads */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Establishing Connection</p>
        </div>
        <iframe src={jitsiUrl} className="absolute inset-0 w-full h-full z-10" allow="camera; microphone; fullscreen; display-capture" title="Video Consultation" />
      </div>

      <div className="bg-gray-900/80 backdrop-blur-md p-6 flex justify-center border-t border-white/5 relative z-50">
        <button onClick={onEnd} className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[2px] transition-all shadow-xl shadow-red-900/50 flex items-center gap-3">
          <Phone className="rotate-[135deg]" size={16} /> End Consultation
        </button>
      </div>
    </div>
  )
}

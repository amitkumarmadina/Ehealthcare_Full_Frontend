import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import HospitalCard from "../components/HospitalCard"
import { API_BASE_URL } from "../config/api"
import {
  Building2,
  Stethoscope,
  CalendarCheck2,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock,
  Video,
  PhoneCall,
  User,
  Star,
  Activity,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
  Sparkles
} from "lucide-react"

const API = API_BASE_URL
const SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
const todayStr = () => new Date().toISOString().split("T")[0]

export default function Appointment() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const token = localStorage.getItem("token")

  const [fromAI, setFromAI] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  // Data Lists & Pagination
  const [cities, setCities] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [hPage, setHPage] = useState(1)
  const [hPages, setHPages] = useState(1)
  const [hospitalsLoading, setHospitalsLoading] = useState(false)

  const [doctorsList, setDoctorsList] = useState([])
  const [dPage, setDPage] = useState(1)
  const [dPages, setDPages] = useState(1)
  const [doctorsLoading, setDoctorsLoading] = useState(false)

  // Selections
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedHospital, setSelectedHospital] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [consultType, setConsultType] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  // Patient Details
  const [patientData, setPatientData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    age: "",
    gender: "male"
  })

  const [validationError, setValidationError] = useState("")

  // PERSISTENCE LOGIC
  useEffect(() => {
    const saved = localStorage.getItem("pendingBooking")
    if (saved) {
      const data = JSON.parse(saved)
      if (data.fromAI) setFromAI(true)
      if (data.selectedCity) setSelectedCity(data.selectedCity)
      if (data.selectedHospital) setSelectedHospital(data.selectedHospital)
      if (data.selectedDoctor) setSelectedDoctor(data.selectedDoctor)
      if (data.consultType) setConsultType(data.consultType)
      if (data.date) setDate(data.date)
      if (data.time) setTime(data.time)
      if (data.patientData) setPatientData(data.patientData)
      if (data.currentStep) setCurrentStep(data.currentStep)
    }
  }, [])

  useEffect(() => {
    const bookingContext = {
      fromAI,
      selectedCity,
      selectedHospital,
      selectedDoctor,
      consultType,
      date,
      time,
      patientData,
      currentStep
    }
    localStorage.setItem("pendingBooking", JSON.stringify(bookingContext))
  }, [fromAI, selectedCity, selectedHospital, selectedDoctor, consultType, date, time, patientData, currentStep])

  // We now allow unauthenticated users to browse selection steps.
  // Auth check will happen right before final booking.

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API}/hospitals/cities`)
      setCities(res.data)
    } catch (err) { console.error("Error fetching cities", err) }
  }

  const fetchHospitals = async (page = 1) => {
    if (!selectedCity) return
    setHospitalsLoading(true)
    try {
      const res = await axios.get(`${API}/hospitals?city=${selectedCity}&page=${page}&limit=10`)
      setHospitals(res.data.hospitals)
      setHPages(res.data.pages)
      setHPage(page)
    } catch (err) { console.error("Error fetching hospitals", err) }
    finally { setHospitalsLoading(false) }
  }

  const fetchDoctors = async (page = 1) => {
    if (!selectedHospital) return
    setDoctorsLoading(true)
    try {
      const res = await axios.get(`${API}/doctors?hospital=${selectedHospital}&page=${page}&limit=10`)
      setDoctorsList(res.data.doctors)
      setDPages(res.data.pages)
      setDPage(page)
    } catch (err) { console.error("Error fetching doctors", err) }
    finally { setDoctorsLoading(false) }
  }

  useEffect(() => {
    if (location.state?.fromAI) {
      setFromAI(true)
      setSelectedDoctor(location.state.doctor)
      setSelectedCity(location.state.city)
      setSelectedHospital(location.state.hospital)
      setCurrentStep(3)
    } else {
      fetchCities()
    }
  }, [location.state])

  useEffect(() => {
    if (selectedCity && !fromAI) {
      fetchHospitals(1)
    }
  }, [selectedCity, fromAI])

  useEffect(() => {
    if (selectedHospital && !fromAI) {
      fetchDoctors(1)
    }
  }, [selectedHospital, fromAI])

  const handleNext = () => {
    setValidationError("")

    // Auth Check before final step (Step 5)
    if (currentStep === 4 && !token) {
      alert("Please login first to continue booking")
      localStorage.setItem("redirectAfterLogin", "/appointment")
      navigate("/login")
      return
    }

    if (currentStep === 1) {
      if (!selectedCity) return setValidationError("Please select a city")
      if (!selectedHospital) return setValidationError("Please select a hospital")
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!selectedDoctor) return setValidationError("Please select a doctor")
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (!date) return setValidationError("Please select a date")
      if (!time) return setValidationError("Please choose a time slot")
      if (!consultType) return setValidationError("Please select a mode of visit")
      setCurrentStep(4)
    } else if (currentStep === 4) {
      if (!patientData.name || !patientData.phone) return setValidationError("Please fill all patient details")
      setCurrentStep(5)
    }
  }

  const handleBack = () => {
    if (fromAI && currentStep === 3) return // Cannot go back beyond AI selection
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleBooking = async () => {
    if (!token) {
      setValidationError("Please login to complete your booking.")
      // Store intended path for redirect after login
      localStorage.setItem("redirectAfterLogin", "/appointment")

      setTimeout(() => {
        navigate("/login", { state: { from: "/appointment" } })
      }, 1500)
      return
    }

    setLoading(true)
    setError("")
    try {
      await axios.post(
        API + "/appointments",
        {
          patientName: patientData.name,
          patientPhone: patientData.phone,
          patientAge: patientData.age,
          patientGender: patientData.gender,
          city: selectedDoctor.city,
          hospital: selectedDoctor.hospital,
          speciality: selectedDoctor.speciality,
          doctorName: selectedDoctor.name,
          date,
          time,
          consultType,
          fee: selectedDoctor.fee,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      localStorage.removeItem("pendingBooking")
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <CheckCircle2 className="text-green-600 w-12 h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Success!</h2>
            <p className="text-gray-500 font-medium">Your appointment with Dr. {selectedDoctor?.name} is confirmed.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 text-left border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold uppercase">
                {selectedDoctor?.name?.[0]}
              </div>
              <div>
                <p className="font-black text-gray-900">{selectedDoctor?.name}</p>
                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{selectedDoctor?.speciality}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                <p className="text-sm font-bold text-gray-700">{date}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                <p className="text-sm font-bold text-gray-700">{time}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* STEPPER HEADER */}
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <ShieldCheck size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured Booking Flow</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Complete Your Booking</h1>

          <div className="relative pt-8">
            <div className="absolute top-[52px] left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>
            <div
              className="absolute top-[52px] left-0 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-700"
              style={{ width: `${((currentStep - (fromAI ? 3 : 1)) / (fromAI ? 2 : 4)) * 100}%` }}
            ></div>
            <div className="relative z-10 flex justify-between">
              {(fromAI ? [
                { step: 3, icon: Clock, label: "Schedule" },
                { step: 4, icon: User, label: "Patient" },
                { step: 5, icon: CreditCard, label: "Review" }
              ] : [
                { step: 1, icon: MapPin, label: "Facility" },
                { step: 2, icon: Stethoscope, label: "Doctor" },
                { step: 3, icon: Clock, label: "Schedule" },
                { step: 4, icon: User, label: "Patient" },
                { step: 5, icon: CreditCard, label: "Review" }
              ]).map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 ${currentStep >= s.step ? "bg-indigo-600 border-white text-white shadow-xl shadow-indigo-100" : "bg-white border-gray-100 text-gray-300"
                    }`}>
                    {currentStep > s.step ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= s.step ? "text-indigo-600" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden min-h-[500px] flex flex-col">

              <div className="p-10 flex-1 flex flex-col">

                {/* AI RECOMMENDED BANNER */}
                {fromAI && (
                  <div className="mb-8 bg-purple-50 border border-purple-100 p-4 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">AI Context Enabled</p>
                      <p className="text-xs font-bold text-gray-700">Booking with AI Recommended Doctor</p>
                    </div>
                  </div>
                )}

                {/* STEP 1: CITY & HOSPITAL SELECTION */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-black text-gray-900">Select City</h2>
                          <p className="text-xs font-medium text-gray-400">Where are you looking for healthcare?</p>
                        </div>
                        <select
                          value={selectedCity}
                          onChange={(e) => { setSelectedCity(e.target.value); setSelectedHospital(""); setSelectedDoctor(null); }}
                          className="bg-gray-50 border-2 border-transparent px-4 py-3 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Choose City</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    {selectedCity && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Hospitals in {selectedCity}</h3>
                          {hPages > 1 && (
                            <div className="flex gap-2">
                              <button disabled={hPage === 1} onClick={() => fetchHospitals(hPage - 1)} className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50"><ArrowLeft size={14} /></button>
                              <button disabled={hPage === hPages} onClick={() => fetchHospitals(hPage + 1)} className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50"><ChevronRight size={14} /></button>
                            </div>
                          )}
                        </div>

                        {hospitalsLoading ? (
                          <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finding Hospitals...</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hospitals.map(h => (
                              <HospitalCard
                                key={h._id}
                                hospital={h}
                                onSelect={(hospital) => { setSelectedHospital(hospital.name); setCurrentStep(2); }}
                                isSelected={selectedHospital === h.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: DOCTOR SELECTION */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-900">Choose your Specialist</h2>
                        <p className="text-gray-400 font-medium">Available doctors at {selectedHospital}.</p>
                      </div>
                      {dPages > 1 && (
                        <div className="flex gap-2">
                          <button disabled={dPage === 1} onClick={() => fetchDoctors(dPage - 1)} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all"><ArrowLeft size={18} /></button>
                          <button disabled={dPage === dPages} onClick={() => fetchDoctors(dPage + 1)} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all"><ChevronRight size={18} /></button>
                        </div>
                      )}
                    </div>

                    {doctorsLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finding Specialists...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doctorsList.length > 0 ? doctorsList.map(doc => (
                          <button
                            key={doc._id}
                            onClick={() => { setSelectedDoctor(doc); setCurrentStep(3); }}
                            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left group ${selectedDoctor?._id === doc._id ? "bg-gray-900 text-white border-gray-900 shadow-xl" : "bg-white border-gray-100 text-gray-700 hover:border-blue-200"
                              }`}
                          >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-50 group-hover:scale-105 transition-transform">
                              {doc.image ? (
                                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-black bg-indigo-50 text-indigo-600">
                                  {doc.name[0]}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-sm mb-0.5">{doc.name}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${selectedDoctor?._id === doc._id ? "text-indigo-400" : "text-indigo-600"}`}>{doc.speciality}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${selectedDoctor?._id === doc._id ? "text-gray-400" : "text-gray-400"}`}>₹{doc.fee}</span>
                                <span className="flex items-center gap-1 text-[9px] text-orange-400 font-black"><Star size={10} fill="currentColor" /> {doc.rating || "4.9"}</span>
                              </div>
                            </div>
                          </button>
                        )) : (
                          <div className="col-span-2 py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                            <Stethoscope className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-400 font-bold">No specialists found at this location.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: SCHEDULE & MODE */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900">Schedule Your Visit</h2>
                      <p className="text-gray-400 font-medium">Choose your preferred date, time and consultation mode.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Date</label>
                          <div className="relative group">
                            <input
                              type="date"
                              min={todayStr()}
                              value={date}
                              onChange={(e) => { setDate(e.target.value); setValidationError(""); }}
                              className="w-full bg-gray-50 border-2 border-transparent px-6 py-5 rounded-3xl font-bold text-gray-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none cursor-pointer"
                            />
                            <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-indigo-600" size={20} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consultation Mode</label>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: "inperson", icon: Building2, label: "In-Person Visit" },
                              { id: "video", icon: Video, label: "Video Consult" },
                              { id: "whatsapp", icon: PhoneCall, label: "Audio Consult" }
                            ].map(m => (
                              <button
                                key={m.id}
                                onClick={() => setConsultType(m.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${consultType === m.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-gray-100 text-gray-500 hover:border-blue-200"
                                  }`}
                              >
                                <m.icon size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">{m.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Slot</label>
                        <div className="grid grid-cols-2 gap-3">
                          {SLOTS.map(s => (
                            <button
                              key={s}
                              onClick={() => { setTime(s); setValidationError(""); }}
                              className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-tight border-2 transition-all ${time === s ? "bg-gray-900 text-white border-gray-900 shadow-lg" : "bg-white border-gray-100 text-gray-500 hover:border-indigo-400"
                                }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PATIENT DETAILS */}
                {currentStep === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900">Patient Information</h2>
                      <p className="text-gray-400 font-medium">Please provide the details of the person visiting the doctor.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          value={patientData.name}
                          onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                          placeholder="Enter patient's name"
                          className="w-full bg-gray-50 border-2 border-transparent px-6 py-5 rounded-3xl font-bold text-gray-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                          type="tel"
                          value={patientData.phone}
                          onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                          placeholder="Contact number"
                          className="w-full bg-gray-50 border-2 border-transparent px-6 py-5 rounded-3xl font-bold text-gray-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                        <input
                          type="number"
                          value={patientData.age}
                          onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                          placeholder="Years"
                          className="w-full bg-gray-50 border-2 border-transparent px-6 py-5 rounded-3xl font-bold text-gray-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                        <div className="flex gap-4">
                          {["male", "female", "other"].map(g => (
                            <button
                              key={g}
                              onClick={() => setPatientData({ ...patientData, gender: g })}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${patientData.gender === g ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-100 text-gray-400 hover:border-blue-200"
                                }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: REVIEW & PAYMENT */}
                {currentStep === 5 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900">Final Review</h2>
                      <p className="text-gray-400 font-medium">Review your details and proceed to secure payment.</p>
                    </div>

                    <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <User size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Patient</span>
                        </div>
                        <span className="font-bold text-gray-900">{patientData.name || "Guest User"}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <MapPin size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Consult Mode</span>
                        </div>
                        <span className="font-bold text-gray-900 capitalize">{consultType}</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <CalendarCheck2 size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</span>
                        </div>
                        <span className="font-bold text-gray-900">{date} at {time}</span>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-center gap-4">
                      <Lock className="text-indigo-600 shrink-0" size={24} />
                      <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
                        Your payment is secured with end-to-end encryption and verified by top medical associations.
                      </p>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="pt-10 mt-auto flex gap-4">
                  {currentStep > (fromAI ? 3 : 1) && (
                    <button
                      onClick={handleBack}
                      className="flex-1 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  )}
                  {currentStep < 5 ? (
                    <button
                      onClick={handleNext}
                      className="flex-[2] bg-indigo-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleBooking}
                      disabled={loading}
                      className="flex-[2] bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                      {loading ? "Processing..." : "Confirm & Pay Booking"}
                    </button>
                  )}
                </div>

                {validationError && (
                  <div className="mt-6 flex justify-center animate-in bounce-in">
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                      <AlertCircle size={14} /> {validationError}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-12">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 space-y-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking Summary</h3>

              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  {selectedDoctor?.image ? (
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-xl bg-indigo-50">
                      {selectedDoctor?.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-gray-900">{selectedDoctor?.name || "Dr. Loading..."}</h4>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">{selectedDoctor?.speciality}</p>
                  <div className="flex items-center gap-1 text-[10px] text-orange-400 font-black mt-1">
                    <Star size={10} fill="currentColor" /> {selectedDoctor?.rating || "4.9"}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">City</span>
                  <span className="text-xs font-black text-gray-900">{selectedCity || "Select City"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Hospital</span>
                  <span className="text-xs font-black text-gray-900 text-right">{selectedHospital || "Select Facility"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Consult Fee</span>
                  <span className="text-xs font-black text-gray-900">₹{selectedDoctor?.fee || "0"}</span>
                </div>
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-indigo-600" />
                    <span className="text-sm font-black text-gray-900">Total</span>
                  </div>
                  <span className="text-2xl font-black text-indigo-600">₹{selectedDoctor?.fee || "0"}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-indigo-600 rounded-[40px] text-white relative overflow-hidden shadow-xl shadow-blue-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Patient Support</p>
              <p className="text-sm font-bold leading-relaxed mb-6">Need help with your booking? Our medical team is online 24/7 to assist you.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <PhoneCall size={16} /> Contact Support
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

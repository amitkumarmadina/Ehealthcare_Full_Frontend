import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RegisterDoctor from "./pages/RegisterDoctor"
import Doctors from "./pages/Doctors"
import DoctorProfile from "./pages/DoctorProfile"
import Appointment from "./pages/Appointment"
import CancelBooking from "./pages/CancelBooking"
import Dashboard from "./pages/Dashboard"
import VideoConsult from "./pages/VideoConsult"
import AIRecommend from "./pages/AIRecommend"
import Profile from "./pages/Profile"
import NearbyServices from "./pages/NearbyServices"
import Medicines from "./pages/Medicines"
import Ambulance from "./pages/Ambulance"
import PrivacyPolicy from "./pages/legal/PrivacyPolicy"
import TermsOfService from "./pages/legal/TermsOfService"
import Disclaimer from "./pages/legal/Disclaimer"
import VoiceAssistant from "./components/VoiceAssistant"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerDoctor" element={<RegisterDoctor />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointments/:id/cancel" element={<ProtectedRoute><CancelBooking /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/video-consult" element={<VideoConsult />} />
        <Route path="/ai-recommend" element={<AIRecommend />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/nearby" element={<NearbyServices />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/ambulance" element={<Ambulance />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
      <VoiceAssistant />
    </Router>
  )
}

export default App

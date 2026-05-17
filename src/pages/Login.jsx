import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import axios from "axios"
import { getRedirectPath, clearRedirectPath, saveAuth } from "../utils/auth"
import { API_BASE_URL } from "../config/api"

// ── helpers ────────────────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateLogin(email, password) {
  const errs = {}
  if (!email.trim()) {
    errs.email = "Email is required"
  } else if (!emailRegex.test(email.trim())) {
    errs.email = "Enter a valid email address"
  }
  if (!password) {
    errs.password = "Password is required"
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters"
  }
  return errs
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/dashboard"

  // These store what the user types
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // For showing errors and loading state
  const [errors, setErrors]   = useState({})   // field-level errors
  const [error, setError]     = useState("")    // server error
  const [loading, setLoading] = useState(false)

  // Clear a single field error as the user starts correcting it
  const clearErr = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    // ── client-side validation ────────────────────────────────────────────
    const errs = validateLogin(email, password)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      // Call your backend login API
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      })

      // Backend sends back a token — save it in localStorage
      saveAuth({ token: res.data.token, user: res.data.user })

      // Also save user name so Dashboard can show it
      // Check for redirect path
      const redirectPath = getRedirectPath()
      
      if (redirectPath) {
        clearRedirectPath()
        navigate(redirectPath)
      } else {
        // Go to intended page or dashboard after successful login
        navigate(from)
      }

    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600">🩺 Svasthya Connect</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>

        {/* REDIRECT MESSAGE */}
        {location.state?.message && (
          <div className="bg-blue-50 border border-blue-300 text-blue-600 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
            <span className="animate-pulse text-lg">ℹ️</span>
            {location.state.message}
          </div>
        )}

        {/* SERVER ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearErr("email") }}
              placeholder="you@example.com"
              className={`w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none ${
                errors.email
                  ? "border-red-400 focus:border-red-400"
                  : "focus:border-teal-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearErr("password") }}
              placeholder="Enter your password"
              className={`w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none ${
                errors.password
                  ? "border-red-400 focus:border-red-400"
                  : "focus:border-teal-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* LINK TO REGISTER */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}

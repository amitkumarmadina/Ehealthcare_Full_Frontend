import { Navigate, useLocation } from "react-router-dom"
import { isAuthenticated, setRedirectPath } from "../utils/auth"

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    setRedirectPath(location.pathname)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, message: "Please login to continue" }}
      />
    )
  }

  return children
}

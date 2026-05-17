export const isAuthenticated = () => {
  const token = localStorage.getItem("token")

  if (!token || isTokenExpired(token)) {
    clearAuth()
    return false
  }

  return true
}

export const saveAuth = ({ token, user }) => {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}")
  } catch {
    return {}
  }
}

export const getAuthHeader = () => ({
  Authorization: "Bearer " + localStorage.getItem("token"),
})

export const setRedirectPath = (path) => {
  localStorage.setItem("redirectAfterLogin", path)
}

export const getRedirectPath = () => {
  return localStorage.getItem("redirectAfterLogin")
}

export const clearRedirectPath = () => {
  localStorage.removeItem("redirectAfterLogin")
}

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

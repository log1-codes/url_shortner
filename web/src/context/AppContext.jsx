import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AppContext = createContext(null)

const apiBase = '/api'

export function AppProvider({ children }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [token, setToken] = useState(
    localStorage.getItem('auth_token') || ''
  )
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(token)
  const totalRedirects = useMemo(
    () => links.reduce((sum, link) => sum + (link.clicks || 0), 0),
    [links]
  )

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const setAlert = useCallback((text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 5000)
  }, [])

  const signOut = useCallback((text = 'Signed out successfully') => {
    setToken('')
    navigate('/')
    setEmail('')
    setPassword('')
    setOriginalUrl('')
    setAlert(text)
  }, [navigate, setAlert])

  const apiRequest = useCallback(async (path, options = {}) => {
    const currentToken = localStorage.getItem('auth_token') || ''
    const currentAuthHeaders = currentToken ? { Authorization: `Bearer ${currentToken}` } : {}

    const response = await fetch(`${apiBase}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...currentAuthHeaders,
        ...options.headers
      },
      ...options
    })

    if (response.status === 401) {
      signOut('Session expired. Please log in again.')
      throw new Error('Unauthorized')
    }

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.error || 'Request failed')
    }

    return data
  }, [signOut])

  const fetchProfile = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiRequest('/me', { method: 'GET' })
      setProfile(data)
    } catch (err) {
      console.error(err)
    }
  }, [token, apiRequest])

  const fetchLinks = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiRequest('/links', { method: 'GET' })
      setLinks(data || [])
    } catch (err) {
      setAlert(err.message)
    }
  }, [token, apiRequest, setAlert])

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token)
      fetchProfile()
      fetchLinks()
    } else {
      localStorage.removeItem('auth_token')
      setProfile(null)
      setLinks([])
    }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = useCallback(async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      setAlert('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setToken(data.token)
      navigate('/dashboard')
      setAlert('Welcome back!')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }, [email, password, apiRequest, navigate, setAlert])

  const handleSignup = useCallback(async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      setAlert('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const data = await apiRequest('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setToken(data.token)
      navigate('/dashboard')
      setAlert('Account created successfully')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }, [email, password, apiRequest, navigate, setAlert])

  const handleCreateLink = useCallback(async () => {
    if (!originalUrl.trim()) {
      setAlert('Enter a URL to shorten')
      return
    }
    setLoading(true)
    try {
      const data = await apiRequest('/links/create', {
        method: 'POST',
        body: JSON.stringify({ original_url: originalUrl.trim() })
      })
      setLinks((current) => [data, ...current])
      setOriginalUrl('')
      setAlert('Link created successfully')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }, [originalUrl, apiRequest, setAlert])

  const value = {
    // State
    email,
    setEmail,
    password,
    setPassword,
    originalUrl,
    setOriginalUrl,
    message,
    setMessage,
    profile,
    links,
    token,
    loading,
    isAuthenticated,
    totalRedirects,

    // Actions
    setAlert,
    signOut,
    handleLogin,
    handleSignup,
    handleCreateLink,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

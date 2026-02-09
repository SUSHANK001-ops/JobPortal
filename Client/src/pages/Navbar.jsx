import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/authSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, data } = useSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const isProvider = data?.userRole === 'jobProvider'
  const dashboardPath = isProvider ? '/job-provider-dashboard' : '/dashboard'

  const handleLogout = () => {
    dispatch(logoutUser())
    setProfileOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const navLinkClass = (path) =>
    `relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive(path)
        ? 'text-[#132440] bg-[#132440]/5'
        : 'text-gray-600 hover:text-[#132440] hover:bg-gray-50'
    }`

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-linear-to-br from-[#132440] to-[#BF092F] rounded-xl flex items-center justify-center shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm">JP</span>
            </div>
            <span className="text-xl font-bold">
              <span className="text-blue-600">Job</span>
              <span className="text-red-500">Portal</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            {isAuthenticated && (
              <Link to={dashboardPath} className={navLinkClass(dashboardPath)}>Dashboard</Link>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-red-500 rounded-xl hover:from-blue-700 hover:to-red-600 shadow-lg shadow-blue-200 hover:shadow-red-200 transition-all">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isProvider ? 'bg-linear-to-br from-red-500 to-red-600' : 'bg-linear-to-br from-blue-500 to-blue-600'}`}>
                    <span className="text-white text-xs font-bold">{getInitials(data?.username)}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-none">{data?.username}</p>
                    <p className="text-xs text-gray-500 leading-tight mt-0.5">
                      {isProvider ? 'Job Provider' : 'Job Seeker'}
                    </p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{data?.username}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{data?.userEmail}</p>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded-md ${isProvider ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isProvider ? 'Job Provider' : 'Job Seeker'}
                      </span>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>
                    {isProvider && (
                      <Link
                        to="/create-job"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {mobileOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Home</Link>
            <Link to="/about" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>About</Link>
            {isAuthenticated && (
              <Link to={dashboardPath} className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive(dashboardPath) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Dashboard</Link>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-3">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">Sign In</Link>
                <Link to="/register" className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-red-500 rounded-xl hover:from-blue-700 hover:to-red-600 transition-all">Get Started</Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isProvider ? 'bg-linear-to-br from-red-500 to-red-600' : 'bg-linear-to-br from-blue-500 to-blue-600'}`}>
                    <span className="text-white text-sm font-bold">{getInitials(data?.username)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{data?.username}</p>
                    <p className="text-xs text-gray-500">{isProvider ? 'Job Provider' : 'Job Seeker'}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full text-center px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

import React, { useState } from 'react'
import { loginUser } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const result = await dispatch(
      loginUser({ userEmail: email, userPassword: password })
    )

    setSubmitting(false)

    if (result?.success) {
      if (result.userRole === 'jobProvider') {
        navigate('/job-provider-dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-linear-to-br from-[#132440] to-[#BF092F] rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="text-white font-bold text-xl">JP</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" size="small" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 text-white font-semibold rounded-xl bg-linear-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#132440] font-medium hover:text-[#BF092F]">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

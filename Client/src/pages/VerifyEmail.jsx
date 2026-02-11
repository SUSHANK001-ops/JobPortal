import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { verifyOtp } from '../api'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please try again.')
      navigate('/register')
    }
  }, [email, navigate])

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await verifyOtp(email, otp)
      toast.success(response.message || 'Email Verified Successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-[#132440] to-[#BF092F] rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="text-white font-bold text-xl">JP</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-500 mt-1">We've sent an OTP to {email}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 text-white font-semibold rounded-xl bg-linear-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Didn't get an OTP?{' '}
          <Link to="/register" className="text-[#132440] font-medium hover:text-[#BF092F]">
            Try again
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../api'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await forgotPassword(email)
      toast.success(response.message || 'OTP sent to your email')
      // Navigate to reset password page and pass email as state
      navigate('/reset-password', { state: { email } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
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
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-gray-500 mt-1">Enter your email to receive an OTP</p>
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 text-white font-semibold rounded-xl bg-linear-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{' '}
          <Link to="/login" className="text-[#132440] font-medium hover:text-[#BF092F]">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword

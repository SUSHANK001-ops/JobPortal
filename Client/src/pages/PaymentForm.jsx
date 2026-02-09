import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { initiatePayment } from '../api'
import { toast } from 'react-toastify'

const PaymentForm = () => {
  const navigate = useNavigate()
  const { data } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    productName: '',
    customerName: data?.username || '',
    customerEmail: data?.userEmail || '',
    customerPhone: '',
    paymentGateway: 'esewa',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.amount || !form.productName || !form.customerName || !form.customerEmail || !form.customerPhone) {
      toast.error('Please fill all fields')
      return
    }

    if (Number(form.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    try {
      setLoading(true)
      const productId = `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      await initiatePayment({
        amount: Number(form.amount),
        productId,
        productName: form.productName,
        paymentGateway: form.paymentGateway,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
      })
      // If initiatePayment doesn't redirect (shouldn't happen), fallback
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Payment initiation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#132440] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Make a Payment</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to proceed with payment</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Payment Gateway Selection */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Gateway</h2>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  form.paymentGateway === 'esewa'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentGateway"
                  value="esewa"
                  checked={form.paymentGateway === 'esewa'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                  form.paymentGateway === 'esewa' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                }`}>
                  e
                </div>
                <span className={`font-semibold ${form.paymentGateway === 'esewa' ? 'text-green-700' : 'text-gray-700'}`}>
                  eSewa
                </span>
                {form.paymentGateway === 'esewa' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>

              <label
                className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  form.paymentGateway === 'khalti'
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentGateway"
                  value="khalti"
                  checked={form.paymentGateway === 'khalti'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                  form.paymentGateway === 'khalti' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'
                }`}>
                  K
                </div>
                <span className={`font-semibold ${form.paymentGateway === 'khalti' ? 'text-purple-700' : 'text-gray-700'}`}>
                  Khalti
                </span>
                {form.paymentGateway === 'khalti' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (NPR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs.</span>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="1"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#132440]/20 focus:border-[#132440] outline-none transition-all text-lg font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product / Service Name</label>
                <input
                  type="text"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="e.g. Job Posting Fee, Premium Plan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#132440]/20 focus:border-[#132440] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#132440]/20 focus:border-[#132440] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#132440]/20 focus:border-[#132440] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#132440]/20 focus:border-[#132440] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="p-6 bg-gray-50">
            {form.amount && (
              <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">Rs. {Number(form.amount || 0).toLocaleString()}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-lg transition-all disabled:opacity-50 ${
                form.paymentGateway === 'khalti'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:shadow-purple-200'
                  : 'bg-gradient-to-r from-green-600 to-green-500 hover:shadow-lg hover:shadow-green-200'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Pay with {form.paymentGateway === 'khalti' ? 'Khalti' : 'eSewa'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm

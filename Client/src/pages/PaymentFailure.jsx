import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { APIAuthenticatedClient } from '../api'

const PaymentFailure = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    const updateFailedStatus = async () => {
      try {
        const productId = searchParams.get('product_id') || searchParams.get('purchase_order_id') || ''
        const pidx = searchParams.get('pidx') || ''

        if (productId) {
          await APIAuthenticatedClient.post('/payments/payment-status', {
            product_id: productId,
            pidx: pidx || productId,
            status: 'FAILED',
          })
        }
        setUpdated(true)
      } catch (error) {
        console.error('Error updating failed status:', error)
        setUpdated(true)
      }
    }

    updateFailedStatus()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-6">
          Your payment could not be processed. No amount has been deducted from your account.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 font-medium">
            If any amount was deducted, it will be refunded within 3-5 business days.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-2)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#132440] to-[#BF092F] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailure

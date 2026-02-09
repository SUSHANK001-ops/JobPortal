import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { APIAuthenticatedClient } from '../api'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying | success | failed
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // eSewa returns data as base64 encoded JSON in 'data' query param
        const esewaData = searchParams.get('data')
        // Khalti returns pidx, transaction_id, etc.
        const pidx = searchParams.get('pidx')
        const purchaseOrderId = searchParams.get('purchase_order_id')
        const transactionId = searchParams.get('transaction_id')

        let product_id = ''
        let paymentPidx = ''

        if (esewaData) {
          // Decode eSewa base64 response
          const decoded = JSON.parse(atob(esewaData))
          product_id = decoded.transaction_uuid
        } else if (pidx) {
          // Khalti callback
          product_id = purchaseOrderId || ''
          paymentPidx = pidx
        }

        if (!product_id) {
          setStatus('failed')
          setMessage('Invalid payment response. No transaction ID found.')
          return
        }

        const response = await APIAuthenticatedClient.post('/payments/payment-status', {
          product_id,
          pidx: paymentPidx || product_id,
          status: 'SUCCESS',
        })

        if (response.data.status === 'COMPLETED') {
          setStatus('success')
          setMessage('Payment completed successfully!')
        } else {
          setStatus('failed')
          setMessage('Payment verification failed. Please contact support.')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        setMessage(error.response?.data?.message || 'Payment verification failed.')
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
            <p className="text-gray-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-700 font-medium">
                Your transaction has been verified and recorded.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#132440] to-[#3B9797] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Back to Home
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-700 mb-2">Verification Issue</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#132440] to-[#BF092F] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './Home'
import About from './About'
import Register from './pages/Register'
import Login from './pages/Login'
import JobProviderDashboard from './pages/JobProviderDashboard'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import Navbar from './pages/Navbar'
import JobCreateForm from './pages/JobCreateForm'
import SingleJob from './pages/SingleJob'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import PaymentForm from './pages/PaymentForm'

import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, data } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(data?.userRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

// Guest-only route (redirect if logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, data } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to={data?.userRole === 'jobProvider' ? '/job-provider-dashboard' : '/dashboard'} replace />
  }

  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/verify-email" element={<GuestRoute><VerifyEmail /></GuestRoute>} />
          <Route
            path="/job-provider-dashboard"
            element={
              <ProtectedRoute allowedRoles={['jobProvider']}>
                <JobProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['jobSeeker']}>
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-job"
            element={
              <ProtectedRoute allowedRoles={['jobProvider']}>
                <JobCreateForm />
              </ProtectedRoute>
            }
          />
          <Route path="/jobgetbyid/:id" element={<SingleJob />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={['jobProvider', 'jobSeeker']}>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  )
}

export default App

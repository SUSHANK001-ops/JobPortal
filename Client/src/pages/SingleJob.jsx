import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { apiClient, APIAuthenticatedClient } from '../api'
import { toast } from 'react-toastify'

const SingleJob = () => {
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applications, setApplications] = useState([])
  const [myApplication, setMyApplication] = useState(null)
  const [loadingApps, setLoadingApps] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, data } = useSelector((state) => state.auth)
  const isSeeker = data?.userRole === 'jobSeeker'
  const isProvider = data?.userRole === 'jobProvider'

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/jobs/jobgetbyid/${id}`)
      setJob(response.data.data)
    } catch (err) {
      console.error('Error fetching job details:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return // Guard against undefined id
    
    fetchJobDetails()
    if (isAuthenticated && isSeeker) {
      checkIfApplied()
    }
    if (isProvider) {
      fetchJobApplications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, isSeeker, isProvider])

  const checkIfApplied = async () => {
    try {
      const response = await APIAuthenticatedClient.get('/applications/myapplications')
      const apps = response.data.applications || []
      const myApp = apps.find((app) => app.jobId === id || app.jobId === id)
      if (myApp) {
        setApplied(true)
        setMyApplication(myApp)
      }
    } catch {
      // silently fail
    }
  }

  const fetchJobApplications = async () => {
    try {
      setLoadingApps(true)
      const response = await APIAuthenticatedClient.get('/applications/getapplications')
      const apps = response.data.applications || []
      const jobApps = apps.filter((app) => String(app.jobId) === String(id))
      setApplications(jobApps)
    } catch (err) {
      console.error('Error fetching job applications:', err)
    } finally {
      setLoadingApps(false)
    }
  }

  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return
    try {
      await APIAuthenticatedClient.delete(`/applications/applicationdelete/${appId}`)
      toast.success('Application withdrawn!')
      setMyApplication(null)
      setApplied(false)
      fetchJobApplications()
    } catch {
      toast.error('Failed to withdraw application')
    }
  }

  const handleDeleteApplicationAsProvider = async (appId) => {
    if (!window.confirm('Remove this applicant from the job?')) return
    try {
      await APIAuthenticatedClient.delete(`/applications/applicationdelete/${appId}`)
      toast.success('Applicant removed!')
      fetchJobApplications()
    } catch {
      toast.error('Failed to remove applicant')
    }
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to apply for this job')
      navigate('/login')
      return
    }
    if (isProvider) {
      toast.error('Only job seekers can apply for jobs')
      return
    }
    try {
      setApplying(true)
      await APIAuthenticatedClient.post(`/applications/applicationcreate/${id}`)
      setApplied(true)
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Job not found</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#132440] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-[#132440] via-[#3B9797] to-[#BF092F] px-8 py-8 text-white">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-2xl">
                  {job.jobCompany?.[0]?.toUpperCase() || 'J'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{job.jobTitle}</h1>
                <p className="text-blue-100 mt-1 text-lg">{job.jobCompany}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            {/* Meta cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-[#132440]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#132440]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm font-semibold text-gray-800">{job.jobLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Salary</p>
                  <p className="text-sm font-semibold text-green-700">Rs. {Number(job.jobSalary).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Type</p>
                  <p className="text-sm font-semibold text-gray-800">Full Time</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.jobDescription}
              </p>
            </div>

            {/* Apply Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isProvider ? (
                <div className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                  </svg>
                  You are a Job Provider
                </div>
              ) : applied ? (
                <div className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-50 text-green-700 rounded-xl font-semibold border border-green-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Already Applied
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-[#132440] to-[#BF092F] text-white rounded-xl font-semibold hover:shadow-lg shadow-lg transition-all disabled:opacity-50"
                >
                  {applying ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Applying...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Apply Now
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Browse More Jobs
              </button>
            </div>

            {/* Provider View - Applications Section */}
            {isProvider && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications ({applications.length})</h2>
                {loadingApps ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-[#132440]/20 border-t-[#132440] rounded-full animate-spin"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-600 font-medium">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-linear-to-br from-[#132440] to-[#BF092F] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {app.User?.firstName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {app.User?.firstName} {app.User?.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{app.User?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-13">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              app.status === 'applied'
                                ? 'bg-blue-100 text-blue-700'
                                : app.status === 'in_review'
                                ? 'bg-yellow-100 text-yellow-700'
                                : app.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteApplicationAsProvider(app.id)}
                          className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Job Seeker View - My Application Status */}
            {isSeeker && applied && myApplication && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Application Status</h2>
                <div className="bg-linear-to-br from-[#132440]/5 to-[#3B9797]/5 border border-[#3B9797]/20 rounded-xl p-6\">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Application Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                          myApplication.status === 'applied'
                            ? 'bg-blue-100 text-blue-700'
                            : myApplication.status === 'in_review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : myApplication.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {myApplication.status.charAt(0).toUpperCase() + myApplication.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Applied On</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(myApplication.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWithdrawApplication(myApplication.id)}
                    className="w-full mt-4 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                  >
                    Withdraw Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleJob

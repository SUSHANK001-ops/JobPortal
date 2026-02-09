import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { APIAuthenticatedClient, apiClient } from '../api'
import { toast } from 'react-toastify'

const JobSeekerDashboard = () => {
  const navigate = useNavigate()
  const { data } = useSelector((state) => state.auth)
  const [jobs, setJobs] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [appLoading, setAppLoading] = useState(true)
  const [applyingId, setApplyingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('browse')

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/jobs/jobs')
      setJobs(response.data.data || [])
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyApplications = async () => {
    try {
      setAppLoading(true)
      const response = await APIAuthenticatedClient.get('/applications/myapplications')
      setMyApplications(response.data.applications || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setAppLoading(false)
    }
  }

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId)
      await APIAuthenticatedClient.post(`/applications/applicationcreate/${jobId}`)
      toast.success('Application submitted successfully!')
      fetchMyApplications()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply'
      toast.error(msg)
    } finally {
      setApplyingId(null)
    }
  }

  const handleWithdraw = async (applicationId) => {
    try {
      await APIAuthenticatedClient.delete(`/applications/applicationdelete/${applicationId}`)
      toast.success('Application withdrawn')
      fetchMyApplications()
    } catch {
      toast.error('Failed to withdraw application')
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchMyApplications()
  }, [])

  const appliedJobIds = myApplications.map((app) => app.jobId)

  const filteredJobs = jobs?.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      label: 'Available Jobs',
      value: jobs.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'from-[#132440] to-[#3B9797]',
    },
    {
      label: 'Applied',
      value: myApplications.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'from-[#BF092F] to-[#BF092F]/80',
    },
    {
      label: 'In Review',
      value: myApplications.filter((a) => a.status === 'in_review').length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'from-[#132440] to-[#BF092F]',
    },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      applied: 'bg-blue-50 text-blue-700 border-blue-200',
      in_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    }
    const labels = {
      applied: 'Applied',
      in_review: 'In Review',
      accepted: 'Accepted',
      rejected: 'Rejected',
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${styles[status] || styles.applied}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome, {data?.username || 'Job Seeker'} 👋
              </h1>
              <p className="text-gray-500 mt-1">Find and apply for your dream job</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-linear-to-br ${stat.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'browse'
                ? 'bg-white text-[#132440] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'applied'
                ? 'bg-white text-[#132440] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Applications ({myApplications.length})
          </button>
        </div>

        {/* Browse Jobs Tab */}
        {activeTab === 'browse' && (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="flex items-center bg-white rounded-xl border border-gray-200 px-4 py-2.5 max-w-md shadow-sm">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4">Loading jobs...</p>
              </div>
            ) : filteredJobs?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">No jobs found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs?.map((job) => {
                  const isApplied = appliedJobIds.includes(job.id)
                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#3B9797] transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-[#132440]/10 to-[#3B9797]/10 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-[#132440] font-bold text-lg">
                            {job.jobCompany?.[0]?.toUpperCase() || 'J'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-[#132440] transition-colors">
                            {job.jobTitle}
                          </h3>
                          <p className="text-sm text-gray-500">{job.jobCompany}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mt-3 line-clamp-2">
                        {job.jobDescription}
                      </p>

                      <div className="flex items-center justify-between mt-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.jobLocation}
                        </span>
                        <span className="font-bold text-green-600">
                          Rs. {Number(job.jobSalary).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/jobgetbyid/${job.id}`)}
                          className="flex-1 py-2.5 text-sm font-medium text-[#132440] bg-[#132440]/5 rounded-xl hover:bg-[#132440]/10 transition-all text-center"
                        >
                          View Details
                        </button>
                        {isApplied ? (
                          <button
                            disabled
                            className="flex-1 py-2.5 text-sm font-medium text-green-700 bg-green-50 rounded-xl cursor-not-allowed text-center"
                          >
                            ✓ Applied
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApply(job.id)}
                            disabled={applyingId === job.id}
                            className="flex-1 py-2.5 text-sm font-medium text-white bg-linear-to-r from-[#132440] to-[#BF092F] rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-center"
                          >
                            {applyingId === job.id ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                                Applying...
                              </span>
                            ) : (
                              'Apply Now'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* My Applications Tab */}
        {activeTab === 'applied' && (
          <>
            {appLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4">Loading applications...</p>
              </div>
            ) : myApplications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Start browsing and apply to jobs you like</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-[#132440] text-white rounded-xl font-medium hover:bg-[#132440]/90 transition-all"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId)
                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-linear-to-br from-[#132440]/10 to-[#3B9797]/10 rounded-xl flex items-center justify-center shrink-0">
                            <span className="text-[#132440] font-bold text-lg">
                              {job?.jobCompany?.[0]?.toUpperCase() || 'J'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {job?.jobTitle || 'Job Title'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {job?.jobCompany || 'Company'} • {job?.jobLocation || 'Location'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-gray-400">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                          {app.status === 'applied' && (
                            <button
                              onClick={() => handleWithdraw(app.id)}
                              className="text-sm text-[#BF092F] hover:text-[#BF092F]/80 font-medium transition-colors"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JobSeekerDashboard

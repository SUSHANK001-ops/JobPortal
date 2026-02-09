import React, { useEffect, useState } from 'react'
import { apiClient } from './api'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/jobs/jobs')
      setJobs(response.data.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (id) => {
    navigate(`/jobgetbyid/${id}`)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const filteredJobs = jobs?.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-[#132440] via-[#3B9797] to-[#BF092F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Find Your <span className="text-[#3B9797]">Dream Job</span> Today
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              Discover opportunities from top companies. Your next career move starts here.
            </p>
            {/* Search Bar */}
            <div className="mt-8 flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 max-w-xl mx-auto">
              <svg className="w-5 h-5 text-[#3B9797] ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs by title, company or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-blue-200 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Latest Openings</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredJobs?.length || 0} jobs available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading jobs...</p>
          </div>
        ) : filteredJobs?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No jobs found</h3>
            <p className="text-gray-500">Try a different search term or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs?.map((job) => (
              <div
                key={job.id}
                onClick={() => handleNavigate(job.id)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
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

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.jobLocation}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    Rs. {Number(job.jobSalary).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-br from-[#132440] to-[#BF092F] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">About JobPortal</h1>
          <p className="mt-4 text-lg text-[#3B9797]/80">
            Connecting talented professionals with amazing opportunities
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              JobPortal is dedicated to bridging the gap between job seekers and employers.
              We provide a seamless platform where companies can post job openings and
              talented individuals can discover their next career opportunity.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">For Job Seekers</h2>
            <p className="text-gray-600 leading-relaxed">
              Browse through hundreds of job listings, filter by location and company,
              and apply with just one click. Track your applications and get notified
              about status updates.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">For Employers</h2>
            <p className="text-gray-600 leading-relaxed">
              Post job listings, manage applications, and find the perfect candidate
              for your team. Our dashboard gives you full control over your hiring process.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

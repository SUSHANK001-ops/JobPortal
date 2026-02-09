import React from 'react'
import { useNavigate } from 'react-router-dom';

const JobProviderDashboard = () => {
  const navigate = useNavigate();
  const handleCreate = () => {
   navigate("/create-job");
  }
  return (
    <div>
       <div className="min-h-screen bg-gray-100 p-6">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-800">Job Provider Dashboard</h1>
    <button onClick={handleCreate} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
      + Create Job
    </button>
  </div>
  {/* Job Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold">Frontend Developer</h2>
      <p className="text-sm text-gray-500 mt-1">ABC Company</p>
      <p className="text-gray-600 text-sm mt-3">
        React developer with Tailwind CSS experience.
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">📍 Kathmandu</span>
        <span className="text-sm font-semibold text-green-600">Rs. 80,000</span>
      </div>
      <div className="flex gap-3 mt-4">
        <button className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">
          Edit
        </button>
        <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default JobProviderDashboard


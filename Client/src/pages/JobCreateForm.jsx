import React from 'react'
import { APIAuthenticatedClient } from '../api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const JobCreateForm = () => {

    const [compnayName, setCompanyName] = React.useState('');
    const [jobTitle, setJobTitle] = React.useState('');
    const [jobDescription, setJobDescription] = React.useState('');
    const [jobLocation, setJobLocation] = React.useState('');
    const [jobSalary, setJobSalary] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const jobData = {
        jobCompany: compnayName,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        jobLocation: jobLocation,
        jobSalary: jobSalary
      };

      const response = await APIAuthenticatedClient.post("/jobs/createjob", jobData);
      console.log("Job creation response:", response);
      
      if(response.status === 201){
        toast.success("Job created successfully!");
        navigate("/job-provider-dashboard");

      }
    } catch(error) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job. Please try again.");
      setIsLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow">
    <h2 className="text-2xl font-bold mb-6 text-center">Create Job</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Frontend Developer" />
      </div>
      {/* Company */}
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input value={compnayName} onChange={(e) => setCompanyName(e.target.value)} type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="ABC Pvt. Ltd." />
      </div>
      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Job Description</label>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Describe job role..." />
      </div>
      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">Job Location</label>
        <input value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Kathmandu" />
      </div>
      {/* Salary */}
      <div>
        <label className="block text-sm font-medium mb-1">Salary</label>
        <input value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder={80000} />
      </div>
      {/* Submit */}
      <button type="submit" disabled={isLoading} className="w-full bg-linear-to-r from-[#132440] to-[#BF092F] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Creating Job...
          </>
        ) : (
          'Create Job'
        )}
      </button>
    </form>
  </div>
</div>


  )
}

export default JobCreateForm

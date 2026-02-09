import React from 'react'
import { APIAuthenticatedClient } from '../api';
import { useNavigate } from 'react-router-dom';
const JobCreateForm = () => {

    const [compnayName, setCompanyName] = React.useState('');
    const [jobTitle, setJobTitle] = React.useState('');
    const [jobDescription, setJobDescription] = React.useState('');
    const [jobLocation, setJobLocation] = React.useState('');
    const [jobSalary, setJobSalary] = React.useState('');
    const navigate = useNavigate();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
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
        alert("Job created successfully");
        navigate("/");

      }
    } catch(error) {
      console.error("Error creating job:", error);
      alert(error.response?.data?.message || "Failed to create job. Please try again.");
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
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
        Create Job
      </button>
    </form>
  </div>
</div>


  )
}

export default JobCreateForm

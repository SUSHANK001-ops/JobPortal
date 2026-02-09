import React, { useEffect, useState } from 'react'
import About from './About'
import { apiClient } from './api';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async() => {
    try{
      const response = await apiClient.get("/jobs/jobs");
      console.log("Jobs fetched:", response.data.data);

      setJobs(response.data.data);
    } catch(error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs. Please try again.");
    }
  }

  const handleNavigate = (id) => {
    navigate(`/jobgetbyid/${id}`);
  } 

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
   
    <div className="bg-white flex gap-4 p-5 mt-6 rounded-xl shadow">
      {jobs?.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (jobs?.map((job)=>{
        return(
          <>
       <div key={job._id} className="bg-white p-5 rounded-xl mt-3 shadow mb-6">
      <h2 className="text-lg font-semibold">{job.jobTitle}</h2>
      <p className="text-sm text-gray-500 mt-1">{job.jobCompany}</p>
      <p className="text-gray-600 text-sm mt-3">
        {job.jobDescription}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">📍 {job.jobLocation}</span>
        <span className="text-sm font-semibold text-green-600">Rs. {job.jobSalary}</span>

      </div>
              <button className='bg-blue-200 rounded-2xl p-2' onClick={() => handleNavigate(job.id)} >View Details</button>
    </div>    
          </>

        )
      }))}
     
      
     

  </div>
  )
}


export default Home

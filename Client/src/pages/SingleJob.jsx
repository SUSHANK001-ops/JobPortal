import React from 'react'
import { useParams } from 'react-router-dom';
import { apiClient } from '../api';

const SingleJob = () => {
    const [job, setJob] = React.useState({});
    const {id} = useParams();
    
    const fetchJobDetails = async() => {
        try {
            const response = await apiClient.get(`/jobs/jobgetbyid/${id}`);
            console.log("Job details fetched:", response.data.data);
            setJob(response.data.data);
        } catch(error) {
            console.error("Error fetching job details:", error);
            alert("Failed to fetch job details. Please try again.");
        }
    }

    React.useEffect(() => {
        fetchJobDetails();
    }, [id]);


  return (
    <div>
         
      <h2 className="text-lg font-semibold">JobTitle: {job.jobTitle}</h2>
      <p className="text-sm text-gray-500 mt-1">Company: {job.jobCompany}</p>
      <p className="text-gray-600 text-sm mt-3">
        {job.jobDescription}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">📍 Location: {job.jobLocation}</span>
        <span className="text-sm font-semibold text-green-600">Rs. Salary {job.jobSalary}</span>

      </div>
              <button className='bg-blue-200 rounded-2xl p-2'>Apply Job</button>
    </div>    

  )
}

export default SingleJob

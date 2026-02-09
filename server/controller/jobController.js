const { Job, User } = require("../model")



const createJob = async (req, res) => {
    const { jobTitle, jobDescription, jobLocation, jobSalary, jobCompany } = req.body
    const userId = req.user.id
    if (!jobTitle || !jobDescription || !jobLocation || !jobSalary || !jobCompany) {
        return res.status(400).json({ message: "All fields are required" })
    }
   await Job.create({
        jobTitle,
        jobDescription,
        jobLocation,
        jobSalary,
        jobCompany,
        userId
    })
    
    res.status(201).json({
        message: "job created successfully",
    })
}
// get all jobs

const getAllJobs = async (req, res)=>{
    const jobs = await Job.findAll({
        include: {
            model: User,
            attributes: ["id", "username", "userEmail"]
        }
    });
    
    if(jobs.length === 0){
        return res.status(404).json({
            message: "No jobs available"
        })
    }
    
    res.status(200).json({
        data: jobs
    })
}


const getJobById = async (req, res) => {
    const jobId = req.params.id;

    const job = await Job.findByPk(jobId, {
        include: {
            model: User,
            attributes: ["id", "username", "userEmail"]
        }
    });

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    res.status(200).json({
        data: job
    });
}


module.exports = {
    createJob,
    getAllJobs,
    getJobById

}
const Application = require("../model/ApplicatinModel");


const jobApply=async (req,res)=>{
   const {jobId}=req.params;
   const userId=req.user.id;
  console.log(req.user.id);
//    const {status}=req.body;

if(req.user.userRole=="jobProvider"){
    return res.status(400).json({
        message:"Only job seeker can apply for job"
    })
}
   const application= await Application.create({
    jobId: jobId,
    userId: userId,
   })
    return res.status(200).json({
        message:"job applied successfully",
        application
    })
}


const getApplications=async (req,res)=>{
    const userId=req.user.id;
    const Job = require("../model/JobModel");
    const User = require("../model/UserModel");
    
    // Get all jobs posted by this provider
    const jobs = await Job.findAll({
        where: {
            userId: userId
        }
    });

    if(!jobs || jobs.length === 0){
        return res.status(200).json({
            message:"No jobs found",
            applications: []
        })
    }

    const jobIds = jobs.map(job => job.id);
    
    // Get applications for these jobs
    const applications= await Application.findAll({
        where: {
            jobId: jobIds
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
        }]
    });
    
    if(!applications){
        return res.status(200).json({
            message:"No applications found",
            applications: []
        })
    }

    return res.status(200).json({
        message:"Applications fetched successfully",
        applications
    })
}


const updateApplicationStatus=async (req,res)=>{
    const {id}=req.params;
   
    const {status}=req.body;

    const application= await Application.findByPk(id);
   
    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    const updatedApplication= await Application.update({
        status:status
    },{
        where:{
            id:id
        }
    })

    return res.status(200).json({
        message:"Application status updated successfully",
        updatedApplication
    })
}


const deleteApplication=async (req,res)=>{
    const {id}=req.params;
    const userId=req.user.id;
    const userRole=req.user.userRole;
    
    const application= await Application.findByPk(id);

    if(!application){
        return res.status(404).json({
            message:"Application not found"
        })
    }

    // Allow deletion by job seeker (own application) or job provider (application to their job)
    if(userRole === "jobSeeker" && application.userId !== userId){
        return res.status(403).json({
            message:"You can only delete your own applications"
        })
    }

    if(userRole === "jobProvider"){
        const Job = require("../model/JobModel");
        const job = await Job.findByPk(application.jobId);
        if(!job || job.userId !== userId){
            return res.status(403).json({
                message:"You can only remove applications from your own jobs"
            })
        }
    }

    await Application.destroy({
        where:{
            id:id
        }
    })

    return res.status(200).json({
        message:"Application deleted successfully"
    })
}

const myApplications=async (req,res)=>{
    const userId=req.user.id;

    const applications= await Application.findAll({
        where:{
            userId:userId
        },
        include: [{
            model: require("../model/JobModel"),
            attributes: ['id', 'jobTitle', 'jobCompany', 'jobLocation', 'jobSalary']
        }]
    })

    return res.status(200).json({
        message:"My applications fetched successfully",
        applications
    })

}

module.exports={jobApply, updateApplicationStatus, deleteApplication, getApplications, myApplications};

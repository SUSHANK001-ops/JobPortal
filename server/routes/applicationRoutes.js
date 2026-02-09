const { jobApply, updateApplicationStatus, deleteApplication, getApplications, myApplications } = require('../controller/applicationController');
const { isAuthenticated, checkUserRole } = require('../middlewares/userMiddleware');
const { asyncError } = require('../services/asyncErrro');


const router = require('express').Router();


router.post("/applicationcreate/:jobId",isAuthenticated,checkUserRole("jobSeeker"), asyncError(jobApply))
router.patch("/applicationupdate/:id", isAuthenticated, checkUserRole("jobProvider"), asyncError(updateApplicationStatus))
router.delete("/applicationdelete/:id", isAuthenticated, checkUserRole("jobSeeker"), asyncError(deleteApplication))
router.get("/getapplications", isAuthenticated, checkUserRole("jobProvider"), asyncError(getApplications))
router.get("/myapplications", isAuthenticated, checkUserRole("jobSeeker"), asyncError(myApplications))
module.exports = router;
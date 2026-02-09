const { createJob, getAllJobs, getJobById } = require('../controller/jobController');
const { isAuthenticated, checkUserRole } = require('../middlewares/userMiddleware');
const { asyncError } = require('../services/asyncErrro');


const router = require('express').Router();

// router.route("/job").post(createJob)
router.post("/createjob", isAuthenticated, checkUserRole("jobProvider"), asyncError(createJob))
router.get("/jobs", asyncError(getAllJobs))
router.get("/jobgetbyid/:id", asyncError(getJobById))

module.exports = router;
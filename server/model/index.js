const Application = require("./ApplicatinModel");
const Job = require("./JobModel");
const User = require("./UserModel");


// Relationships between User and Job
User.hasMany(Job, { foreignKey: 'userId'});
Job.belongsTo(User, { foreignKey: 'userId'});

// Relationship between Application and User
User.hasMany(Application, {foreignKey: 'userId'})
Application.belongsTo(User, {foreignKey: 'userId'});

// Relatiionship betweeen Application and job
Job.hasMany(Application, {foreignKey: "jobId"})
Application.belongsTo(Job, {foreignKey: "jobId"})


module.exports = {User, Job}
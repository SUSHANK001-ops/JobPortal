const {DataTypes}= require('sequelize');
const { sequelize } = require('../database/dbConfig');

const Job = sequelize.define("Job", {
    id: {
        type: DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobDescription: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    jobLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobSalary: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    jobCompany:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Job;  
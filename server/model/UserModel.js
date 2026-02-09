const {DataTypes}= require('sequelize');
const { sequelize } = require('../database/dbConfig');

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRole:{
        type: DataTypes.ENUM("jobSeeker", "jobProvider"),
        allowNull: false,
        defaultValue: "jobSeeker"
    }
})

module.exports = User;
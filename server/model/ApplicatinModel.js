const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/dbConfig');



const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    status: {
        type: DataTypes.ENUM("applied", "in_review", "accepted", "rejected"),
        defaultValue: 'applied'
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    jobId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}) 
// kosle apply garo (user)
// kun job ma apply garo

module.exports = Application;
const express = require('express');
const app = express();
const cors = require('cors');

// Dotenv configuration
require('dotenv').config();

// parse json data
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(express.urlencoded({ extended: true }))

// Db connection
const { connectDB } = require('./database/dbConfig');

const seedAdminUser = require('./adminSeed');


// Initialize database and seed admin user
const initializeApp = async () => {
    await connectDB();
    await seedAdminUser(); // Seed admin user
}

initializeApp().catch(err => {
    console.error('Failed to initialize app:', err);
    process.exit(1);
})

// Routes
const userRoutes = require("./routes/userRoutes")
app.use("/api/auth", userRoutes)


const jobRoute = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoute)

const applicationRoute = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoute)

const paymentRoute = require("./routes/paymentRoute");
app.use("/api/payments", paymentRoute)


const port = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})
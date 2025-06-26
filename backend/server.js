const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');

const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/test', testRoutes);
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);
const assessmentRoutes = require('./routes/assessmentRoutes');
app.use('/api/assessments', assessmentRoutes);
const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
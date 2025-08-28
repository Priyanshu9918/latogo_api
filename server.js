const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api/level', require('./routes/levelRoutes'));
app.use('/api/course', require('./routes/courseRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

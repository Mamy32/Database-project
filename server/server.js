const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// =========================================
// ROUTES
// =========================================

const memberRoutes = require('./routes/memberRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const classRoutes = require('./routes/classRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const planRoutes = require('./routes/planRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

app.use('/members', memberRoutes);
app.use('/trainers', trainerRoutes);
app.use('/classes', classRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/plans', planRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/subscriptions', subscriptionRoutes);

// =========================================
// ROOT
// =========================================

app.get('/', (req, res) => {
    res.send('Gym Management API Running');
});

// =========================================
// SERVER
// =========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
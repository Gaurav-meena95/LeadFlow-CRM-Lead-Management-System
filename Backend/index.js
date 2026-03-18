const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./modules/auth/routes');
const leadsRoutes = require('./modules/leads/routes');
const visitsRoutes = require('./modules/visits/routes');
const dashboardRoutes = require('./modules/dashboard/routes');
const { verifyUserMiddleware } = require('./modules/auth/middleware');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.status(200).json('LeadFlow CRM API'));

app.use('/api/auth', authRoutes);
app.use(verifyUserMiddleware);
app.use('/api/leads', leadsRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

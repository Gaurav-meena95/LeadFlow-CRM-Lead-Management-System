const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')

const authRoutes = require('./modules/auth/routes');
const leadsRoutes = require('./modules/leads/routes');
const visitsRoutes = require('./modules/visits/routes');


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/visits', visitsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

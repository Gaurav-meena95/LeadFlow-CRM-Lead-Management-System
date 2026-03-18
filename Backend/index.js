const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./modules/auth/model');
const Lead = require('./modules/leads/model');
const Visit = require('./modules/visits/model');
const bcrypt = require('bcrypt');

const authRoutes = require('./modules/auth/routes');
const leadsRoutes = require('./modules/leads/routes');
const visitsRoutes = require('./modules/visits/routes');
const { verifyUserMiddleware } = require('./modules/auth/middleware');

const app = express();

app.use(cors({
  exposedHeaders: ['x-access-token', 'x-refresh-token']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/visits', verifyUserMiddleware, visitsRoutes);

app.get('/api/dashboard', verifyUserMiddleware, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const contacted = await Lead.countDocuments({ status: 'contacted' });
    const visitScheduled = await Lead.countDocuments({ status: 'visit_scheduled' });
    const booked = await Lead.countDocuments({ status: 'booked' });
    const lost = await Lead.countDocuments({ status: 'lost' });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayVisits = await Visit.find({
      scheduledAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('leadId', 'name phone')
      .populate('agent', 'name email');

    return res.status(200).json({
      totalLeads,
      new: newLeads,
      contacted,
      visit_scheduled: visitScheduled,
      booked,
      lost,
      todayVisits
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

const seedUsers = async () => {
  const seeds = [
    { name: 'Admin', shopName: 'LeadFlow', email: 'admin@crm.com', phone: '9000000001', password: 'Admin@123', role: 'admin' },
    { name: 'Manager', shopName: 'LeadFlow', email: 'manager@crm.com', phone: '9000000002', password: 'Manager@123', role: 'manager' },
    { name: 'Agent', shopName: 'LeadFlow', email: 'agent@crm.com', phone: '9000000003', password: 'Agent@123', role: 'agent' }
  ];

  for (const seed of seeds) {
    const exists = await User.findOne({ email: seed.email });
    if (!exists) {
      const hashed = await bcrypt.hash(seed.password, 10);
      await User.create({ ...seed, password: hashed });
    }
  }
};

const start = async () => {
  await connectDB();
  await seedUsers();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

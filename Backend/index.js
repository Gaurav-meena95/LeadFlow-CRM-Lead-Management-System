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
  origin: '*',
  exposedHeaders: ['x-access-token', 'x-refresh-token']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/visits', verifyUserMiddleware, visitsRoutes);

app.get('/api/dashboard', verifyUserMiddleware, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const byStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusMap = {};
    byStatus.forEach((s) => { statusMap[s._id] = s.count; });

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const followUpsPending = await Lead.countDocuments({
      lastActivityAt: { $lt: cutoff },
      status: { $nin: ['booked', 'lost'] }
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayVisits = await Visit.find({
      scheduledAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('leadId', 'name phone')
      .populate('agent', 'name email');

    const booked = statusMap['booked'] || 0;
    const conversionRate = totalLeads > 0 ? ((booked / totalLeads) * 100).toFixed(1) : '0.0';

    const agentStats = await Lead.aggregate([
      { $group: { _id: '$assignedAgent', total: { $sum: 1 }, booked: { $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] } } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
      { $unwind: { path: '$agent', preserveNullAndEmpty: true } },
      { $project: { _id: 1, total: 1, booked: 1, name: '$agent.name', email: '$agent.email' } }
    ]);

    return res.status(200).json({
      totalLeads,
      statusMap,
      followUpsPending,
      conversionRate,
      todayVisits,
      agentStats
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.get('/api/dashboard/agents', verifyUserMiddleware, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('name email');
    const stats = await Promise.all(agents.map(async (agent) => {
      const total = await Lead.countDocuments({ assignedAgent: agent._id });
      const booked = await Lead.countDocuments({ assignedAgent: agent._id, status: 'booked' });
      const visits = await Visit.countDocuments({ agent: agent._id });
      return { _id: agent._id, name: agent.name, email: agent.email, total, booked, visits };
    }));
    return res.status(200).json({ agents: stats });
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
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

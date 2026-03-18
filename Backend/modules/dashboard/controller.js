const Lead = require('../leads/model');
const Visit = require('../visits/model');
const User = require('../auth/model');

const getDashboard = async (req, res) => {
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
      { $unwind: { path: '$agent', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, total: 1, booked: 1, name: '$agent.name', email: '$agent.email' } }
    ]);

    return res.status(200).json({ totalLeads, statusMap, followUpsPending, conversionRate, todayVisits, agentStats });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAgentStats = async (req, res) => {
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
};

module.exports = { getDashboard, getAgentStats };

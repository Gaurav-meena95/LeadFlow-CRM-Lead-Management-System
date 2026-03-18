const Lead = require('./model');
const { getNextAgent } = require('../../utils/roundRobin');

const createPublicLead = async (req, res) => {
  try {
    const { name, phone, source } = req.body;
    if (!name || !phone || !source) {
      return res.status(400).json({ message: 'name, phone and source are required' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }
    const allowed = ['website', 'facebook', 'whatsapp', 'referral'];
    if (!allowed.includes(source)) {
      return res.status(400).json({ message: 'Invalid source' });
    }
    const agentId = await getNextAgent();
    const lead = await Lead.create({ name, phone, source, assignedAgent: agentId });
    const message = agentId ? 'Lead created' : 'Lead created but no agent available';
    return res.status(201).json({ message, lead });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { name, phone, source, assignedAgent, property } = req.body;
    if (!name || !phone || !source) {
      return res.status(400).json({ message: 'name, phone and source are required' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }
    const allowed = ['website', 'facebook', 'whatsapp', 'referral'];
    if (!allowed.includes(source)) {
      return res.status(400).json({ message: 'Invalid source' });
    }
    let agentId = assignedAgent;
    if (!agentId) agentId = await getNextAgent();
    const lead = await Lead.create({ name, phone, source, assignedAgent: agentId, property });
    const populated = await Lead.findById(lead._id).populate('assignedAgent', 'name email phone');
    return res.status(201).json({ message: 'Lead created', lead: populated });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const { status, agent, source } = req.query;
    const filter = {};
    if (req.user.role === 'agent') {
      filter.assignedAgent = req.user.id;
    } else if (agent) {
      filter.assignedAgent = agent;
    }
    if (status) filter.status = status;
    if (source) filter.source = source;
    const leads = await Lead.find(filter)
      .populate('assignedAgent', 'name email phone')
      .sort({ createdAt: -1 });
    return res.status(200).json({ leads });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedAgent, property } = req.body;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (req.user.role === 'agent' && lead.assignedAgent.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const allowedStatuses = ['new', 'contacted', 'visit_scheduled', 'visit_done', 'booked', 'lost'];
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      lead.status = status;
      lead.lastActivityAt = new Date();
    }
    if (assignedAgent !== undefined) lead.assignedAgent = assignedAgent;
    if (property !== undefined) lead.property = property;
    await lead.save();
    const updated = await Lead.findById(id).populate('assignedAgent', 'name email phone');
    return res.status(200).json({ message: 'Lead updated', lead: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { createPublicLead, createLead, getLeads, updateLead };

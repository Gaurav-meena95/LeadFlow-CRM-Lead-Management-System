const Lead = require('./model');
const { getNextAgent } = require('../../utils/roundRobin');

const VALID_STATUSES = ['new_lead', 'contacted', 'requirement_collected', 'property_suggested', 'visit_scheduled', 'visit_completed', 'booked', 'lost'];
const VALID_SOURCES = ['website', 'facebook', 'whatsapp', 'call', 'referral'];

const createPublicLead = async (req, res) => {
  try {
    const { name, phone, source } = req.body;
    if (!name || !phone || !source) return res.status(400).json({ message: 'name, phone and source are required' });
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    if (!VALID_SOURCES.includes(source)) return res.status(400).json({ message: 'Invalid source' });

    const duplicate = await Lead.findOne({ phone });
    if (duplicate) return res.status(409).json({ message: 'Lead with this phone already exists' });

    const agentId = await getNextAgent();
    const lead = await Lead.create({
      name, phone, source,
      assignedAgent: agentId,
      activity: [{ type: 'status_change', metadata: { from: null, to: 'new_lead' } }]
    });
    return res.status(201).json({ message: 'Lead created', lead });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { name, phone, source, assignedAgent, property } = req.body;
    if (!name || !phone || !source) return res.status(400).json({ message: 'name, phone and source are required' });
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    if (!VALID_SOURCES.includes(source)) return res.status(400).json({ message: 'Invalid source' });

    const duplicate = await Lead.findOne({ phone });
    if (duplicate) return res.status(409).json({ message: 'Lead with this phone already exists' });

    let agentId = assignedAgent;
    if (!agentId) agentId = await getNextAgent();

    const lead = await Lead.create({
      name, phone, source,
      assignedAgent: agentId,
      property,
      activity: [{ type: 'status_change', metadata: { from: null, to: 'new_lead' } }]
    });
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
    if (req.user.role === 'agent') filter.assignedAgent = req.user.id;
    else if (agent) filter.assignedAgent = agent;
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
    if (status) {
      if (!VALID_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      lead.activity.push({ type: 'status_change', metadata: { from: lead.status, to: status } });
      lead.status = status;
      lead.lastActivityAt = new Date();
      lead.followUpRequired = false;
    }
    if (assignedAgent !== undefined) {
      lead.activity.push({ type: 'assigned', metadata: { agentId: assignedAgent } });
      lead.assignedAgent = assignedAgent;
      lead.lastActivityAt = new Date();
    }
    if (property !== undefined) lead.property = property;
    await lead.save();
    const updated = await Lead.findById(id).populate('assignedAgent', 'name email phone');
    return res.status(200).json({ message: 'Lead updated', lead: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Message text is required' });
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (req.user.role === 'agent' && lead.assignedAgent.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const msg = { sender: 'agent', text: text.trim(), timestamp: new Date() };
    lead.messages.push(msg);
    lead.activity.push({ type: 'message_sent', metadata: { preview: text.trim().slice(0, 50) } });
    lead.lastActivityAt = new Date();
    lead.followUpRequired = false;
    await lead.save();
    return res.status(201).json({ message: 'Message added', messages: lead.messages });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getFollowUps = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const filter = { lastActivityAt: { $lt: cutoff }, status: { $nin: ['booked', 'lost'] } };
    if (req.user.role === 'agent') filter.assignedAgent = req.user.id;
    const leads = await Lead.find(filter)
      .populate('assignedAgent', 'name email')
      .sort({ lastActivityAt: 1 });
    await Lead.updateMany(
      { _id: { $in: leads.map((l) => l._id) } },
      { followUpRequired: true }
    );
    return res.status(200).json({ leads });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { createPublicLead, createLead, getLeads, updateLead, addMessage, getFollowUps };

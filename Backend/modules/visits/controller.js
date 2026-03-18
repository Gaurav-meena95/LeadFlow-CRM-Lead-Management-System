const Visit = require('./model');
const Lead = require('../leads/model');

const createVisit = async (req, res) => {
  try {
    const { leadId, propertyName, propertyLocation, scheduledAt, agent, notes } = req.body;
    if (!leadId || !propertyName || !scheduledAt || !agent) {
      return res.status(400).json({ message: 'leadId, propertyName, scheduledAt and agent are required' });
    }
    const visit = await Visit.create({ leadId, propertyName, propertyLocation, scheduledAt, agent, notes });
    const lead = await Lead.findById(leadId);
    if (lead) {
      lead.status = 'visit_scheduled';
      lead.lastActivityAt = new Date();
      lead.followUpRequired = false;
      lead.activity.push({ type: 'visit_scheduled', metadata: { propertyName, scheduledAt } });
      await lead.save();
    }
    const populated = await Visit.findById(visit._id)
      .populate('leadId', 'name phone')
      .populate('agent', 'name email');
    return res.status(201).json({ message: 'Visit scheduled', visit: populated });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getVisits = async (req, res) => {
  try {
    const { leadId } = req.query;
    const filter = {};
    if (req.user.role === 'agent') filter.agent = req.user.id;
    if (leadId) filter.leadId = leadId;
    const visits = await Visit.find(filter)
      .populate('leadId', 'name phone')
      .populate('agent', 'name email')
      .sort({ scheduledAt: -1 });
    return res.status(200).json({ visits });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, leadOutcome } = req.body;
    const visit = await Visit.findById(id);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    const allowedStatuses = ['scheduled', 'completed', 'cancelled'];
    if (status) {
      if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      visit.status = status;
      if (status === 'completed') {
        const leadStatus = leadOutcome === 'booked' ? 'booked' : 'visit_completed';
        const lead = await Lead.findById(visit.leadId);
        if (lead) {
          lead.activity.push({ type: 'status_change', metadata: { from: lead.status, to: leadStatus } });
          lead.status = leadStatus;
          lead.lastActivityAt = new Date();
          await lead.save();
        }
      }
    }
    if (notes !== undefined) visit.notes = notes;
    await visit.save();
    const updated = await Visit.findById(id)
      .populate('leadId', 'name phone')
      .populate('agent', 'name email');
    return res.status(200).json({ message: 'Visit updated', visit: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { createVisit, getVisits, updateVisit };

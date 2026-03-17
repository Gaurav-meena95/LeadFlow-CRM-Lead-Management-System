const Lead = require('./model');
const User = require('../auth/model');

let lastAssignedIndex = 0;

const createLead = async (req, res) => {
    try {
        const { name, phone, source } = req.body;
        const agents = await User.find({ role: 'agent' }).sort({ _id: 1 });
        let assignedAgent = null;
        if (agents.length > 0) {
            assignedAgent = agents[lastAssignedIndex % agents.length]._id;
            lastAssignedIndex++;
        }
        const lead = await Lead.create({
            name,
            phone,
            source,
            status: 'new',
            assignedAgent
        });
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeads = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'agent') {
            filter.assignedAgent = req.user._id;
        }
        const leads = await Lead.find(filter).populate('assignedAgent', 'name email');
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        if (req.user.role === 'agent' && lead.assignedAgent && lead.assignedAgent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        lead.status = status || lead.status;
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLead, getLeads, updateLead };

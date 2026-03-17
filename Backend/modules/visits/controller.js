const Visit = require('./model');
const Lead = require('../leads/model');

const createVisit = async (req, res) => {
    try {
        const { leadId, property, date, time } = req.body;
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        const visit = await Visit.create({
            leadId,
            property,
            date,
            time,
            agent: req.user._id,
            status: 'scheduled'
        });
        lead.status = 'visit_scheduled';
        await lead.save();
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVisits = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'agent') {
            filter.agent = req.user._id;
        }
        const visits = await Visit.find(filter).populate('leadId', 'name phone').populate('agent', 'name');
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createVisit, getVisits };

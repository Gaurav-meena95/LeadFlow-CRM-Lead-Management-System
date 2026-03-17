const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    property: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);

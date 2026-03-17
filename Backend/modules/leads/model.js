const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    source: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['new', 'contacted', 'visit_scheduled', 'visit_done', 'booked', 'lost'],
        default: 'new'
    },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);

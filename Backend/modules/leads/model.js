const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ['website', 'facebook', 'whatsapp', 'referral'],
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'visit_scheduled', 'visit_done', 'booked', 'lost'],
        default: 'new'
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: String
    },
    lastActivityAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Lead', leadSchema);
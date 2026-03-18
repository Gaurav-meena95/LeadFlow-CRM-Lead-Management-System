const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
{
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    property: {
        type: String,
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    notes: {
        type: String
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Visit', visitSchema);
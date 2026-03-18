const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['agent', 'system'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const activitySchema = new mongoose.Schema({
  type: { type: String, enum: ['status_change', 'visit_scheduled', 'message_sent', 'assigned'], required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  source: {
    type: String,
    enum: ['website', 'facebook', 'whatsapp', 'call', 'referral'],
    required: true
  },
  status: {
    type: String,
    enum: ['new_lead', 'contacted', 'requirement_collected', 'property_suggested', 'visit_scheduled', 'visit_completed', 'booked', 'lost'],
    default: 'new_lead'
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: String },
  messages: [messageSchema],
  activity: [activitySchema],
  lastActivityAt: { type: Date, default: Date.now },
  followUpRequired: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);

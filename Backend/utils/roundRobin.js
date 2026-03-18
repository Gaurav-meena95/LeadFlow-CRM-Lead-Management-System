const mongoose = require('mongoose');
const User = require('../modules/auth/model');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const getNextAgent = async () => {
  const agents = await User.find({ role: 'agent' }).select('_id');
  if (!agents.length) return null;

  let counter = await Counter.findOneAndUpdate(
    { name: 'roundRobin' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );

  const index = (counter.value - 1) % agents.length;
  return agents[index]._id;
};

module.exports = { getNextAgent };

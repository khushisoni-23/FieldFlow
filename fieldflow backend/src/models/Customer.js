const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  pincode: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    default: 'Active'
  },
  serviceCount: {
    type: Number,
    default: 0
  },
  lastService: {
    type: String,
    default: 'N/A'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);

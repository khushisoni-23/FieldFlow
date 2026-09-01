const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
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
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  specialization: {
    type: String
  },
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Available', 'On Job', 'Busy', 'Offline'],
    default: 'Available'
  },
  rating: {
    type: Number,
    default: 5.0
  },
  assignedJobsCount: {
    type: Number,
    default: 0
  },
  completedJobsCount: {
    type: Number,
    default: 0
  },
  workload: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Technician', technicianSchema);

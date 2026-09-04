const mongoose = require('mongoose');

const partsUsedSchema = new mongoose.Schema({
  partId: { type: String, required: true },
  partName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  time: { type: String, required: true },
  note: { type: String, required: true }
}, { _id: false });

const jobSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String
  },
  serviceType: {
    type: String,
    required: true
  },
  problemDescription: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'Medium', 'High', 'Urgent'],
    required: true
  },
  scheduledDate: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  technicianId: {
    type: String,
    default: null
  },
  technicianName: {
    type: String,
    default: 'Unassigned'
  },
  serviceCharge: {
    type: Number,
    default: 0
  },
  partsCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'On The Way', 'Arrived', 'In Progress', 'Completed', 'Delayed', 'Paid'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String
  },
  notes: {
    type: String
  },
  partsUsed: [partsUsedSchema],
  beforePhoto: {
    type: String,
    default: null
  },
  afterPhoto: {
    type: String,
    default: null
  },
  timeline: [timelineSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);

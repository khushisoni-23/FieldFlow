const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memPayments = [...mockData.payments];

const isDbConnected = () => mongoose.connection.readyState === 1;

const paymentRepository = {
  getAll: async () => {
    if (isDbConnected()) return Payment.find({}).lean();
    return memPayments;
  },

  findById: async (id) => {
    if (isDbConnected()) return Payment.findOne({ id }).lean();
    return memPayments.find(p => p.id === id) || null;
  },

  findByJobId: async (jobId) => {
    if (isDbConnected()) return Payment.findOne({ jobId }).lean();
    return memPayments.find(p => p.jobId === jobId) || null;
  },

  create: async (paymentData) => {
    if (isDbConnected()) {
      const existing = await Payment.find({}, { id: 1 }).lean();
      const ids = existing.map(p => p.id);
      const newId = idGen.payment(ids);

      const newPayment = new Payment({
        id: newId,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: paymentData.paymentMethod || 'UPI',
        status: paymentData.status || 'Pending',
        ...paymentData,
        amount: Number(paymentData.amount)
      });

      await newPayment.save();
      return newPayment.toObject();
    } else {
      const ids = memPayments.map(p => p.id);
      const newId = idGen.payment(ids);
      const newPayment = {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: paymentData.paymentMethod || 'UPI',
        status: paymentData.status || 'Pending',
        ...paymentData,
        amount: Number(paymentData.amount)
      };
      memPayments.unshift(newPayment);
      return newPayment;
    }
  },

  update: async (id, paymentData) => {
    if (isDbConnected()) {
      const updated = await Payment.findOneAndUpdate(
        { id },
        { $set: paymentData },
        { new: true }
      ).lean();
      return updated;
    } else {
      const idx = memPayments.findIndex(p => p.id === id);
      if (idx === -1) return null;
      memPayments[idx] = { ...memPayments[idx], ...paymentData };
      return memPayments[idx];
    }
  },

  updateByJobId: async (jobId, paymentData) => {
    if (isDbConnected()) {
      const updated = await Payment.findOneAndUpdate(
        { jobId },
        { $set: paymentData },
        { new: true }
      ).lean();
      return updated;
    } else {
      const idx = memPayments.findIndex(p => p.jobId === jobId);
      if (idx === -1) return null;
      memPayments[idx] = { ...memPayments[idx], ...paymentData };
      return memPayments[idx];
    }
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Payment.deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initialLength = memPayments.length;
      memPayments = memPayments.filter(p => p.id !== id);
      return memPayments.length < initialLength;
    }
  },

  deleteByJobId: async (jobId) => {
    if (isDbConnected()) {
      const res = await Payment.deleteOne({ jobId });
      return res.deletedCount > 0;
    } else {
      const initialLength = memPayments.length;
      memPayments = memPayments.filter(p => p.jobId !== jobId);
      return memPayments.length < initialLength;
    }
  }
};

module.exports = paymentRepository;

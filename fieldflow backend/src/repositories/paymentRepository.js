const Payment = require('../models/Payment');
const idGen = require('../utils/idGenerator');

const paymentRepository = {
  getAll: async () => {
    return Payment.find({}).lean();
  },

  findById: async (id) => {
    return Payment.findOne({ id }).lean();
  },

  findByJobId: async (jobId) => {
    return Payment.findOne({ jobId }).lean();
  },

  create: async (paymentData) => {
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
  },

  update: async (id, paymentData) => {
    const updated = await Payment.findOneAndUpdate(
      { id },
      { $set: paymentData },
      { new: true }
    ).lean();
    return updated;
  },

  updateByJobId: async (jobId, paymentData) => {
    const updated = await Payment.findOneAndUpdate(
      { jobId },
      { $set: paymentData },
      { new: true }
    ).lean();
    return updated;
  },

  delete: async (id) => {
    const res = await Payment.deleteOne({ id });
    return res.deletedCount > 0;
  },

  deleteByJobId: async (jobId) => {
    const res = await Payment.deleteOne({ jobId });
    return res.deletedCount > 0;
  }
};

module.exports = paymentRepository;

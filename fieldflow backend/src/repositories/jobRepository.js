const Job = require('../models/Job');
const idGen = require('../utils/idGenerator');

const jobRepository = {
  getAll: async () => {
    return Job.find({}).lean();
  },

  findById: async (id) => {
    return Job.findOne({ id }).lean();
  },

  create: async (jobData) => {
    const existing = await Job.find({}, { id: 1 }).lean();
    const ids = existing.map(j => j.id);
    const newId = idGen.job(ids);

    const newJob = new Job({
      id: newId,
      status: jobData.status || 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: jobData.paymentMethod || 'UPI',
      partsUsed: [],
      beforePhoto: null,
      afterPhoto: null,
      serviceCharge: Number(jobData.serviceCharge || 0),
      partsCost: 0,
      totalAmount: Number(jobData.serviceCharge || 0),
      timeline: jobData.timeline || [],
      ...jobData
    });

    await newJob.save();
    return newJob.toObject();
  },

  update: async (id, jobData) => {
    const updated = await Job.findOneAndUpdate(
      { id },
      { $set: jobData },
      { new: true }
    ).lean();
    return updated;
  },

  delete: async (id) => {
    const res = await Job.deleteOne({ id });
    return res.deletedCount > 0;
  }
};

module.exports = jobRepository;

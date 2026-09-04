const mongoose = require('mongoose');
const Job = require('../models/Job');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memJobs = [...mockData.jobs];

const isDbConnected = () => mongoose.connection.readyState === 1;

const jobRepository = {
  getAll: async () => {
    if (isDbConnected()) return Job.find({}).lean();
    return memJobs;
  },

  findById: async (id) => {
    if (isDbConnected()) return Job.findOne({ id }).lean();
    return memJobs.find(j => j.id === id) || null;
  },

  create: async (jobData) => {
    if (isDbConnected()) {
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
    } else {
      const ids = memJobs.map(j => j.id);
      const newId = idGen.job(ids);
      const newJob = {
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
        ...jobData,
        createdAt: new Date().toISOString()
      };
      memJobs.unshift(newJob);
      return newJob;
    }
  },

  update: async (id, jobData) => {
    if (isDbConnected()) {
      const updated = await Job.findOneAndUpdate(
        { id },
        { $set: jobData },
        { new: true }
      ).lean();
      return updated;
    } else {
      const idx = memJobs.findIndex(j => j.id === id);
      if (idx === -1) return null;
      memJobs[idx] = { ...memJobs[idx], ...jobData };
      return memJobs[idx];
    }
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Job.deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initialLength = memJobs.length;
      memJobs = memJobs.filter(j => j.id !== id);
      return memJobs.length < initialLength;
    }
  }
};

module.exports = jobRepository;

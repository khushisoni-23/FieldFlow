const mongoose = require('mongoose');
const Technician = require('../models/Technician');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memTechnicians = [...mockData.technicians];

const isDbConnected = () => mongoose.connection.readyState === 1;

const technicianRepository = {
  getAll: async () => {
    if (isDbConnected()) return Technician.find({}).lean();
    return memTechnicians;
  },

  findById: async (id) => {
    if (isDbConnected()) return Technician.findOne({ id }).lean();
    return memTechnicians.find(t => t.id === id) || null;
  },

  findByUserId: async (userId) => {
    if (isDbConnected()) return Technician.findOne({ userId }).lean();
    return memTechnicians.find(t => t.userId === userId) || null;
  },

  create: async (techData) => {
    if (isDbConnected()) {
      const existing = await Technician.find({}, { id: 1 }).lean();
      const ids = existing.map(t => t.id);
      const newId = idGen.technician(ids);

      const newTech = new Technician({
        id: newId,
        userId: techData.userId || `user-${newId.toLowerCase()}`,
        email: techData.email || `${techData.name ? techData.name.toLowerCase().replace(/\s+/g, '.') : 'tech'}@fieldflow.in`,
        status: 'Available',
        rating: 5.0,
        assignedJobsCount: 0,
        completedJobsCount: 0,
        workload: 0,
        avatar: techData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        skills: techData.skills || (techData.specialization ? [techData.specialization] : []),
        ...techData
      });

      await newTech.save();
      return newTech.toObject();
    } else {
      const ids = memTechnicians.map(t => t.id);
      const newId = idGen.technician(ids);
      const newTech = {
        id: newId,
        userId: techData.userId || `user-${newId.toLowerCase()}`,
        email: techData.email || `${techData.name ? techData.name.toLowerCase().replace(/\s+/g, '.') : 'tech'}@fieldflow.in`,
        status: 'Available',
        rating: 5.0,
        assignedJobsCount: 0,
        completedJobsCount: 0,
        workload: 0,
        avatar: techData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        skills: techData.skills || (techData.specialization ? [techData.specialization] : []),
        ...techData
      };
      memTechnicians.unshift(newTech);
      return newTech;
    }
  },

  update: async (id, techData) => {
    if (isDbConnected()) {
      const updated = await Technician.findOneAndUpdate(
        { id },
        { $set: techData },
        { new: true }
      ).lean();
      return updated;
    } else {
      const idx = memTechnicians.findIndex(t => t.id === id);
      if (idx === -1) return null;
      memTechnicians[idx] = { ...memTechnicians[idx], ...techData };
      return memTechnicians[idx];
    }
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Technician.deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initialLength = memTechnicians.length;
      memTechnicians = memTechnicians.filter(t => t.id !== id);
      return memTechnicians.length < initialLength;
    }
  }
};

module.exports = technicianRepository;

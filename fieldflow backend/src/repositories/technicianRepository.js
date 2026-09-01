const Technician = require('../models/Technician');
const idGen = require('../utils/idGenerator');

const technicianRepository = {
  getAll: async () => {
    return Technician.find({}).lean();
  },

  findById: async (id) => {
    return Technician.findOne({ id }).lean();
  },

  findByUserId: async (userId) => {
    return Technician.findOne({ userId }).lean();
  },

  create: async (techData) => {
    const existing = await Technician.find({}, { id: 1 }).lean();
    const ids = existing.map(t => t.id);
    const newId = idGen.technician(ids);

    const newTech = new Technician({
      id: newId,
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
  },

  update: async (id, techData) => {
    const updated = await Technician.findOneAndUpdate(
      { id },
      { $set: techData },
      { new: true }
    ).lean();
    return updated;
  },

  delete: async (id) => {
    const res = await Technician.deleteOne({ id });
    return res.deletedCount > 0;
  }
};

module.exports = technicianRepository;

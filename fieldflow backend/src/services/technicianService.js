const technicianRepository = require('../repositories/technicianRepository');
const jobRepository = require('../repositories/jobRepository');

const technicianService = {
  getAll: async () => {
    return await technicianRepository.getAll();
  },

  getById: async (id) => {
    const tech = await technicianRepository.findById(id);
    if (!tech) {
      const err = new Error(`Technician with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return tech;
  },

  create: async (techData) => {
    return await technicianRepository.create(techData);
  },

  updateStatus: async (id, status) => {
    const tech = await technicianRepository.findById(id);
    if (!tech) {
      const err = new Error(`Technician with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return await technicianRepository.update(id, { status });
  },

  delete: async (id) => {
    const tech = await technicianRepository.findById(id);
    if (!tech) {
      const err = new Error(`Technician with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    // Deletion guard: Check if technician has active (non-Completed/non-Paid) jobs assigned
    const jobs = await jobRepository.getAll();
    const activeJobs = jobs.filter(
      j => j.technicianId === id && j.status !== 'Completed' && j.status !== 'Paid'
    );

    if (activeJobs.length > 0) {
      const err = new Error(
        `Cannot delete technician ${tech.name} because they are assigned to ${activeJobs.length} active job(s).`
      );
      err.status = 409;
      throw err;
    }

    await technicianRepository.delete(id);
    return { success: true };
  }
};

module.exports = technicianService;

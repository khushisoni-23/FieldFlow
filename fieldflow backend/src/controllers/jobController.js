const jobService = require('../services/jobService');

const jobController = {
  getAll: async (req, res, next) => {
    try {
      const jobs = await jobService.getAll();
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const job = await jobService.getById(req.params.id);
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const job = await jobService.create(req.body);
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status, noteText } = req.body;
      const job = await jobService.updateStatus(req.params.id, status, noteText);
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  complete: async (req, res, next) => {
    try {
      const job = await jobService.complete(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  payment: async (req, res, next) => {
    try {
      const job = await jobService.payment(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  assign: async (req, res, next) => {
    try {
      const { technicianId } = req.body;
      const job = await jobService.assign(req.params.id, technicianId);
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  addPart: async (req, res, next) => {
    try {
      const job = await jobService.addPart(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      next(error);
    }
  },

  uploadPhotos: async (req, res, next) => {
    try {
      // In this phase, we accept beforePhoto/afterPhoto URLs directly in the body
      const { beforePhoto, afterPhoto } = req.body;
      const job = await jobService.uploadPhotos(req.params.id, beforePhoto, afterPhoto);
      res.json(job);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = jobController;

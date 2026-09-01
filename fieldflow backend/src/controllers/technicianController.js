const technicianService = require('../services/technicianService');

const technicianController = {
  getAll: async (req, res, next) => {
    try {
      const techs = await technicianService.getAll();
      res.json(techs);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const tech = await technicianService.getById(req.params.id);
      res.json(tech);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const tech = await technicianService.create(req.body);
      res.status(201).json(tech);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const tech = await technicianService.updateStatus(req.params.id, status);
      res.json(tech);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const result = await technicianService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = technicianController;

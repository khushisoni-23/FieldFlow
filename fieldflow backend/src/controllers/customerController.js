const customerService = require('../services/customerService');

const customerController = {
  getAll: async (req, res, next) => {
    try {
      const customers = await customerService.getAll();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const customer = await customerService.getById(req.params.id);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const customer = await customerService.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const customer = await customerService.update(req.params.id, req.body);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const result = await customerService.delete(req.params.id);
      res.json(result); // Returns { success: true }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;

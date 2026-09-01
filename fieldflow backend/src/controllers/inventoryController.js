const inventoryService = require('../services/inventoryService');

const inventoryController = {
  getAll: async (req, res, next) => {
    try {
      const parts = await inventoryService.getAll();
      res.json(parts);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const part = await inventoryService.getById(req.params.id);
      res.json(part);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const part = await inventoryService.create(req.body);
      res.status(201).json(part);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const part = await inventoryService.update(req.params.id, req.body);
      res.json(part);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const result = await inventoryService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  updateStock: async (req, res, next) => {
    try {
      const { stockCount } = req.body;
      const part = await inventoryService.updateStock(req.params.id, stockCount);
      res.json(part);
    } catch (error) {
      next(error);
    }
  },

  deduct: async (req, res, next) => {
    try {
      const { quantity } = req.body;
      const part = await inventoryService.deduct(req.params.id, quantity);
      res.json(part);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = inventoryController;

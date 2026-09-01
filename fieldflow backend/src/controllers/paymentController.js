const paymentService = require('../services/paymentService');

const paymentController = {
  getAll: async (req, res, next) => {
    try {
      const payments = await paymentService.getAll();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const payment = await paymentService.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const { status, method } = req.body;
      const payment = await paymentService.updateStatus(jobId, status, method);
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;

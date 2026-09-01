const reportService = require('../services/reportService');

const reportController = {
  getAnalytics: async (req, res, next) => {
    try {
      const analytics = await reportService.getAnalytics();
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reportController;

const searchService = require('../services/searchService');

const searchController = {
  globalSearch: async (req, res, next) => {
    try {
      const { q } = req.query;
      const results = await searchService.globalSearch(q);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = searchController;

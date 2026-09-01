const notificationService = require('../services/notificationService');

const notificationController = {
  getAll: async (req, res, next) => {
    try {
      const notifs = await notificationService.getAll();
      res.json(notifs);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const notif = await notificationService.create(req.body);
      res.status(201).json(notif);
    } catch (error) {
      next(error);
    }
  },

  markRead: async (req, res, next) => {
    try {
      const notif = await notificationService.markRead(req.params.id);
      res.json(notif);
    } catch (error) {
      next(error);
    }
  },

  markAllRead: async (req, res, next) => {
    try {
      const result = await notificationService.markAllRead();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;

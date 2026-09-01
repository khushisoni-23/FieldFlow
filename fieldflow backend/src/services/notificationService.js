const notificationRepository = require('../repositories/notificationRepository');

const notificationService = {
  getAll: async () => {
    return await notificationRepository.getAll();
  },

  create: async (notificationData) => {
    return await notificationRepository.create(notificationData);
  },

  markRead: async (id) => {
    const notif = await notificationRepository.findById(id);
    if (!notif) {
      const err = new Error(`Notification with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return await notificationRepository.update(id, { read: true });
  },

  markAllRead: async () => {
    await notificationRepository.markAllAsRead();
    return { success: true };
  }
};

module.exports = notificationService;

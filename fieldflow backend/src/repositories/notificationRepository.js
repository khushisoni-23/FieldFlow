const Notification = require('../models/Notification');
const idGen = require('../utils/idGenerator');

const notificationRepository = {
  getAll: async () => {
    // Return sorted by time descending to emulate unshift() behavior
    return Notification.find({}).sort({ time: -1 }).lean();
  },

  findById: async (id) => {
    return Notification.findOne({ id }).lean();
  },

  create: async (notificationData) => {
    const existing = await Notification.find({}, { id: 1 }).lean();
    const ids = existing.map(n => n.id);
    const newId = idGen.notification(ids);

    const newNotification = new Notification({
      id: newId,
      time: new Date().toISOString(),
      read: false,
      ...notificationData
    });

    await newNotification.save();
    return newNotification.toObject();
  },

  update: async (id, notificationData) => {
    const updated = await Notification.findOneAndUpdate(
      { id },
      { $set: notificationData },
      { new: true }
    ).lean();
    return updated;
  },

  markAllAsRead: async () => {
    await Notification.updateMany({}, { $set: { read: true } });
    return true;
  }
};

module.exports = notificationRepository;

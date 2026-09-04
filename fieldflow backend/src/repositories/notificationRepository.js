const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memNotifications = [...mockData.notifications];

const isDbConnected = () => mongoose.connection.readyState === 1;

const notificationRepository = {
  getAll: async () => {
    if (isDbConnected()) return Notification.find({}).sort({ time: -1 }).lean();
    return [...memNotifications].sort((a, b) => new Date(b.time) - new Date(a.time));
  },

  findById: async (id) => {
    if (isDbConnected()) return Notification.findOne({ id }).lean();
    return memNotifications.find(n => n.id === id) || null;
  },

  create: async (notificationData) => {
    if (isDbConnected()) {
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
    } else {
      const ids = memNotifications.map(n => n.id);
      const newId = idGen.notification(ids);
      const newNotification = {
        id: newId,
        time: new Date().toISOString(),
        read: false,
        ...notificationData
      };
      memNotifications.unshift(newNotification);
      return newNotification;
    }
  },

  update: async (id, notificationData) => {
    if (isDbConnected()) {
      const updated = await Notification.findOneAndUpdate(
        { id },
        { $set: notificationData },
        { new: true }
      ).lean();
      return updated;
    } else {
      const idx = memNotifications.findIndex(n => n.id === id);
      if (idx === -1) return null;
      memNotifications[idx] = { ...memNotifications[idx], ...notificationData };
      return memNotifications[idx];
    }
  },

  markAllAsRead: async () => {
    if (isDbConnected()) {
      await Notification.updateMany({}, { $set: { read: true } });
      return true;
    } else {
      memNotifications = memNotifications.map(n => ({ ...n, read: true }));
      return true;
    }
  }
};

module.exports = notificationRepository;

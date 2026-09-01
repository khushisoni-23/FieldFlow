import api from './api';
import { mockNotifications } from '../data/mockData';

const USE_API = import.meta.env.VITE_USE_API === 'true';
const STORAGE_KEY = 'ff_mock_notifications';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotifications));
}

const getMockNotifications = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockNotifications = (notifications) => localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

export const notificationService = {
  getNotifications: async () => {
    if (USE_API) {
      const response = await api.get('/notifications');
      return response.data;
    } else {
      return Promise.resolve(getMockNotifications());
    }
  },

  addNotification: async (title, message) => {
    if (USE_API) {
      const response = await api.post('/notifications', { title, message });
      return response.data;
    } else {
      const notifications = getMockNotifications();
      const newNotif = {
        id: `notif-${Date.now()}`,
        title,
        message,
        time: new Date().toISOString(),
        read: false
      };
      notifications.unshift(newNotif);
      saveMockNotifications(notifications);
      return Promise.resolve(newNotif);
    }
  },

  markAsRead: async (id) => {
    if (USE_API) {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } else {
      const notifications = getMockNotifications();
      const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      saveMockNotifications(updated);
      return Promise.resolve(updated.find(n => n.id === id));
    }
  },

  clearAll: async () => {
    if (USE_API) {
      const response = await api.post('/notifications/clear');
      return response.data;
    } else {
      const notifications = getMockNotifications();
      const updated = notifications.map(n => ({ ...n, read: true }));
      saveMockNotifications(updated);
      return Promise.resolve(updated);
    }
  }
};

import api from './api';
import { USE_API } from './config';
import { mockUsers } from '../data/mockData';

const STORAGE_KEY = 'ff_mock_users';

// Initialize localStorage with mockData if not present
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
}

const getMockUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export const authService = {
  login: async (email, password) => {
    if (USE_API) {
      const response = await api.post('/auth/login', { email, password });
      // Backend returns { token, user }
      if (response.data?.token) {
        localStorage.setItem('ff_token', response.data.token);
      }
      return response.data; // { token, user }
    } else {
      const users = getMockUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        const fakeToken = `mock-jwt-token-for-${user.id}`;
        localStorage.setItem('ff_token', fakeToken);
        return Promise.resolve({ user: userWithoutPassword, token: fakeToken });
      }
      return Promise.reject(new Error('Invalid email or password.'));
    }
  },

  register: async (userData) => {
    if (USE_API) {
      const response = await api.post('/auth/register', userData);
      const registeredUser = response.data.user || response.data;
      return { success: true, user: registeredUser };
    } else {
      const users = getMockUsers();
      if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return Promise.reject(new Error('Email address is already registered.'));
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        name: userData.name,
        technicianId: userData.role === 'TECHNICIAN' ? `tech-${Date.now()}` : undefined
      };

      users.push(newUser);
      saveMockUsers(users);

      return Promise.resolve({ success: true, user: newUser });
    }
  },

  logout: async () => {
    if (USE_API) {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.error('Logout error on server', err);
      }
    }
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    return Promise.resolve({ success: true });
  },

  getCurrentUser: async () => {
    if (USE_API) {
      // Backend GET /api/auth/me returns the user object directly (not wrapped)
      const response = await api.get('/auth/me');
      return response.data; // { id, name, email, role, ... }
    } else {
      const token = localStorage.getItem('ff_token');
      if (!token) return Promise.resolve(null);
      
      const savedUser = localStorage.getItem('ff_user');
      return Promise.resolve(savedUser ? JSON.parse(savedUser) : null);
    }
  }
};

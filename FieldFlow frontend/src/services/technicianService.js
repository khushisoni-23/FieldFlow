import api from './api';
import { USE_API } from './config';
import { mockTechnicians } from '../data/mockData';

const STORAGE_KEY = 'ff_mock_technicians';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTechnicians));
}

const getMockTechnicians = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockTechnicians = (technicians) => localStorage.setItem(STORAGE_KEY, JSON.stringify(technicians));

export const technicianService = {
  getTechnicians: async () => {
    if (USE_API) {
      const response = await api.get('/technicians');
      return response.data;
    } else {
      return Promise.resolve(getMockTechnicians());
    }
  },

  getTechnicianById: async (id) => {
    if (USE_API) {
      const response = await api.get(`/technicians/${id}`);
      return response.data;
    } else {
      const technicians = getMockTechnicians();
      const tech = technicians.find(t => t.id === id);
      return Promise.resolve(tech || null);
    }
  },

  createTechnician: async (techData) => {
    if (USE_API) {
      const response = await api.post('/technicians', techData);
      return response.data;
    } else {
      const technicians = getMockTechnicians();
      const newTech = {
        id: techData.id || `tech-${Date.now()}`,
        userId: techData.userId || null,
        name: techData.name,
        specialization: techData.specialization,
        phone: techData.phone,
        status: 'Available',
        email: techData.email
      };
      technicians.unshift(newTech);
      saveMockTechnicians(technicians);
      return Promise.resolve(newTech);
    }
  },

  updateTechnicianStatus: async (id, status) => {
    if (USE_API) {
      const response = await api.patch(`/technicians/${id}/status`, { status });
      return response.data;
    } else {
      const technicians = getMockTechnicians();
      const updated = technicians.map(t => t.id === id ? { ...t, status } : t);
      saveMockTechnicians(updated);
      return Promise.resolve(updated.find(t => t.id === id));
    }
  },

  deleteTechnician: async (id) => {
    if (USE_API) {
      const response = await api.delete(`/technicians/${id}`);
      return response.data;
    } else {
      const technicians = getMockTechnicians();
      const filtered = technicians.filter(t => t.id !== id);
      saveMockTechnicians(filtered);
      return Promise.resolve({ success: true });
    }
  }
};

import api from './api';
import { mockCustomers } from '../data/mockData';

const USE_API = import.meta.env.VITE_USE_API === 'true';
const STORAGE_KEY = 'ff_mock_customers';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCustomers));
}

const getMockCustomers = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockCustomers = (customers) => localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));

export const customerService = {
  getCustomers: async () => {
    if (USE_API) {
      const response = await api.get('/customers');
      return response.data;
    } else {
      return Promise.resolve(getMockCustomers());
    }
  },

  getCustomerById: async (id) => {
    if (USE_API) {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } else {
      const customers = getMockCustomers();
      const customer = customers.find(c => c.id === id);
      return Promise.resolve(customer || null);
    }
  },

  createCustomer: async (customerData) => {
    if (USE_API) {
      const response = await api.post('/customers', customerData);
      return response.data;
    } else {
      const customers = getMockCustomers();
      const newCustomer = {
        id: `cust-${Date.now()}`,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email || 'N/A',
        address: customerData.address,
        serviceCount: 0,
        lastService: 'N/A',
        status: 'Active'
      };
      customers.unshift(newCustomer);
      saveMockCustomers(customers);
      return Promise.resolve(newCustomer);
    }
  },

  updateCustomer: async (id, updatedData) => {
    if (USE_API) {
      const response = await api.put(`/customers/${id}`, updatedData);
      return response.data;
    } else {
      const customers = getMockCustomers();
      const updated = customers.map(c => c.id === id ? { ...c, ...updatedData } : c);
      saveMockCustomers(updated);
      return Promise.resolve(updated.find(c => c.id === id));
    }
  },

  deleteCustomer: async (id) => {
    if (USE_API) {
      await api.delete(`/customers/${id}`);
      return { success: true };
    } else {
      const customers = getMockCustomers();
      const filtered = customers.filter(c => c.id !== id);
      saveMockCustomers(filtered);
      return Promise.resolve({ success: true });
    }
  }
};

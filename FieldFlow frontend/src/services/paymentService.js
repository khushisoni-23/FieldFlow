import api from './api';
import { mockPayments } from '../data/mockData';

const USE_API = import.meta.env.VITE_USE_API === 'true';
const STORAGE_KEY = 'ff_mock_payments';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPayments));
}

const getMockPayments = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockPayments = (payments) => localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));

export const paymentService = {
  getPayments: async () => {
    if (USE_API) {
      const response = await api.get('/payments');
      return response.data;
    } else {
      return Promise.resolve(getMockPayments());
    }
  },

  addPaymentRecord: async (paymentData) => {
    if (USE_API) {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } else {
      const payments = getMockPayments();
      const newPayment = {
        id: `pay-${Date.now()}`,
        jobId: paymentData.jobId,
        customerName: paymentData.customerName,
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod || 'UPI',
        status: paymentData.status || 'Pending',
        date: paymentData.date || new Date().toISOString().split('T')[0]
      };

      // Filter out duplicates based on jobId
      const filteredPayments = payments.filter(p => p.jobId !== paymentData.jobId);
      filteredPayments.unshift(newPayment);
      saveMockPayments(filteredPayments);
      return Promise.resolve(newPayment);
    }
  },

  updatePaymentStatus: async (jobId, status) => {
    if (USE_API) {
      const response = await api.patch(`/payments/job/${jobId}`, { status });
      return response.data;
    } else {
      const payments = getMockPayments();
      let updatedPayment = null;
      const updated = payments.map(p => {
        if (p.jobId === jobId) {
          updatedPayment = { ...p, status };
          return updatedPayment;
        }
        return p;
      });
      if (updatedPayment) {
        saveMockPayments(updated);
      }
      return Promise.resolve(updatedPayment);
    }
  }
};

import api from './api';

const USE_API = import.meta.env.VITE_USE_API === 'true';

export const searchService = {
  globalSearch: async (query, datasets = {}) => {
    if (USE_API) {
      const response = await api.get(`/search`, { params: { q: query } });
      return response.data;
    } else {
      const q = query.trim().toLowerCase();
      if (!q) {
        return {
          customers: [],
          technicians: [],
          jobs: [],
          inventory: [],
          payments: []
        };
      }

      const {
        customers = [],
        technicians = [],
        jobs = [],
        inventory = [],
        payments = []
      } = datasets;

      // 1. Customers: search name, email, phone, address/city
      const filteredCustomers = customers.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
      );

      // 2. Technicians: search name, email, phone, specialization
      const filteredTechnicians = technicians.filter(t => 
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.phone && t.phone.includes(q)) ||
        (t.specialization && t.specialization.toLowerCase().includes(q))
      );

      // 3. Jobs: search ID, customer name, service type, technician name, status
      const filteredJobs = jobs.filter(j => 
        (j.id && j.id.toLowerCase().includes(q)) ||
        (j.customerName && j.customerName.toLowerCase().includes(q)) ||
        (j.serviceType && j.serviceType.toLowerCase().includes(q)) ||
        (j.technicianName && j.technicianName.toLowerCase().includes(q)) ||
        (j.status && j.status.toLowerCase().includes(q))
      );

      // 4. Inventory: search part name, SKU, category
      const filteredInventory = inventory.filter(i => 
        (i.partName && i.partName.toLowerCase().includes(q)) ||
        (i.sku && i.sku.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q))
      );

      // 5. Payments: search ID, Job ID, customer name, payment method
      const filteredPayments = payments.filter(p => 
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.jobId && p.jobId.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q)) ||
        (p.paymentMethod && p.paymentMethod.toLowerCase().includes(q))
      );

      return Promise.resolve({
        customers: filteredCustomers,
        technicians: filteredTechnicians,
        jobs: filteredJobs,
        inventory: filteredInventory,
        payments: filteredPayments
      });
    }
  }
};

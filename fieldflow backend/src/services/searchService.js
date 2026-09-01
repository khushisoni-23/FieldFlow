const customerRepository = require('../repositories/customerRepository');
const technicianRepository = require('../repositories/technicianRepository');
const jobRepository = require('../repositories/jobRepository');
const inventoryRepository = require('../repositories/inventoryRepository');
const paymentRepository = require('../repositories/paymentRepository');

const searchService = {
  globalSearch: async (query) => {
    const q = (query || '').trim().toLowerCase();
    
    if (!q) {
      return {
        customers: [],
        technicians: [],
        jobs: [],
        inventory: [],
        payments: []
      };
    }

    const [customers, technicians, jobs, inventory, payments] = await Promise.all([
      customerRepository.getAll(),
      technicianRepository.getAll(),
      jobRepository.getAll(),
      inventoryRepository.getAll(),
      paymentRepository.getAll()
    ]);

    // Search filter logic
    const filteredCustomers = customers.filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );

    const filteredTechnicians = technicians.filter(t => 
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.phone && t.phone.toLowerCase().includes(q)) ||
      (t.specialization && t.specialization.toLowerCase().includes(q)) ||
      (t.skills && t.skills.some(s => s.toLowerCase().includes(q)))
    );

    const filteredJobs = jobs.filter(j => 
      (j.id && j.id.toLowerCase().includes(q)) ||
      (j.customerName && j.customerName.toLowerCase().includes(q)) ||
      (j.serviceType && j.serviceType.toLowerCase().includes(q)) ||
      (j.technicianName && j.technicianName.toLowerCase().includes(q)) ||
      (j.status && j.status.toLowerCase().includes(q))
    );

    const filteredInventory = inventory.filter(i => 
      (i.partName && i.partName.toLowerCase().includes(q)) ||
      (i.sku && i.sku.toLowerCase().includes(q)) ||
      (i.category && i.category.toLowerCase().includes(q))
    );

    const filteredPayments = payments.filter(p => 
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.jobId && p.jobId.toLowerCase().includes(q)) ||
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.paymentMethod && p.paymentMethod.toLowerCase().includes(q))
    );

    return {
      customers: filteredCustomers,
      technicians: filteredTechnicians,
      jobs: filteredJobs,
      inventory: filteredInventory,
      payments: filteredPayments
    };
  }
};

module.exports = searchService;

const customerRepository = require('../repositories/customerRepository');

const customerService = {
  getAll: async () => {
    return await customerRepository.getAll();
  },

  getById: async (id) => {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      const err = new Error(`Customer with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return customer;
  },

  create: async (customerData) => {
    return await customerRepository.create(customerData);
  },

  update: async (id, customerData) => {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      const err = new Error(`Customer with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return await customerRepository.update(id, customerData);
  },

  delete: async (id) => {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      const err = new Error(`Customer with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    await customerRepository.delete(id);
    return { success: true };
  }
};

module.exports = customerService;

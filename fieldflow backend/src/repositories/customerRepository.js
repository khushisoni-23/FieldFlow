const Customer = require('../models/Customer');
const idGen = require('../utils/idGenerator');

const customerRepository = {
  getAll: async () => {
    return Customer.find({}).lean();
  },

  findById: async (id) => {
    return Customer.findOne({ id }).lean();
  },

  create: async (customerData) => {
    const existing = await Customer.find({}, { id: 1 }).lean();
    const ids = existing.map(c => c.id);
    const newId = idGen.customer(ids);

    const newCust = new Customer({
      id: newId,
      ...customerData,
      serviceCount: customerData.serviceCount !== undefined ? customerData.serviceCount : 0,
      lastService: customerData.lastService || 'N/A',
      status: customerData.status || 'Active'
    });

    await newCust.save();
    return newCust.toObject();
  },

  update: async (id, customerData) => {
    const updated = await Customer.findOneAndUpdate(
      { id },
      { $set: customerData },
      { new: true }
    ).lean();
    return updated;
  },

  delete: async (id) => {
    const res = await Customer.deleteOne({ id });
    return res.deletedCount > 0;
  }
};

module.exports = customerRepository;

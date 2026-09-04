const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memCustomers = [...mockData.customers];

const isDbConnected = () => mongoose.connection.readyState === 1;

const customerRepository = {
  getAll: async () => {
    if (isDbConnected()) return Customer.find({}).lean();
    return memCustomers;
  },

  findById: async (id) => {
    if (isDbConnected()) return Customer.findOne({ id }).lean();
    return memCustomers.find(c => c.id === id) || null;
  },

  create: async (customerData) => {
    if (isDbConnected()) {
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
    } else {
      const ids = memCustomers.map(c => c.id);
      const newId = idGen.customer(ids);
      const newCust = {
        id: newId,
        ...customerData,
        serviceCount: customerData.serviceCount !== undefined ? customerData.serviceCount : 0,
        lastService: customerData.lastService || 'N/A',
        status: customerData.status || 'Active',
        createdAt: new Date().toISOString()
      };
      memCustomers.unshift(newCust);
      return newCust;
    }
  },

  update: async (id, customerData) => {
    if (isDbConnected()) {
      const updated = await Customer.findOneAndUpdate(
        { id },
        { $set: customerData },
        { new: true }
      ).lean();
      return updated;
    } else {
      const idx = memCustomers.findIndex(c => c.id === id);
      if (idx === -1) return null;
      memCustomers[idx] = { ...memCustomers[idx], ...customerData };
      return memCustomers[idx];
    }
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Customer.deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initialLength = memCustomers.length;
      memCustomers = memCustomers.filter(c => c.id !== id);
      return memCustomers.length < initialLength;
    }
  }
};

module.exports = customerRepository;

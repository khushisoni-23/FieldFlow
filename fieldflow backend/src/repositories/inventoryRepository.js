const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memInventory = [...mockData.inventory];

const isDbConnected = () => mongoose.connection.readyState === 1;

const inventoryRepository = {
  getAll: async () => {
    if (isDbConnected()) return Inventory.find({}).lean();
    return memInventory;
  },

  findById: async (id) => {
    if (isDbConnected()) return Inventory.findOne({ id }).lean();
    return memInventory.find(i => i.id === id) || null;
  },

  findBySku: async (sku) => {
    if (isDbConnected()) return Inventory.findOne({ sku: { $regex: new RegExp(`^${sku}$`, 'i') } }).lean();
    return memInventory.find(i => i.sku.toLowerCase() === sku.toLowerCase()) || null;
  },

  create: async (partData) => {
    const stock = Number(partData.stock);
    const minStock = Number(partData.minStock);
    let status = 'In Stock';
    if (stock === 0) status = 'Critical';
    else if (stock <= minStock) status = 'Low Stock';

    if (isDbConnected()) {
      const existing = await Inventory.find({}, { id: 1 }).lean();
      const ids = existing.map(i => i.id);
      const newId = idGen.inventory(ids);

      const newPart = new Inventory({
        id: newId,
        ...partData,
        stock,
        minStock,
        price: Number(partData.price),
        status
      });

      await newPart.save();
      return newPart.toObject();
    } else {
      const ids = memInventory.map(i => i.id);
      const newId = idGen.inventory(ids);
      const newPart = {
        id: newId,
        ...partData,
        stock,
        minStock,
        price: Number(partData.price),
        status,
        createdAt: new Date().toISOString()
      };
      memInventory.unshift(newPart);
      return newPart;
    }
  },

  update: async (id, partData) => {
    if (isDbConnected()) {
      const current = await Inventory.findOne({ id }).lean();
      if (!current) return null;

      const stock = partData.stock !== undefined ? Number(partData.stock) : current.stock;
      const minStock = partData.minStock !== undefined ? Number(partData.minStock) : current.minStock;
      const price = partData.price !== undefined ? Number(partData.price) : current.price;

      let status = 'In Stock';
      if (stock === 0) status = 'Critical';
      else if (stock <= minStock) status = 'Low Stock';

      const updated = await Inventory.findOneAndUpdate(
        { id },
        { 
          $set: {
            ...partData,
            stock,
            minStock,
            price,
            status
          }
        },
        { new: true }
      ).lean();

      return updated;
    } else {
      const idx = memInventory.findIndex(i => i.id === id);
      if (idx === -1) return null;
      const current = memInventory[idx];
      const stock = partData.stock !== undefined ? Number(partData.stock) : current.stock;
      const minStock = partData.minStock !== undefined ? Number(partData.minStock) : current.minStock;
      const price = partData.price !== undefined ? Number(partData.price) : current.price;

      let status = 'In Stock';
      if (stock === 0) status = 'Critical';
      else if (stock <= minStock) status = 'Low Stock';

      memInventory[idx] = {
        ...current,
        ...partData,
        stock,
        minStock,
        price,
        status
      };
      return memInventory[idx];
    }
  },

  delete: async (id) => {
    if (isDbConnected()) {
      const res = await Inventory.deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initialLength = memInventory.length;
      memInventory = memInventory.filter(i => i.id !== id);
      return memInventory.length < initialLength;
    }
  }
};

module.exports = inventoryRepository;

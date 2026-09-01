const inventoryRepository = require('../repositories/inventoryRepository');

const inventoryService = {
  getAll: async () => {
    return await inventoryRepository.getAll();
  },

  getById: async (id) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return part;
  },

  create: async (partData) => {
    // Check if SKU exists
    const existing = await inventoryRepository.findBySku(partData.sku);
    if (existing) {
      const err = new Error(`SKU ${partData.sku} is already in use`);
      err.status = 409;
      throw err;
    }
    return await inventoryRepository.create(partData);
  },

  update: async (id, partData) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return await inventoryRepository.update(id, partData);
  },

  delete: async (id) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    await inventoryRepository.delete(id);
    return { success: true };
  },

  updateStock: async (id, stockCount) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return await inventoryRepository.update(id, { stock: stockCount });
  },

  deduct: async (id, quantity) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    
    // Deducts, floors at 0
    const newStock = Math.max(0, part.stock - quantity);
    return await inventoryRepository.update(id, { stock: newStock });
  }
};

module.exports = inventoryService;

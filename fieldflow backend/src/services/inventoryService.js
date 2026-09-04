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

  create: async (rawPartData) => {
    const partName = rawPartData.partName || rawPartData.name || 'Unnamed Part';
    const category = rawPartData.category || 'General';
    const stock = Number(rawPartData.stock ?? rawPartData.quantity ?? 0);
    const minStock = Number(rawPartData.minStock ?? rawPartData.reorderLevel ?? 5);
    const price = Number(rawPartData.price ?? rawPartData.unitPrice ?? 0);
    const sku = rawPartData.sku || `SKU-${category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const partData = {
      ...rawPartData,
      partName,
      name: partName,
      category,
      stock,
      quantity: stock,
      minStock,
      reorderLevel: minStock,
      price,
      unitPrice: price,
      sku
    };

    // Check if SKU exists
    const existing = await inventoryRepository.findBySku(sku);
    if (existing) {
      // Auto-adjust SKU instead of failing
      partData.sku = `${sku}-${Math.floor(100 + Math.random() * 900)}`;
    }

    return await inventoryRepository.create(partData);
  },

  update: async (id, rawPartData) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    const partData = { ...rawPartData };
    if (rawPartData.name && !rawPartData.partName) partData.partName = rawPartData.name;
    if (rawPartData.quantity !== undefined && rawPartData.stock === undefined) partData.stock = Number(rawPartData.quantity);
    if (rawPartData.unitPrice !== undefined && rawPartData.price === undefined) partData.price = Number(rawPartData.unitPrice);
    if (rawPartData.reorderLevel !== undefined && rawPartData.minStock === undefined) partData.minStock = Number(rawPartData.reorderLevel);

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
    return { success: true, message: `Part ${id} deleted` };
  },

  updateStock: async (id, stockData) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    let newStock;
    if (typeof stockData === 'object' && stockData !== null) {
      if (stockData.quantityChange !== undefined) {
        newStock = Math.max(0, part.stock + Number(stockData.quantityChange));
      } else if (stockData.stockCount !== undefined) {
        newStock = Math.max(0, Number(stockData.stockCount));
      } else if (stockData.quantity !== undefined) {
        newStock = Math.max(0, Number(stockData.quantity));
      } else {
        newStock = part.stock;
      }
    } else {
      newStock = Math.max(0, Number(stockData));
    }

    return await inventoryRepository.update(id, { stock: newStock });
  },

  deduct: async (id, quantity) => {
    const part = await inventoryRepository.findById(id);
    if (!part) {
      const err = new Error(`Inventory item with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    
    const newStock = Math.max(0, part.stock - Number(quantity));
    return await inventoryRepository.update(id, { stock: newStock });
  }
};

module.exports = inventoryService;

const Inventory = require('../models/Inventory');
const idGen = require('../utils/idGenerator');

const inventoryRepository = {
  getAll: async () => {
    return Inventory.find({}).lean();
  },

  findById: async (id) => {
    return Inventory.findOne({ id }).lean();
  },

  findBySku: async (sku) => {
    return Inventory.findOne({ sku: { $regex: new RegExp(`^${sku}$`, 'i') } }).lean();
  },

  create: async (partData) => {
    const existing = await Inventory.find({}, { id: 1 }).lean();
    const ids = existing.map(i => i.id);
    const newId = idGen.inventory(ids);
    const stock = Number(partData.stock);
    const minStock = Number(partData.minStock);
    
    // Server-side status determination
    let status = 'In Stock';
    if (stock === 0) status = 'Critical';
    else if (stock <= minStock) status = 'Low Stock';

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
  },

  update: async (id, partData) => {
    // Find current document
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
  },

  delete: async (id) => {
    const res = await Inventory.deleteOne({ id });
    return res.deletedCount > 0;
  }
};

module.exports = inventoryRepository;

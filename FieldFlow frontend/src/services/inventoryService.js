import api from './api';
import { USE_API } from './config';
import { mockInventory } from '../data/mockData';

const STORAGE_KEY = 'ff_mock_inventory';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInventory));
}

const getMockInventory = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockInventory = (inventory) => localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));

export const inventoryService = {
  getInventory: async () => {
    if (USE_API) {
      const response = await api.get('/inventory');
      return response.data;
    } else {
      return Promise.resolve(getMockInventory());
    }
  },

  addInventoryPart: async (partData) => {
    if (USE_API) {
      const response = await api.post('/inventory', partData);
      return response.data;
    } else {
      const inventory = getMockInventory();
      const newPart = {
        id: `inv-${Date.now()}`,
        partName: partData.partName,
        category: partData.category,
        sku: partData.sku,
        stock: Number(partData.stock),
        minStock: Number(partData.minStock),
        price: Number(partData.price),
        status: Number(partData.stock) === 0 ? 'Critical' : (Number(partData.stock) <= Number(partData.minStock) ? 'Low Stock' : 'In Stock')
      };
      inventory.unshift(newPart);
      saveMockInventory(inventory);
      return Promise.resolve(newPart);
    }
  },

  updateInventoryStock: async (partId, stockCount) => {
    if (USE_API) {
      const response = await api.patch(`/inventory/${partId}/stock`, { stockCount });
      return response.data;
    } else {
      const inventory = getMockInventory();
      let updatedPart = null;
      const updated = inventory.map(item => {
        if (item.id === partId) {
          const newStock = Number(stockCount);
          let status = 'In Stock';
          if (newStock === 0) status = 'Critical';
          else if (newStock <= item.minStock) status = 'Low Stock';

          updatedPart = { ...item, stock: newStock, status };
          return updatedPart;
        }
        return item;
      });
      saveMockInventory(updated);
      return Promise.resolve(updatedPart);
    }
  },

  // NOTE: When USE_API=true, stock deduction is handled server-side by POST /jobs/:id/complete
  // This method is only used in mock mode OR as a standalone manual deduct
  deductInventoryStock: async (partId, quantity) => {
    if (USE_API) {
      // Backend handles deduction inside job completion — calling /inventory/:id/stock
      // with the new computed value requires knowing current stock. Skip; handled server-side.
      return Promise.resolve({ id: partId });
    } else {
      const inventory = getMockInventory();
      let updatedPart = null;
      const updated = inventory.map(item => {
        if (item.id === partId) {
          const newStock = Math.max(0, item.stock - quantity);
          let status = 'In Stock';
          if (newStock === 0) status = 'Critical';
          else if (newStock <= item.minStock) status = 'Low Stock';

          updatedPart = { ...item, stock: newStock, status };
          return updatedPart;
        }
        return item;
      });
      saveMockInventory(updated);
      return Promise.resolve(updatedPart);
    }
  }
};

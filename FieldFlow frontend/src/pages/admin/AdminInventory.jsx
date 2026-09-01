import React, { useState, useContext } from 'react';
import { Package, Search, Plus, Edit3, ShieldAlert, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import StockBadge from '../../components/StockBadge';

const AdminInventory = () => {
  const { inventory, addInventoryPart, updateInventoryStock, t } = useContext(AppContext);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  // Form State - Add Part
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState('HVAC Parts');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(10);
  const [minStock, setMinStock] = useState(3);
  const [price, setPrice] = useState(500);
  const [errors, setErrors] = useState({});

  // Form State - Edit Stock
  const [editStockCount, setEditStockCount] = useState(0);

  const handleAddPart = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!partName) newErrors.partName = 'Part Name is required.';
    if (!sku) newErrors.sku = 'SKU is required.';
    if (price <= 0) newErrors.price = 'Price must be greater than zero.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addInventoryPart({ partName, category, sku, stock, minStock, price });

    // Reset Form
    setPartName('');
    setSku('');
    setStock(10);
    setMinStock(3);
    setPrice(500);
    setErrors({});
    setAddModalOpen(false);
  };

  const handleEditStockSubmit = (e) => {
    e.preventDefault();
    if (selectedPart) {
      updateInventoryStock(selectedPart.id, editStockCount);
      setEditModalOpen(false);
      setSelectedPart(null);
    }
  };

  const handleOpenEditModal = (part) => {
    setSelectedPart(part);
    setEditStockCount(part.stock);
    setEditModalOpen(true);
  };

  const filteredInventory = inventory.filter(item => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (item.partName && item.partName.toLowerCase().includes(query)) ||
      (item.sku && item.sku.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  const categoryOptions = [
    { label: 'HVAC Parts', value: 'HVAC Parts' },
    { label: 'RO Purifier Spares', value: 'RO Spares' },
    { label: 'Electrical Wiring', value: 'Electrical' },
    { label: 'Plumbing & Pipes', value: 'Plumbing' },
    { label: 'CCTV & Security spares', value: 'CCTV Spares' }
  ];

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Header action panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-main text-[var(--text-primary)]">{t('inventory') || 'Inventory Spares'}</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Track warehouse materials, monitor low stock reorder points, and adjust quantities.</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setAddModalOpen(true)}
        >
          {t('addNewPart') || 'Add New Part'}
        </Button>
      </div>

      {/* Grid Filter and Table Container */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs overflow-hidden flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center relative text-[var(--text-secondary)]">
          <Search className="w-4.5 h-4.5 absolute left-7 pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchInventory') || "Search parts by name, category, or SKU..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-10 py-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-surface-soft)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs w-full font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-7 p-1 hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-surface-soft)] cursor-pointer touch-target flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Cards List (Visible only on small screens) */}
        <div className="block lg:hidden divide-y divide-[var(--border-color)]">
          {filteredInventory.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <p className="font-bold text-sm">No items found matching "{searchQuery}"</p>
              <p className="text-xs mt-1">Try changing your search or filters.</p>
            </div>
          ) : (
            filteredInventory.map((item) => (
              <div 
                key={item.id}
                className="p-5 hover:bg-[var(--bg-surface-soft)]/20 transition-colors space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[var(--text-primary)] text-sm text-left">{item.partName}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] text-left font-mono mt-0.5">{item.sku}</p>
                  </div>
                  <StockBadge status={item.status} stockCount={item.stock} />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] text-left">
                  <span>Category: <strong>{item.category}</strong></span>
                  <span className="font-bold text-[var(--text-primary)]">{formatINR(item.price)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/30 text-xs text-left">
                  <span className="text-[var(--text-secondary)] font-medium">Stock: <strong>{item.stock}</strong></span>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-[var(--primary)] hover:text-[var(--primary-dark)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center gap-1 font-bold text-xs"
                    title="Adjust Stock Count"
                    aria-label="Adjust Stock Count"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Refill</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Inventory Table (Visible only on large screens) */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg-surface-soft)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase font-semibold">
                <th className="px-6 py-3">Part Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">SKU Code</th>
                <th className="px-6 py-3">Unit Price</th>
                <th className="px-6 py-3">Stock Level</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--text-secondary)] text-sm">
                    <p className="font-bold text-sm">No items found matching "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-surface-soft)]/30 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-[var(--text-primary)] text-left">{item.partName}</td>
                    <td className="px-6 py-3.5 text-[var(--text-secondary)] font-semibold text-left">{item.category}</td>
                    <td className="px-6 py-3.5 text-[var(--text-secondary)] font-mono opacity-80 text-left">{item.sku}</td>
                    <td className="px-6 py-3.5 font-bold text-[var(--text-primary)] text-left">{formatINR(item.price)}</td>
                    <td className="px-6 py-3.5 text-left">
                      <StockBadge status={item.status} stockCount={item.stock} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-[var(--primary)] hover:text-[var(--primary-dark)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors inline-flex items-center gap-1 font-bold cursor-pointer"
                        title="Adjust Stock Count"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Refill</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Part Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Part to Catalog"
        footerActions={
          <>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddPart}>
              Save Spare Part
            </Button>
          </>
        }
      >
        <form className="space-y-4 text-left" onSubmit={handleAddPart}>
          <Input
            label="Spare Part Name"
            required
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            error={errors.partName}
            placeholder="AC Fan Motor 1.5 Ton"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Spare Category"
              options={categoryOptions}
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              label="SKU Reference Code"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              error={errors.sku}
              placeholder="MOT-AC-1.5T"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Initial Stock Quantity"
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
            <Input
              label="Minimum Stock Threshold"
              type="number"
              required
              value={minStock}
              onChange={(e) => setMinStock(Number(e.target.value))}
              helpText="Triggers warning alerts"
            />
            <Input
              label="Unit Price (INR)"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              error={errors.price}
            />
          </div>
        </form>
      </Modal>

      {/* Edit Stock Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={selectedPart ? `Adjust Stock Count: ${selectedPart.partName}` : 'Adjust Stock'}
        footerActions={
          <>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditStockSubmit}>
              Update Quantity
            </Button>
          </>
        }
      >
        <form className="space-y-4 text-left" onSubmit={handleEditStockSubmit}>
          <div className="p-3 bg-[var(--bg-surface-soft)] border border-[var(--border-color)] rounded-lg flex items-center gap-3">
            <Package className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <p className="font-bold text-[var(--text-primary)] text-xs">SKU: {selectedPart?.sku}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Current Level: {selectedPart?.stock} units</p>
            </div>
          </div>
          <Input
            label="New Stock Count Level"
            type="number"
            required
            value={editStockCount}
            onChange={(e) => setEditStockCount(Number(e.target.value))}
            placeholder="e.g. 20"
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminInventory;

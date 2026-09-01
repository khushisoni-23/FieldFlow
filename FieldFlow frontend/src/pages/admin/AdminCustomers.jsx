import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Eye, Trash2, Mail, Phone, MapPin, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

const AdminCustomers = () => {
  const { customers, addCustomer, deleteCustomer, t } = useContext(AppContext);
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required.';
    if (!phone) newErrors.phone = 'Phone number is required.';
    if (!address) newErrors.address = 'Street address is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addCustomer({ name, phone, email, address });
    
    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setErrors({});
    setModalOpen(false);
  };

  const filteredCustomers = (customers || []).filter(c => {
    if (!c) return false;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.phone && c.phone.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.address && c.address.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-main text-[var(--text-primary)]">{t('customerAccounts') || 'Customer Accounts'}</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Manage client records, check service histories, and register details.</p>
        </div>
        <Button 
          variant="primary" 
          icon={UserPlus} 
          onClick={() => setModalOpen(true)}
        >
          {t('addCustomer') || 'Add Customer'}
        </Button>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs overflow-hidden flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center relative text-[var(--text-secondary)]">
          <Search className="w-4.5 h-4.5 absolute left-7 pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchCustomers') || "Search customers by name, phone, or email..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-10 py-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-surface-soft)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs w-full"
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
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <p className="font-bold text-sm">No customers found matching "{searchQuery}"</p>
              <p className="text-xs mt-1">Try changing your search or filters.</p>
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <div 
                key={cust.id}
                className="p-5 hover:bg-[var(--bg-surface-soft)]/20 transition-colors space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[var(--text-primary)] text-sm text-left">{cust.name}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] text-left">{cust.email}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border border-[#16805B]/20">
                    {cust.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] text-left">
                  <span>Phone: {cust.phone}</span>
                  <span className="font-bold text-[var(--text-primary)]">{cust.serviceCount} Jobs</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/35 text-xs text-left">
                  <span className="text-[var(--text-secondary)]">Last: {cust.lastService || 'N/A'}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/customers/${cust.id}`)}
                      className="p-2 text-[var(--primary)] hover:text-[var(--primary-dark)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                      title="View Details"
                      aria-label="View customer profile details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${cust.name}?`)) {
                          deleteCustomer(cust.id);
                        }
                      }}
                      className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                      title="Delete Customer"
                      aria-label="Delete customer account"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Customer Directory Table (Visible only on large screens) */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg-surface-soft)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase font-semibold">
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Service Count</th>
                <th className="px-6 py-3">Last Service Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--text-secondary)] text-sm">
                    <p className="font-bold text-sm">No customers found matching "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[var(--bg-surface-soft)]/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="text-left">
                        <p className="font-bold text-[var(--text-primary)]">{cust.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-normal">{cust.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[var(--text-primary)] font-medium text-left">{cust.phone}</td>
                    <td className="px-6 py-3.5 font-bold text-[var(--text-primary)] text-left">{cust.serviceCount} Jobs</td>
                    <td className="px-6 py-3.5 text-[var(--text-secondary)] text-left">{cust.lastService || 'N/A'}</td>
                    <td className="px-6 py-3.5 text-left">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border border-[#16805B]/20">
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/customers/${cust.id}`)}
                          className="p-2 text-[var(--primary)] hover:text-[var(--primary-dark)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                          title="View Details"
                          aria-label="View customer profile details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${cust.name}?`)) {
                              deleteCustomer(cust.id);
                            }
                          }}
                          className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                          title="Delete Customer"
                          aria-label="Delete customer account"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Customer Profile"
        footerActions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCustomer}>
              Create Customer
            </Button>
          </>
        }
      >
        <form className="space-y-4 text-left" onSubmit={handleAddCustomer}>
          <Input
            label="Full Customer Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Rahul Sharma"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@domain.com"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Service Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat/House number, Colony Name, Area, City, Pin Code"
              className={`
                block w-full rounded-lg border text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--bg-card)] text-[var(--text-primary)]
                ${errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-[var(--border-color)]'}
              `}
            />
            {errors.address && <p className="text-rose-600 font-medium text-[10px] mt-1">{errors.address}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCustomers;

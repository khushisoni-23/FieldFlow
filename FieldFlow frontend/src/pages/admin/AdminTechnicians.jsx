import React, { useState, useContext } from 'react';
import { UserCheck, Search, ShieldAlert, Plus, Phone, Mail, Wrench, X, Trash2, Eye } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Modal from '../../components/Modal';

const AdminTechnicians = () => {
  const { technicians, addTechnician, deleteTechnician, jobs, t } = useContext(AppContext);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Delete & View Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTechForView, setSelectedTechForView] = useState(null);

  // Toast notification
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('AC Repair');
  const [errors, setErrors] = useState({});

  const handleAddTech = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required.';
    if (!email) newErrors.email = 'Email address is required.';
    if (!phone) newErrors.phone = 'Phone number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addTechnician({ name, email, phone, specialization });

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setErrors({});
    setModalOpen(false);

    // Show toast
    setToastMessage("Technician added successfully.");
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  const handleDeleteClick = (tech) => {
    setTechToDelete(tech);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (techToDelete && techToDelete.id) {
      // confirm it exists
      if (technicians.some(t => t.id === techToDelete.id)) {
        await deleteTechnician(techToDelete.id);
        setToastMessage("Technician removed successfully.");
        setToastOpen(true);
        setTimeout(() => setToastOpen(false), 3000);
      }
      setDeleteModalOpen(false);
      setTechToDelete(null);
    }
  };

  const handleViewClick = (tech) => {
    setSelectedTechForView(tech);
    setViewModalOpen(true);
  };

  // Helper: Count active jobs for a technician
  const getActiveJobsCount = (techId) => {
    return jobs.filter(j => j.technicianId === techId && ['assigned', 'on the way', 'arrived', 'in progress'].includes(j.status.toLowerCase())).length;
  };

  const filteredTechs = technicians.filter(tech => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (tech.name && tech.name.toLowerCase().includes(query)) ||
      (tech.email && tech.email.toLowerCase().includes(query)) ||
      (tech.phone && tech.phone.includes(query)) ||
      (tech.specialization && tech.specialization.toLowerCase().includes(query))
    );
  });

  const specializationOptions = [
    { label: 'AC & Appliance Repair', value: 'AC Repair' },
    { label: 'Electrician Services', value: 'Electrician' },
    { label: 'RO & Water Purifier', value: 'RO Service' },
    { label: 'Plumbing Service', value: 'Plumbing' },
    { label: 'CCTV Installation & Config', value: 'CCTV Installation' }
  ];

  return (
    <div className="space-y-6 text-left text-[var(--text-primary)]">
      {/* Header action panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-main text-[var(--text-primary)]">{t('technicians') || 'Field Technicians'}</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Monitor specializations, track available agents, and invite new technicians to your fleet.</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setModalOpen(true)}
        >
          Onboard Technician
        </Button>
      </div>

      {/* Grid Filter and Table Container */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xs overflow-hidden flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center relative text-[var(--text-secondary)]">
          <Search className="w-4.5 h-4.5 absolute left-7 pointer-events-none" />
          <input
            type="text"
            placeholder="Search technicians by name or trade specialty..."
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
          {filteredTechs.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <p className="font-bold text-sm">No technicians found</p>
              <p className="text-xs mt-1">Try changing your search or filters.</p>
            </div>
          ) : (
            filteredTechs.map((tech) => (
              <div 
                key={tech.id}
                className="p-5 hover:bg-[var(--bg-surface-soft)]/20 transition-colors space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--soft-accent)] text-[var(--primary)] flex items-center justify-center font-black text-xs shrink-0">
                      {tech.name ? tech.name.charAt(0) : 'T'}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[var(--text-primary)] text-sm">{tech.name || 'Technician'}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">{tech.email}</p>
                    </div>
                  </div>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border
                    ${tech.status === 'Available' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border-[#16805B]/20' : ''}
                    ${tech.status === 'On Job' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50' : ''}
                    ${tech.status === 'Offline' ? 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-color)]' : ''}
                  `}>
                    {tech.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] text-left">
                  <span>Specialization: <strong>{tech.specialization}</strong></span>
                  <span>{getActiveJobsCount(tech.id)} jobs active</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/30 text-xs text-left">
                  <span>Phone: <strong>{tech.phone}</strong></span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleViewClick(tech)}
                      className="p-2 text-[var(--primary)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                      title="View Details"
                      aria-label={`View details of ${tech.name}`}
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tech)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer touch-target flex items-center justify-center"
                      title="Remove Technician"
                      aria-label={`Remove technician ${tech.name}`}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Technician directory table (Visible only on large screens) */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg-surface-soft)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase font-semibold">
                <th className="px-6 py-3">Technician Details</th>
                <th className="px-6 py-3">Specialization</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Active Assigned Tasks</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredTechs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--text-secondary)] text-sm">
                    <p className="font-bold text-sm">No technicians found</p>
                    <p className="text-xs mt-1">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTechs.map((tech) => (
                  <tr key={tech.id} className="hover:bg-[var(--bg-surface-soft)]/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--soft-accent)] text-[var(--primary)] flex items-center justify-center font-black text-xs shrink-0">
                          {tech.name ? tech.name.charAt(0) : 'T'}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-[var(--text-primary)]">{tech.name || 'Technician'}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] font-normal">{tech.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-[var(--text-secondary)] text-left">{tech.specialization}</td>
                    <td className="px-6 py-3.5 text-[var(--text-secondary)] font-medium text-left">{tech.phone}</td>
                    <td className="px-6 py-3.5 font-bold text-[var(--text-primary)] text-left">{getActiveJobsCount(tech.id)} jobs active</td>
                    <td className="px-6 py-3.5 text-left">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border
                        ${tech.status === 'Available' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border-[#16805B]/20' : ''}
                        ${tech.status === 'On Job' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50' : ''}
                        ${tech.status === 'Offline' ? 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-color)]' : ''}
                      `}>
                        {tech.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewClick(tech)}
                          className="p-1.5 text-[var(--primary)] hover:bg-[var(--soft-accent)] rounded-lg transition-colors cursor-pointer flex items-center justify-center font-bold text-xs"
                          title="View Details"
                          aria-label={`View details of ${tech.name}`}
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tech)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer flex items-center justify-center font-bold text-xs"
                          title="Remove Technician"
                          aria-label={`Remove technician ${tech.name}`}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
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

      {/* Onboard Technician Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Onboard Fleet Technician"
        footerActions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTech}>
              Register Agent
            </Button>
          </>
        }
      >
        <form className="space-y-4 text-left" onSubmit={handleAddTech}>
          <Input
            label="Full Technician Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Ramesh Prasad"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              placeholder="+91 98221 12233"
            />
            <Input
              label="Official Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="tech@fieldflow.in"
            />
          </div>

          <Select
            label="Technician Trade specialty"
            options={specializationOptions}
            required
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </form>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Technician?"
        footerActions={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer" 
              onClick={handleConfirmDelete}
            >
              Remove Technician
            </Button>
          </>
        }
      >
        <div className="text-left space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to remove <strong className="text-[var(--text-primary)]">{techToDelete?.name}</strong> from your technician team?
          </p>
          <div className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
            <span>This action cannot be undone. This technician will be removed from all future assignments.</span>
          </div>
        </div>
      </Modal>

      {/* View Profile Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Technician Profile Details"
        footerActions={
          <Button variant="outline" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        }
      >
        {selectedTechForView && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-color)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft-accent)] text-[var(--primary)] flex items-center justify-center font-black text-lg shrink-0">
                {selectedTechForView.name ? selectedTechForView.name.charAt(0) : 'T'}
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm text-[var(--text-primary)]">{selectedTechForView.name || 'Technician'}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{selectedTechForView.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[var(--text-secondary)]">Specialization</p>
                <p className="font-bold text-[var(--text-primary)] mt-1">{selectedTechForView.specialization}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Status</p>
                <span className={`
                  inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border
                  ${selectedTechForView.status === 'Available' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#16805B] border-[#16805B]/20' : ''}
                  ${selectedTechForView.status === 'On Job' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50' : ''}
                  ${selectedTechForView.status === 'Offline' ? 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-color)]' : ''}
                `}>
                  {selectedTechForView.status}
                </span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Phone Number</p>
                <p className="font-bold text-[var(--text-primary)] mt-1">{selectedTechForView.phone}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Active Workload</p>
                <p className="font-bold text-[var(--text-primary)] mt-1">{getActiveJobsCount(selectedTechForView.id)} Assigned Jobs</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Success toast notification */}
      {toastOpen && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-lg shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminTechnicians;

import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { customerService } from '../services/customerService';
import { jobService } from '../services/jobService';
import { technicianService } from '../services/technicianService';
import { inventoryService } from '../services/inventoryService';
import { paymentService } from '../services/paymentService';
import { notificationService } from '../services/notificationService';
import { en } from '../i18n/en';
import { hi } from '../i18n/hi';

const translations = { en, hi };
const USE_API = import.meta.env.VITE_USE_API === 'true';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Language & Translation State
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('ff_lang') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('ff_lang', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Dark Mode State
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem('ff_dark');
    return saved === 'true';
  });

  const setDarkMode = (isDark) => {
    setDarkModeState(isDark);
    localStorage.setItem('ff_dark', isDark);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // System Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ff_settings');
    return saved ? JSON.parse(saved) : {
      businessName: 'FieldFlow Solutions',
      phone: '+91 98765 43210',
      email: 'operations@fieldflow.in',
      address: 'Vashi, Navi Mumbai, MH',
      taxId: '27AAAAA0000A1Z1',
      currency: 'INR',
      notifNewJob: true,
      notifStock: true,
      notifPayment: true
    };
  });

  const updateSettings = (updated) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updated };
      localStorage.setItem('ff_settings', JSON.stringify(newSettings));
      return newSettings;
    });
    addNotification('Settings Updated', 'Your settings have been successfully updated.');
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Business State
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Loading is derived from startup initialization and operational data loading
  const loading = !initialized || dataLoading;

  // Restore authenticated session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('ff_token');
        if (token) {
          const user = await authService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            localStorage.setItem('ff_user', JSON.stringify(user));
          } else {
            localStorage.removeItem('ff_token');
            localStorage.removeItem('ff_user');
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        // Safely clear credentials if backend throws token errors
        if (import.meta.env.VITE_USE_API === 'true') {
          localStorage.removeItem('ff_token');
          localStorage.removeItem('ff_user');
          setCurrentUser(null);
        }
      } finally {
        setInitialized(true);
      }
    };
    restoreSession();
  }, []);

  // Sync Auth User to LocalStorage when changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ff_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ff_user');
    }
  }, [currentUser]);

  // Load datasets asynchronously after session restoration completes
  useEffect(() => {
    if (!initialized) return;

    const loadInitialData = async () => {
      if (!currentUser) {
        setDataLoading(false);
        return;
      }
      try {
        setDataLoading(true);
        const [custData, techData, invData, jobData, payData, notifData] = await Promise.all([
          customerService.getCustomers(),
          technicianService.getTechnicians(),
          inventoryService.getInventory(),
          jobService.getJobs(),
          paymentService.getPayments(),
          notificationService.getNotifications()
        ]);
        setCustomers(custData);
        setTechnicians(techData);
        setInventory(invData);
        setJobs(jobData);
        setPayments(payData);
        setNotifications(notifData);
      } catch (error) {
        console.error('Error loading initial data from services:', error);
      } finally {
        setDataLoading(false);
      }
    };
    loadInitialData();
  }, [currentUser, initialized]);

  // Auth Functions
  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password.' };
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (userData.role === 'TECHNICIAN' && res.user) {
        const newTech = await technicianService.createTechnician({
          id: res.user.technicianId,
          userId: res.user.id,
          name: userData.name,
          specialization: userData.specialization || 'General Service',
          phone: userData.phone,
          email: userData.email
        });
        setTechnicians(prev => [newTech, ...prev]);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCustomers([]);
    setTechnicians([]);
    setInventory([]);
    setJobs([]);
    setPayments([]);
    setNotifications([]);
  };

  // Customer Management
  const addCustomer = async (customerData) => {
    try {
      const newCust = await customerService.createCustomer(customerData);
      setCustomers(prev => [newCust, ...prev]);
      await addNotification('New Customer Added', `Customer ${newCust.name} has been onboarded.`);
      return newCust;
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      const updated = await customerService.updateCustomer(id, updatedData);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  // Job Management
  const createJob = async (jobData) => {
    try {
      const selectedCustomer = customers.find(c => c.id === jobData.customerId);
      const selectedTech = technicians.find(t => t.id === jobData.technicianId);

      const newJob = await jobService.createJob(jobData, selectedCustomer, selectedTech);

      if (jobData.technicianId && selectedTech) {
        await technicianService.updateTechnicianStatus(jobData.technicianId, 'On Job');
        setTechnicians(prev => prev.map(t => t.id === jobData.technicianId ? { ...t, status: 'On Job' } : t));
      }

      setJobs(prev => [newJob, ...prev]);

      if (selectedCustomer) {
        const newCount = selectedCustomer.serviceCount + 1;
        await customerService.updateCustomer(selectedCustomer.id, {
          serviceCount: newCount,
          lastService: jobData.scheduledDate
        });
        setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? {
          ...c,
          serviceCount: newCount,
          lastService: jobData.scheduledDate
        } : c));
      }

      await addNotification('New Job Created', `Job ${newJob.id} (${newJob.serviceType}) created for ${newJob.customerName}.`);
      return newJob;
    } catch (err) {
      console.error('Error creating job:', err);
      throw err;
    }
  };

  const updateJobStatus = async (jobId, newStatus, noteText = '') => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      const updatedJob = await jobService.updateJobStatus(jobId, newStatus, noteText, job.technicianName);

      let techStatus = null;
      if (newStatus === 'Completed') {
        techStatus = 'Available';
      } else if (['Assigned', 'On The Way', 'Arrived', 'In Progress'].includes(newStatus)) {
        techStatus = 'On Job';
      }

      if (techStatus && job.technicianId) {
        await technicianService.updateTechnicianStatus(job.technicianId, techStatus);
        setTechnicians(prev => prev.map(t => t.id === job.technicianId ? { ...t, status: techStatus } : t));
      }

      if (newStatus === 'Completed' || newStatus === 'Paid') {
        const totalAmt = updatedJob.totalAmount || 0;
        const payStatus = newStatus === 'Paid' ? 'Paid' : 'Pending';

        const newPayRecord = await paymentService.addPaymentRecord({
          jobId: updatedJob.id,
          customerName: updatedJob.customerName,
          amount: totalAmt,
          paymentMethod: updatedJob.paymentMethod || 'UPI',
          status: payStatus,
          date: new Date().toISOString().split('T')[0]
        });

        setPayments(prev => {
          const filtered = prev.filter(p => p.jobId !== jobId);
          return [newPayRecord, ...filtered];
        });
      }

      setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
      return updatedJob;
    } catch (err) {
      console.error('Error updating job status:', err);
      throw err;
    }
  };

  const completeJobDetails = async (jobId, data) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      if (USE_API) {
        // In API mode: backend handles stock deduction, payment creation, and technician status
        // Just call the complete endpoint and refresh state from the response
        const updatedJob = await jobService.completeJobDetails(jobId, data);
        setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));

        // Refresh inventory and technicians from server to stay in sync
        const [freshInv, freshTechs, freshPayments] = await Promise.all([
          inventoryService.getInventory(),
          technicianService.getTechnicians(),
          paymentService.getPayments()
        ]);
        setInventory(freshInv);
        setTechnicians(freshTechs);
        setPayments(freshPayments);

        await addNotification('Job Completed', `Job ${jobId} was successfully marked as Completed.`);
        return updatedJob;
      }

      // Mock mode: handle everything client-side
      // Safeguard: Prevent stock double deduction on duplicate completion calls
      if (job.status === 'Completed') {
        throw new Error('This service job is already marked as Completed.');
      }

      // Safeguard: Check that enough stock is present before proceeding with deduction
      for (const part of data.partsUsed) {
        const invItem = inventory.find(item => item.id === part.partId);
        if (!invItem) {
          throw new Error(`Part "${part.partName}" is not registered in the inventory system.`);
        }
        if (invItem.stock < part.quantity) {
          throw new Error(`Insufficient stock for "${part.partName}". Available: ${invItem.stock}, Required: ${part.quantity}`);
        }
      }

      const updatedJob = await jobService.completeJobDetails(jobId, data);

      for (const part of data.partsUsed) {
        const updatedPart = await inventoryService.deductInventoryStock(part.partId, part.quantity);
        setInventory(prev => prev.map(item => item.id === part.partId ? updatedPart : item));

        if (updatedPart.stock <= updatedPart.minStock) {
          await addNotification('Low Stock Alert', `${updatedPart.partName} is low on stock (${updatedPart.stock} remaining).`);
        }
      }

      if (job.technicianId) {
        await technicianService.updateTechnicianStatus(job.technicianId, 'Available');
        setTechnicians(prev => prev.map(t => t.id === job.technicianId ? { ...t, status: 'Available' } : t));
      }

      const payStatus = data.paymentStatus || 'Pending';
      const payRecord = await paymentService.addPaymentRecord({
        jobId: updatedJob.id,
        customerName: updatedJob.customerName,
        amount: updatedJob.totalAmount,
        paymentMethod: data.paymentMethod || 'UPI',
        status: payStatus,
        date: new Date().toISOString().split('T')[0]
      });

      setPayments(prev => {
        const filtered = prev.filter(p => p.jobId !== jobId);
        return [payRecord, ...filtered];
      });

      setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
      await addNotification('Job Completed', `Job ${jobId} was successfully marked as Completed.`);
      return updatedJob;
    } catch (err) {
      console.error('Error completing job details:', err);
      throw err;
    }
  };

  const collectPayment = async (jobId, method = 'UPI') => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      const updatedJob = await jobService.collectPayment(jobId, method, job.totalAmount);
      await paymentService.updatePaymentStatus(jobId, 'Paid');

      setPayments(prev => prev.map(p => p.jobId === jobId ? { ...p, status: 'Paid', paymentMethod: method } : p));
      setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));

      await addNotification('Payment Collected', `Payment of ₹${job.totalAmount} received for job ${jobId}.`);
      return updatedJob;
    } catch (err) {
      console.error('Error collecting payment:', err);
      throw err;
    }
  };

  // Inventory Management
  const addInventoryPart = async (partData) => {
    try {
      const newPart = await inventoryService.addInventoryPart(partData);
      setInventory(prev => [newPart, ...prev]);
      return newPart;
    } catch (err) {
      console.error('Error adding inventory part:', err);
      throw err;
    }
  };

  const updateInventoryStock = async (partId, stockCount) => {
    try {
      const updatedPart = await inventoryService.updateInventoryStock(partId, stockCount);
      setInventory(prev => prev.map(item => item.id === partId ? updatedPart : item));
      return updatedPart;
    } catch (err) {
      console.error('Error updating inventory stock:', err);
      throw err;
    }
  };

  // Technician Management
  const addTechnician = async (techData) => {
    try {
      const newTech = await technicianService.createTechnician(techData);
      setTechnicians(prev => [newTech, ...prev]);
      return newTech;
    } catch (err) {
      console.error('Error adding technician:', err);
      throw err;
    }
  };

  const deleteTechnician = async (id) => {
    try {
      await technicianService.deleteTechnician(id);
      setTechnicians(prev => prev.filter(t => t.id !== id));
      
      // Gracefully handle missing technicians by moving their assigned jobs back to Unassigned Pending queue
      setJobs(prev => prev.map(job => {
        if (job.technicianId === id) {
          return {
            ...job,
            technicianId: null,
            technicianName: 'Unassigned',
            status: 'Pending'
          };
        }
        return job;
      }));

      await addNotification('Technician Removed', 'Technician removed from fleet successfully.');
    } catch (err) {
      console.error('Error deleting technician:', err);
      throw err;
    }
  };

  // Helper Notifications
  const addNotification = async (title, message) => {
    try {
      const newNotif = await notificationService.addNotification(title, message);
      setNotifications(prev => [newNotif, ...prev]);
      return newNotif;
    } catch (err) {
      console.error('Error adding notification:', err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAll();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      darkMode,
      setDarkMode,
      settings,
      updateSettings,
      currentUser,
      login,
      registerUser,
      logout,
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      technicians,
      addTechnician,
      deleteTechnician,
      inventory,
      addInventoryPart,
      updateInventoryStock,
      jobs,
      createJob,
      updateJobStatus,
      completeJobDetails,
      collectPayment,
      payments,
      notifications,
      markNotificationAsRead,
      clearAllNotifications,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

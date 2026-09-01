import api from './api';

const USE_API = import.meta.env.VITE_USE_API === 'true';

export const reportService = {
  getAnalyticsData: async (contextData) => {
    if (USE_API) {
      const response = await api.get('/reports/analytics');
      return response.data;
    } else {
      const { jobs = [], technicians = [], payments = [], inventory = [] } = contextData;

      const collectedRevenue = payments
        .filter(p => p.status === 'Paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const pendingRevenue = payments
        .filter(p => p.status === 'Pending')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const totalRevenueVal = collectedRevenue + pendingRevenue;

      const jobsByStatus = {
        Completed: jobs.filter(j => j.status === 'Completed').length,
        InProgress: jobs.filter(j => ['in progress', 'on the way', 'arrived'].includes(j.status.toLowerCase())).length,
        Pending: jobs.filter(j => j.status === 'Pending' || j.status === 'Assigned').length,
        Delayed: jobs.filter(j => j.status === 'Delayed').length
      };

      const serviceCategories = ['AC Repair', 'AC Service', 'RO Service', 'Electrical Repair', 'Plumbing', 'CCTV Installation'];
      const categoryCounts = serviceCategories.map(cat => ({
        name: cat,
        Jobs: jobs.filter(j => j.serviceType === cat).length
      })).sort((a, b) => b.Jobs - a.Jobs);

      const techWorkloads = technicians.map(tech => ({
        name: tech.name,
        Completed: jobs.filter(j => j.technicianId === tech.id && j.status === 'Completed').length,
        Assigned: jobs.filter(j => j.technicianId === tech.id).length
      })).sort((a, b) => b.Completed - a.Completed);

      const lowStockItems = inventory.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length;
      const healthyStockItems = inventory.length - lowStockItems;

      const inventoryHealthData = [
        { name: 'Sufficiently Stocked', value: healthyStockItems, color: '#16805B' },
        { name: 'Low / Out of Stock', value: lowStockItems, color: '#C84B4B' }
      ];

      const monthlyRevenueData = [
        { name: 'May 2026', Revenue: 22000, Outstanding: 4000 },
        { name: 'Jun 2026', Revenue: 34000, Outstanding: 6500 },
        { name: 'Jul 2026', Revenue: 48000, Outstanding: 8200 },
        { name: 'Aug 2026', Revenue: collectedRevenue, Outstanding: pendingRevenue }
      ];

      return Promise.resolve({
        totalRevenue: totalRevenueVal,
        collectedRevenue,
        pendingRevenue,
        jobsByStatus,
        categoryCounts,
        techWorkloads,
        inventoryHealthData,
        monthlyRevenueData
      });
    }
  }
};

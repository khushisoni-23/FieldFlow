const jobRepository = require('../repositories/jobRepository');
const technicianRepository = require('../repositories/technicianRepository');
const inventoryRepository = require('../repositories/inventoryRepository');

const reportService = {
  getAnalytics: async () => {
    const [jobs, technicians, inventory] = await Promise.all([
      jobRepository.getAll(),
      technicianRepository.getAll(),
      inventoryRepository.getAll()
    ]);

    // 1. Revenue computations
    let totalRevenue = 0;
    let collectedRevenue = 0;
    let pendingRevenue = 0;

    jobs.forEach(job => {
      const amt = Number(job.totalAmount || job.estimatedAmount || 0);
      totalRevenue += amt;
      if (job.paymentStatus === 'Paid') {
        collectedRevenue += amt;
      } else {
        pendingRevenue += amt;
      }
    });

    // 2. Job status aggregates
    const jobsByStatus = {
      Completed: 0,
      InProgress: 0,
      Pending: 0,
      Delayed: 0
    };

    jobs.forEach(job => {
      const status = job.status;
      if (status === 'Completed' || status === 'Paid') {
        jobsByStatus.Completed++;
      } else if (status === 'In Progress' || status === 'Arrived' || status === 'On The Way') {
        jobsByStatus.InProgress++;
      } else if (status === 'Pending' || status === 'Assigned') {
        jobsByStatus.Pending++;
      } else if (status === 'Delayed') {
        jobsByStatus.Delayed++;
      }
    });

    // 3. Category counts (service type workload)
    const categoryMap = {};
    jobs.forEach(job => {
      const type = job.serviceType || 'Other';
      categoryMap[type] = (categoryMap[type] || 0) + 1;
    });

    const categoryCounts = Object.keys(categoryMap).map(name => ({
      name,
      Jobs: categoryMap[name]
    }));

    // 4. Technician workloads
    const techMap = {};
    // Pre-populate all techs to ensure workload is reported even if 0
    technicians.forEach(t => {
      techMap[t.name] = { Completed: 0, Assigned: 0 };
    });

    jobs.forEach(job => {
      if (job.technicianId && job.technicianName && job.technicianName !== 'Unassigned') {
        const tName = job.technicianName;
        if (!techMap[tName]) {
          techMap[tName] = { Completed: 0, Assigned: 0 };
        }

        if (job.status === 'Completed' || job.status === 'Paid') {
          techMap[tName].Completed++;
        } else {
          techMap[tName].Assigned++;
        }
      }
    });

    const techWorkloads = Object.keys(techMap).map(name => ({
      name,
      Completed: techMap[name].Completed,
      Assigned: techMap[name].Assigned
    }));

    // 5. Inventory health data
    let sufficientlyStocked = 0;
    let lowOrOutStock = 0;

    inventory.forEach(item => {
      if (item.status === 'In Stock') {
        sufficientlyStocked++;
      } else {
        lowOrOutStock++;
      }
    });

    const inventoryHealthData = [
      { name: 'Sufficiently Stocked', value: sufficientlyStocked, color: '#16805B' },
      { name: 'Low / Out of Stock', value: lowOrOutStock, color: '#C84B4B' }
    ];

    // 6. Monthly revenue data (dynamic grouping + comment indicator for historical)
    // NOTE: Historical monthlyRevenueData (beyond active current months) acts as placeholder 
    // until real historical data is generated and saved in a database storage.
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    jobs.forEach(job => {
      const dateStr = job.scheduledDate || job.createdAt;
      if (!dateStr || dateStr.length < 7) return;

      const year = dateStr.substring(0, 4);
      const monthNum = parseInt(dateStr.substring(5, 7), 10);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return;

      const monthName = monthNames[monthNum - 1];
      const label = `${monthName} ${year}`;
      const sortKey = `${year}-${monthNum.toString().padStart(2, '0')}`;

      const amt = Number(job.totalAmount || job.estimatedAmount || 0);

      if (!monthlyMap[label]) {
        monthlyMap[label] = { sortKey, Revenue: 0, Outstanding: 0 };
      }

      if (job.paymentStatus === 'Paid') {
        monthlyMap[label].Revenue += amt;
      } else {
        monthlyMap[label].Outstanding += amt;
      }
    });

    const monthlyRevenueData = Object.keys(monthlyMap)
      .map(name => ({
        name,
        sortKey: monthlyMap[name].sortKey,
        Revenue: monthlyMap[name].Revenue,
        Outstanding: monthlyMap[name].Outstanding
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ sortKey, ...rest }) => rest);

    // Default current month if no monthly data computed
    if (monthlyRevenueData.length === 0) {
      const today = new Date();
      const currentLabel = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
      monthlyRevenueData.push({
        name: currentLabel,
        Revenue: collectedRevenue,
        Outstanding: pendingRevenue
      });
    }

    return {
      totalRevenue,
      collectedRevenue,
      pendingRevenue,
      jobsByStatus,
      categoryCounts,
      techWorkloads,
      inventoryHealthData,
      monthlyRevenueData
    };
  }
};

module.exports = reportService;

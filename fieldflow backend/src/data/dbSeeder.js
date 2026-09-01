const User = require('../models/User');
const Customer = require('../models/Customer');
const Technician = require('../models/Technician');
const Inventory = require('../models/Inventory');
const Job = require('../models/Job');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const mockData = require('./mockDatabase');

const seedDB = async () => {
  try {
    // Check if seeding is already done (by checking User count)
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seeding.');
      return;
    }

    console.log('Seeding Database...');

    // Clear any existing partial data to avoid duplicate key issues
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Technician.deleteMany({}),
      Inventory.deleteMany({}),
      Job.deleteMany({}),
      Payment.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // Insert mock data
    await User.insertMany(mockData.users);
    await Customer.insertMany(mockData.customers);
    await Technician.insertMany(mockData.technicians);
    await Inventory.insertMany(mockData.inventory);
    await Job.insertMany(mockData.jobs);
    await Payment.insertMany(mockData.payments);
    await Notification.insertMany(mockData.notifications);

    console.log('Database Seeded Successfully!');
  } catch (error) {
    console.error(`Database Seeding Error: ${error.message}`);
  }
};

module.exports = seedDB;

const mongoose = require('mongoose');
const User = require('../models/User');
const idGen = require('../utils/idGenerator');
const mockData = require('../data/mockDatabase');

let memUsers = [...mockData.users];

const isDbConnected = () => mongoose.connection.readyState === 1;

const userRepository = {
  getAll: async () => {
    if (isDbConnected()) return User.find({}).lean();
    return memUsers;
  },

  findById: async (id) => {
    if (isDbConnected()) return User.findOne({ id }).lean();
    return memUsers.find(u => u.id === id) || null;
  },

  findByEmail: async (email) => {
    if (isDbConnected()) return User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).lean();
    return memUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  create: async (userData) => {
    if (isDbConnected()) {
      const existingUsers = await User.find({}, { id: 1 }).lean();
      const ids = existingUsers.map(u => u.id);
      const newId = idGen.generateNextId('USER-', ids, 100);
      
      const newUser = new User({
        id: newId,
        ...userData
      });
      
      await newUser.save();
      return newUser.toObject();
    } else {
      const ids = memUsers.map(u => u.id);
      const newId = idGen.generateNextId('USER-', ids, 100);
      const newUser = {
        id: newId,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memUsers.push(newUser);
      return newUser;
    }
  }
};

module.exports = userRepository;

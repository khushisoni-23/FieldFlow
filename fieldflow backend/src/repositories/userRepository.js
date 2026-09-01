const User = require('../models/User');
const idGen = require('../utils/idGenerator');

const userRepository = {
  getAll: async () => {
    return User.find({}).lean();
  },

  findById: async (id) => {
    return User.findOne({ id }).lean();
  },

  findByEmail: async (email) => {
    return User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).lean();
  },

  create: async (userData) => {
    const existingUsers = await User.find({}, { id: 1 }).lean();
    const ids = existingUsers.map(u => u.id);
    const newId = idGen.generateNextId('USER-', ids, 100);
    
    const newUser = new User({
      id: newId,
      ...userData
    });
    
    await newUser.save();
    return newUser.toObject();
  }
};

module.exports = userRepository;

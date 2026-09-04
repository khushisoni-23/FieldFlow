const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const technicianRepository = require('../repositories/technicianRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfieldflowjwttoken123!';

const authService = {
  login: async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const { password: _, ...userWithoutPassword } = user;
    let userData = { ...userWithoutPassword };

    if (user.role === 'TECHNICIAN') {
      const technician = await technicianRepository.findByUserId(user.id);
      if (technician) {
        userData.technicianId = technician.id;
      }
    }

    return {
      token,
      user: userData
    };
  },

  register: async (userData) => {
    // Check if email already registered
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      const err = new Error('Email address is already registered');
      err.status = 409;
      throw err;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const role = userData.role.toUpperCase();

    // Create user
    const newUser = await userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role
    });

    // If technician, auto-create technician record
    if (role === 'TECHNICIAN') {
      await technicianRepository.create({
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: userData.phone || '+91 99999 99999',
        specialization: userData.specialization || 'General',
        skills: userData.specialization ? [userData.specialization] : ['General']
      });
    }

    const { password: _, ...userWithoutPassword } = newUser;
    return { ...userWithoutPassword, user: userWithoutPassword };
  },

  getProfile: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User profile not found');
      err.status = 404;
      throw err;
    }

    const { password: _, ...userWithoutPassword } = user;
    let userData = { ...userWithoutPassword };

    if (user.role === 'TECHNICIAN') {
      const technician = await technicianRepository.findByUserId(user.id);
      if (technician) {
        userData.technicianId = technician.id;
      }
    }

    return userData;
  }
};

module.exports = authService;

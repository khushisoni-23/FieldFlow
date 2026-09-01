const authService = require('../services/authService');

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result); // Returns { token, user }
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user); // Returns the created user object
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json(user); // Returns user object
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // Express JWT logout is stateless client-side (removing the token).
      // We just respond with success representation.
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;

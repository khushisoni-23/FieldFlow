const { body } = require('express-validator');

const authValidator = {
  register: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .trim()
      .toUpperCase()
      .isIn(['ADMIN', 'TECHNICIAN'])
      .withMessage('Role must be ADMIN or TECHNICIAN'),
    body('specialization')
      .optional()
      .trim()
  ],

  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('A valid email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

module.exports = authValidator;

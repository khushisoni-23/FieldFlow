const { body } = require('express-validator');

const technicianValidator = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('specialization')
      .trim()
      .notEmpty()
      .withMessage('Specialization is required'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('A valid email is required')
  ],

  updateStatus: [
    body('status')
      .trim()
      .isIn(['Available', 'On Job', 'Offline', 'Busy'])
      .withMessage('Status must be Available, On Job, Busy, or Offline')
  ]
};

module.exports = technicianValidator;

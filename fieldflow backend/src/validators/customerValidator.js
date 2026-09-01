const { body } = require('express-validator');

const customerValidator = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),
    body('email')
      .optional({ checkFalsy: true })
      .trim()
      .isEmail()
      .withMessage('Invalid email format'),
    body('address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),
    body('city')
      .optional()
      .trim(),
    body('state')
      .optional()
      .trim(),
    body('pincode')
      .optional()
      .trim(),
    body('notes')
      .optional()
      .trim()
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('phone')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Phone cannot be empty'),
    body('email')
      .optional({ checkFalsy: true })
      .trim()
      .isEmail()
      .withMessage('Invalid email format'),
    body('address')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('status')
      .optional()
      .trim()
      .notEmpty()
  ]
};

module.exports = customerValidator;

const { body } = require('express-validator');

const paymentValidator = {
  create: [
    body('jobId')
      .trim()
      .notEmpty()
      .withMessage('jobId is required'),
    body('customerName')
      .trim()
      .notEmpty()
      .withMessage('Customer name is required'),
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom(val => Number(val) >= 0)
      .withMessage('Amount cannot be negative'),
    body('paymentMethod')
      .optional()
      .trim(),
    body('status')
      .optional()
      .trim()
      .isIn(['Pending', 'Paid'])
      .withMessage('Status must be Pending or Paid'),
    body('date')
      .optional()
      .trim()
  ],

  updateStatus: [
    body('status')
      .trim()
      .isIn(['Pending', 'Paid'])
      .withMessage('Status must be Pending or Paid')
  ]
};

module.exports = paymentValidator;

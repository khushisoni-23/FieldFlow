const { body } = require('express-validator');

const jobValidator = {
  create: [
    body('customerId')
      .trim()
      .notEmpty()
      .withMessage('CustomerId is required'),
    body('serviceType')
      .trim()
      .notEmpty()
      .withMessage('Service type is required'),
    body('problemDescription')
      .trim()
      .notEmpty()
      .withMessage('Problem description is required'),
    body('priority')
      .trim()
      .isIn(['Low', 'Medium', 'High', 'Urgent'])
      .withMessage('Priority must be Low, Medium, High, or Urgent'),
    body('scheduledDate')
      .trim()
      .notEmpty()
      .withMessage('Scheduled date is required'),
    body('scheduledTime')
      .trim()
      .notEmpty()
      .withMessage('Scheduled time is required'),
    body('technicianId')
      .optional({ checkFalsy: true })
      .trim(),
    body('address')
      .optional()
      .trim(),
    body('notes')
      .optional()
      .trim()
  ],

  updateStatus: [
    body('status')
      .trim()
      .isIn(['Pending', 'Assigned', 'On The Way', 'Arrived', 'In Progress', 'Completed', 'Delayed', 'Paid'])
      .withMessage('Invalid job status value'),
    body('noteText')
      .optional()
      .trim()
  ],

  complete: [
    body('serviceCharge')
      .isNumeric()
      .withMessage('Service charge must be a number')
      .custom(val => Number(val) >= 0)
      .withMessage('Service charge cannot be negative'),
    body('partsUsed')
      .optional()
      .isArray()
      .withMessage('partsUsed must be an array of parts'),
    body('notes')
      .optional()
      .trim(),
    body('paymentStatus')
      .optional()
      .isIn(['Pending', 'Paid'])
      .withMessage('Payment status must be Pending or Paid'),
    body('paymentMethod')
      .optional()
      .trim(),
    body('beforePhoto')
      .optional()
      .trim(),
    body('afterPhoto')
      .optional()
      .trim()
  ],

  payment: [
    body('method')
      .trim()
      .notEmpty()
      .withMessage('Payment method is required'),
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom(val => Number(val) >= 0)
      .withMessage('Amount cannot be negative')
  ],

  assign: [
    body('technicianId')
      .trim()
      .notEmpty()
      .withMessage('TechnicianId is required')
  ]
};

module.exports = jobValidator;

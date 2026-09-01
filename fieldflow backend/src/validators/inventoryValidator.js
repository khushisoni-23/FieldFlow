const { body } = require('express-validator');

const inventoryValidator = {
  create: [
    body('partName')
      .trim()
      .notEmpty()
      .withMessage('Part name is required'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    body('sku')
      .trim()
      .notEmpty()
      .withMessage('SKU is required'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('minStock')
      .isInt({ min: 0 })
      .withMessage('MinStock must be a non-negative integer'),
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .custom(val => Number(val) >= 0)
      .withMessage('Price cannot be negative')
  ],

  updateStock: [
    body('stockCount')
      .isInt({ min: 0 })
      .withMessage('stockCount must be a non-negative integer')
  ],

  deduct: [
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity to deduct must be a positive integer')
  ]
};

module.exports = inventoryValidator;

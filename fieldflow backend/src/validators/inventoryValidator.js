const { body } = require('express-validator');

const inventoryValidator = {
  create: [
    body(['partName', 'name'])
      .custom((value, { req }) => {
        const name = req.body.partName || req.body.name;
        if (!name || !name.trim()) throw new Error('Part name is required');
        return true;
      }),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    body('sku')
      .optional()
      .trim(),
    body(['stock', 'quantity'])
      .custom((value, { req }) => {
        const stock = req.body.stock !== undefined ? req.body.stock : req.body.quantity;
        if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
          throw new Error('Stock must be a non-negative number');
        }
        return true;
      }),
    body(['minStock', 'reorderLevel'])
      .optional()
      .custom(val => val === undefined || (!isNaN(Number(val)) && Number(val) >= 0))
      .withMessage('MinStock must be a non-negative number'),
    body(['price', 'unitPrice'])
      .custom((value, { req }) => {
        const price = req.body.price !== undefined ? req.body.price : req.body.unitPrice;
        if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
          throw new Error('Price must be a non-negative number');
        }
        return true;
      })
  ],

  updateStock: [
    body(['stockCount', 'quantity', 'quantityChange'])
      .custom((value, { req }) => {
        const val = req.body.stockCount ?? req.body.quantity ?? req.body.quantityChange;
        if (val === undefined || isNaN(Number(val))) {
          throw new Error('Valid stock number is required');
        }
        return true;
      })
  ],

  deduct: [
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity to deduct must be a positive integer')
  ]
};

module.exports = inventoryValidator;

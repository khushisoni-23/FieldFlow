const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const inventoryValidator = require('../validators/inventoryValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);
router.post('/', inventoryValidator.create, validationHandler, inventoryController.create);
router.put('/:id', inventoryValidator.create, validationHandler, inventoryController.update); // Reuse create validations for full PUT
router.delete('/:id', inventoryController.delete);
router.patch('/:id/stock', inventoryValidator.updateStock, validationHandler, inventoryController.updateStock);
router.post('/:id/deduct', inventoryValidator.deduct, validationHandler, inventoryController.deduct);

module.exports = router;

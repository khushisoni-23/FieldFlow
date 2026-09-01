const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const customerValidator = require('../validators/customerValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/', customerValidator.create, validationHandler, customerController.create);
router.put('/:id', customerValidator.update, validationHandler, customerController.update);
router.delete('/:id', customerController.delete);

module.exports = router;

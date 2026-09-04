const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const technicianValidator = require('../validators/technicianValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Technicians
 *   description: Technician directory, workload tracking, and status management
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/technicians:
 *   get:
 *     summary: Retrieve all technicians
 *     description: Returns a list of all technicians including their status, workload, and ratings.
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of technicians
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Technician'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', technicianController.getAll);

/**
 * @swagger
 * /api/technicians/{id}:
 *   get:
 *     summary: Get technician by ID
 *     description: Retrieve detailed information about a specific technician.
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technician ID (e.g. TECH-101)
 *     responses:
 *       200:
 *         description: Technician details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technician'
 *       404:
 *         description: Technician not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', technicianController.getById);

/**
 * @swagger
 * /api/technicians:
 *   post:
 *     summary: Create a new technician
 *     description: Creates a new technician profile.
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechnicianInput'
 *     responses:
 *       201:
 *         description: Technician created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technician'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', technicianValidator.create, validationHandler, technicianController.create);

/**
 * @swagger
 * /api/technicians/{id}/status:
 *   patch:
 *     summary: Update technician availability status
 *     description: Updates the operational status of a technician (Available, On Job, Busy, Offline).
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technician ID (e.g. TECH-101)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechnicianStatusUpdate'
 *     responses:
 *       200:
 *         description: Technician status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technician'
 *       400:
 *         description: Validation error or invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Technician not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/status', technicianValidator.updateStatus, validationHandler, technicianController.updateStatus);

/**
 * @swagger
 * /api/technicians/{id}:
 *   delete:
 *     summary: Delete a technician
 *     description: Deletes a technician record by ID.
 *     tags: [Technicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technician ID (e.g. TECH-101)
 *     responses:
 *       200:
 *         description: Technician deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Technician not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', technicianController.delete);

module.exports = router;

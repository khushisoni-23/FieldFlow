const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global unified search across customers, jobs, technicians, and inventory
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Global multi-entity search
 *     description: Searches across Customers, Jobs, Technicians, and Inventory for matching names, IDs, phones, or descriptions.
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword or query string
 *         example: Metro
 *     responses:
 *       200:
 *         description: Search results grouped by entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', searchController.globalSearch);

module.exports = router;

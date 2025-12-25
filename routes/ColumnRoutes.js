/**
 * Column Routes
 * Defines all endpoints for dynamic column management
 */

import express from 'express';
import {
  getColumns,
  getColumnById,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns
} from '../controllers/ColumnController.js';

const router = express.Router();

// Column CRUD routes
router.get('/', getColumns);
router.get('/:id', getColumnById);
router.post('/add', createColumn);
router.patch('/:id', updateColumn);
router.delete('/:id', deleteColumn);

// Column reordering
router.patch('/reorder', reorderColumns);

export default router;

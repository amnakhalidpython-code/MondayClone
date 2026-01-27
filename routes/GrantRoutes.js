/**
 * Grant Routes
 * Defines all endpoints for grant management
 */

import express from 'express';
import {
    getGrants,
    getGrantById,
    createGrant,
    updateGrant,
    deleteGrant,
    getGrantStats,
    uploadGrantFile
} from '../controllers/GrantController.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Grant CRUD routes
router.get('/', getGrants);
router.get('/stats/summary', getGrantStats);
router.get('/:id', getGrantById);
router.post('/', createGrant);
router.patch('/:id', updateGrant);
router.delete('/:id', deleteGrant);

// File upload routes
router.post('/:id/files', upload.single('file'), handleMulterError, uploadGrantFile);

export default router;
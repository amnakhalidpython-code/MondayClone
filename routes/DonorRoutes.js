/**
 * Donor Routes
 * Defines all endpoints for donor management
 */

import express from 'express';
import {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
  updateCustomField,
  uploadDonorFile,
  getDonorFiles
} from '../controllers/DonorController.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Donor CRUD routes
router.get('/', getDonors);
router.get('/:id', getDonorById);
router.post('/', createDonor);
router.patch('/:id', updateDonor);
router.delete('/:id', deleteDonor);

// Custom field routes
router.patch('/:id/custom', updateCustomField);

// File upload routes
router.post('/:id/files', upload.single('file'), handleMulterError, uploadDonorFile);
router.get('/:id/files', getDonorFiles);

export default router;

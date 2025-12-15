// routes/TemplateRoutes.js
import express from 'express';
import {
  getAllTemplates,
  getTemplatesByCategory,
  getTemplateById,
  createBoardFromTemplate,
  searchTemplates,
  getAllCategories
} from '../controllers/TemplateController.js';

const router = express.Router();

// Get all templates
router.get('/templates', getAllTemplates);

// Get all categories
router.get('/templates/categories', getAllCategories);

// Search templates
router.get('/templates/search', searchTemplates);

// Get templates by category
router.get('/templates/category/:category', getTemplatesByCategory);

// Get template by ID
router.get('/templates/:id', getTemplateById);

// Create board from template (MAIN ROUTE)
router.post('/templates/:templateId/use', createBoardFromTemplate);

export default router;
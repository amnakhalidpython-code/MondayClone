// routes/boardRoutes.js
import express from 'express';
const router = express.Router();

import {
  createBoard,
  getBoardById,
  getAllBoards,
  updateBoard,
  deleteBoard,
  addBoardItem,
  searchBoards
} from '../controllers/BoardController.js'; // 👈 file name small letters recommended

// Import auth middleware (agar authentication hai)
// import { protect } from '../middleware/authMiddleware.js';

// Apply protect middleware to all routes (uncomment agar auth chahiye)
// router.use(protect);

// ================================
// ✅ Board Routes
// ================================

// GET /api/boards → Get all boards
// POST /api/boards → Create new board
router.route('/')
  .get(getAllBoards)
  .post(createBoard);

// GET /api/boards/search?q=term
router.route('/search')
  .get(searchBoards);

// GET /api/boards/:id → Get single board
// PUT /api/boards/:id → Update board
// DELETE /api/boards/:id → Delete board
router.route('/:id')
  .get(getBoardById)
  .put(updateBoard)
  .delete(deleteBoard);

// POST /api/boards/:id/items → Add item to board
router.route('/:id/items')
  .post(addBoardItem);

// ================================
// ✅ ES Module Export
// ================================
export default router;

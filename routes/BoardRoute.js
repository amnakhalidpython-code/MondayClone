// routes/boardRoutes.js
import express from 'express';
const router = express.Router();

import {
  createBoard,
  getBoardById,
  getUserBoards,
  getAllBoards,
  updateBoard,
  deleteBoard,
  addBoardItem,
  updateBoardItem,
  deleteBoardItem,
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

// GET /api/boards/user/:userId → Get all boards for a user
router.route('/user/:userId')
  .get(getUserBoards);

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

// PUT /api/boards/:id/items/:itemId → Update item
// DELETE /api/boards/:id/items/:itemId → Delete item
router.route('/:id/items/:itemId')
  .put(updateBoardItem)
  .delete(deleteBoardItem);

// ================================
// ✅ ES Module Export
// ================================
export default router;

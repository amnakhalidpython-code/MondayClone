// controllers/boardController.js
import Board from '../models/Board.js';

// ================================
// ✅ Create New Board
// ================================
export const createBoard = async (req, res) => {
  try {
    const { boardName, selectedColumns } = req.body;

    if (!boardName || boardName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Board name is required'
      });
    }

    const board = await Board.create({
      name: boardName.trim(),
      columns: selectedColumns || {
        owner: true,
        status: true,
        dueDate: true,
        priority: false,
        lastUpdated: false,
        timeline: false,
        notes: false,
        budget: false,
        files: false
      },
      userId: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      boardId: board._id,
      board
    });

  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating board',
      error: error.message
    });
  }
};

// ================================
// ✅ Get Board By ID
// ================================
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    res.status(200).json({
      success: true,
      board
    });

  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching board',
      error: error.message
    });
  }
};

// ================================
// ✅ Get All Boards
// ================================
export const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: boards.length,
      boards
    });

  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boards',
      error: error.message
    });
  }
};

// ================================
// ✅ Update Board
// ================================
export const updateBoard = async (req, res) => {
  try {
    const { boardName, selectedColumns, settings } = req.body;

    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    if (boardName) board.name = boardName.trim();
    if (selectedColumns) board.columns = { ...board.columns, ...selectedColumns };
    if (settings) board.settings = { ...board.settings, ...settings };

    await board.save();

    res.status(200).json({
      success: true,
      message: 'Board updated successfully',
      board
    });

  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating board',
      error: error.message
    });
  }
};

// ================================
// ✅ Delete Board (Soft Delete)
// ================================
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    board.isDeleted = true;
    board.isActive = false;
    await board.save();

    res.status(200).json({
      success: true,
      message: 'Board deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting board',
      error: error.message
    });
  }
};

// ================================
// ✅ Add Item to Board
// ================================
export const addBoardItem = async (req, res) => {
  try {
    const { title, group, data } = req.body;

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    board.items.push({
      title,
      group: group || 'default',
      data: data || {}
    });

    await board.save();

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      board
    });

  } catch (error) {
    console.error('Error adding board item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item',
      error: error.message
    });
  }
};

// ================================
// ✅ Search Boards
// ================================
export const searchBoards = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const boards = await Board.find({
      $text: { $search: searchTerm },
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      count: boards.length,
      boards
    });

  } catch (error) {
    console.error('Error searching boards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching',
      error: error.message
    });
  }
};

// controllers/BoardController.js
import Board from '../models/Board.js';

// ================================
// ✅ Create New Board (UPDATED)
// ================================
export const createBoard = async (req, res) => {
  try {
    const { boardName, selectedColumns, tasks, userId, userEmail } = req.body;

    if (!boardName || boardName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Board name is required'
      });
    }

    // ✅ Create default views
    const defaultViews = [
      {
        id: 'main-table',
        name: 'Main Table',
        icon: 'board',
        type: 'main',
        isDefault: true
      },
      {
        id: 'dashboard',
        name: 'Dashboard and reporting',
        icon: 'chart',
        type: 'dashboard',
        isDefault: false
      }
    ];

    // ✅ Create board items from tasks
    const boardItems = (tasks || []).map((taskName, index) => ({
      title: taskName,
      group: 'default',
      data: {
        status: index === 0 ? 'Working on it' : index === 1 ? 'Done' : 'Stuck',
        owner: null,
        dueDate: null,
        priority: null
      }
    }));

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
      views: defaultViews,
      items: boardItems,
      userId: userId || null,
      userEmail: userEmail || null,
      createdFrom: 'scratch'
    });

    console.log('✅ Board created:', board._id);

    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      boardId: board._id,
      board
    });

  } catch (error) {
    console.error('❌ Error creating board:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating board',
      error: error.message
    });
  }
};

// ================================
// ✅ Get All Boards for a User
// ================================
export const getUserBoards = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const boards = await Board.find({ 
      userId: userId,
      isDeleted: false 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      boards,
      count: boards.length
    });

  } catch (error) {
    console.error('❌ Error fetching user boards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boards',
      error: error.message
    });
  }
};

// ================================
// ✅ Get Board By ID (with user check)
// ================================
export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user has access to this board
    if (userId && board.userId && board.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this board'
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
// ✅ Update Board Item
// ================================
export const updateBoardItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updates = req.body;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    const item = board.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Update item fields
    if (updates.title) item.title = updates.title;
    if (updates.group) item.group = updates.group;
    if (updates.data) {
      item.data = { ...item.data, ...updates.data };
    }

    await board.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      board
    });

  } catch (error) {
    console.error('Error updating board item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating item',
      error: error.message
    });
  }
};

// ================================
// ✅ Delete Board Item
// ================================
export const deleteBoardItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    const item = board.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item.remove();
    await board.save();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      board
    });

  } catch (error) {
    console.error('Error deleting board item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting item',
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
      name: { $regex: searchTerm, $options: 'i' },
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
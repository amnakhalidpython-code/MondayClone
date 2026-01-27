// controllers/BoardController.js
import Board from '../models/Board.js';

// ================================
// ✅ Create New Board (UPDATED)
// ================================
export const createBoard = async (req, res) => {
  try {
    const {
      boardName,
      selectedColumns,
      selectedWidgets,
      tasks,
      userId,
      userEmail
    } = req.body;

    // 1. Process Tasks (Ensure 3 rows for demo if empty)
    let rowsToCreate = tasks;
    if (!rowsToCreate || rowsToCreate.length === 0 || (rowsToCreate.length === 1 && !rowsToCreate[0])) {
      rowsToCreate = ['', '', ''];
    }

    const boardItems = rowsToCreate.map((taskName, index) => {
      const values = {};
      const date = new Date();
      date.setDate(date.getDate() + index);

      // --- Predefined Rich Data Logic ---

      // 1. Status
      if (selectedColumns?.status) {
        values.status = index === 0 ? 'Working on it' : index === 1 ? 'Done' : 'Stuck';
      }

      // 2. Priority
      if (selectedColumns?.priority) {
        values.priority = index === 0 ? 'Low' : index === 1 ? 'High' : 'Medium';
      }

      // 3. Due Date
      if (selectedColumns?.dueDate) {
        values.dueDate = date.toISOString();
      }

      // 4. Budget
      if (selectedColumns?.budget) {
        values.budget = index === 0 ? 100 : index === 1 ? 1000 : 500;
      }

      // 5. Timeline (Object with start/end)
      if (selectedColumns?.timeline) {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 5 + index);
        values.timeline = {
          start: start.toISOString(),
          end: end.toISOString(),
          days: 5 + index
        };
      }

      // 6. Notes
      if (selectedColumns?.notes) values.notes = '';

      // 7. Files (Array with mock file)
      if (selectedColumns?.files) {
        values.files = [{
          name: 'Demo.pdf',
          url: 'https://dapulse-res.cloudinary.com/image/upload/file.png'
        }];
      }

      // 8. Last Updated
      if (selectedColumns?.lastUpdated) values.lastUpdated = new Date().toISOString();

      // 9. Owner (Object)
      if (selectedColumns?.owner) {
        values.owner = {
          id: userId || 'guest',
          name: userEmail || 'Guest',
          // Default Monday-style avatar
          avatar: "https://cdn1.monday.com/dapulse_default_photo.png"
        };
      }

      return {
        title: taskName && taskName.trim() !== '' ? taskName : `Task ${index + 1}`,
        group: 'default',
        column_values: values
      };
    });

    const newBoard = await Board.create({
      name: boardName || 'My first project',
      type: 'board',
      widgetSettings: selectedWidgets || {},
      columns: selectedColumns || { owner: true, status: true, dueDate: true },
      items: boardItems,
      userId: userId || 'guest',
      userEmail: userEmail || '',
      createdFrom: 'onboarding'
    });

    // Create Dashboard (Standard)
    const newDashboard = await Board.create({
      name: 'Dashboard and reporting',
      type: 'dashboard',
      widgetSettings: selectedWidgets || {},
      userId: userId || 'guest',
      userEmail: userEmail || '',
      createdFrom: 'onboarding',
      columnTitles: {},
      columnOrder: []
    });

    res.status(201).json({ success: true, board: newBoard, dashboard: newDashboard });

  } catch (error) {
    console.error('❌ Error creating board:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// ================================
// ✅ Get All Boards for a User
// ================================
export const getUserBoards = async (req, res) => {
  try {
    const { userId } = req.params;
    const boards = await Board.find({ userId: userId, isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, boards, count: boards.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// ✅ Get Board By ID (with user check)
// ================================
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, board });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    const { boardName, selectedColumns, settings,columnTitles ,columnOrder} = req.body;

    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    if (boardName) board.name = boardName.trim();

    // Update columns dynamically
    if (selectedColumns) {
      board.columns = { ...board.columns, ...selectedColumns };
      board.markModified('columns');
    }
    // Update Titles
    if (columnTitles) {
      board.columnTitles = { ...board.columnTitles, ...columnTitles };
      board.markModified('columnTitles');
    }

    // Update Order
    if (columnOrder) {
      board.columnOrder = columnOrder;
    }
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
    const { title, group, data,column_values } = req.body;

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
      const finalColumnValues = column_values || {};
    board.items.push({
      title,
      group: group || 'default',
      data: data || {},
      column_values: finalColumnValues
      
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
      return res.status(404).json({ success: false, message: 'Board not found' });
    }

    // Find the item
    const item = board.items.id(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Update Basic Fields
    if (updates.title) item.title = updates.title;
    if (updates.group) item.group = updates.group;

    // ✅ FIX: Update column_values properly
    if (updates.column_values) {
      // Initialize if undefined
      if (!item.column_values) item.column_values = {};

      // Merge new values
      item.column_values = {
        ...item.column_values,
        ...updates.column_values
      };
    }

    // ✅ IMPORTANT: Tell Mongoose that 'items' array has changed
    board.markModified('items');

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
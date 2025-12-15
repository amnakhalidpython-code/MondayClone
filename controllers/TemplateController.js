// controllers/TemplateController.js
import Template from '../models/Template.js';
import Board from '../models/Board.js';

// ================================
// ✅ Get All Templates
// ================================
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ 
      isActive: true 
    }).sort({ usageCount: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      templates
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching templates',
      error: error.message
    });
  }
};

// ================================
// ✅ Get Templates By Category
// ================================
export const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const templates = await Template.find({
      category,
      isActive: true
    }).sort({ usageCount: -1 });

    res.status(200).json({
      success: true,
      category,
      count: templates.length,
      templates
    });

  } catch (error) {
    console.error('Error fetching templates by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching templates',
      error: error.message
    });
  }
};

// ================================
// ✅ Get Template By ID
// ================================
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findOne({ 
      templateId: id,
      isActive: true
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching template',
      error: error.message
    });
  }
};

// ================================
// ✅ Create Board from Template (MAIN FUNCTION) - WITH VIEWS
// ================================
export const createBoardFromTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { userId, customBoardName } = req.body;

    // 1. Template fetch karo
    const template = await Template.findOne({ 
      templateId,
      isActive: true 
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // 2. Template structure se board banao WITH VIEWS
    const boardData = {
      name: customBoardName || template.boardStructure.name,
      columns: template.boardStructure.columns,
      userId: userId || req.user?.id,
      items: template.boardStructure.sampleItems || [],
      
      // ✅ VIEWS COPY FROM TEMPLATE
      views: template.boardStructure.views || [],
      
      settings: template.boardStructure.settings || {},
      
      // Template metadata
      createdFrom: 'template',
      templateId: template.templateId
    };

    // 3. New Board create karo
    const newBoard = await Board.create(boardData);

    // 4. Template usage count badhao
    template.usageCount += 1;
    await template.save();

    res.status(201).json({
      success: true,
      message: 'Board created from template successfully',
      boardId: newBoard._id,
      board: newBoard
    });

  } catch (error) {
    console.error('Error creating board from template:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating board from template',
      error: error.message
    });
  }
};

// ================================
// ✅ Search Templates
// ================================
export const searchTemplates = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const templates = await Template.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: templates.length,
      templates
    });

  } catch (error) {
    console.error('Error searching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching templates',
      error: error.message
    });
  }
};

// ================================
// ✅ Get All Categories
// ================================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Template.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
};
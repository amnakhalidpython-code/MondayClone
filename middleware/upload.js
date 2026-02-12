/**
 * File Upload Middleware - DISABLED FOR VERCEL
 * Vercel serverless functions don't support local file storage
 */
import multer from 'multer';

// Use memory storage (won't save files, just passes them through)
const storage = multer.memoryStorage();

// Configure multer with memory storage only
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Middleware to handle multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};
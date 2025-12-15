import express from 'express';
import NotificationController from '../controllers/notificationController.js';

const router = express.Router();

// Middleware - Add your auth middleware here
// Example:
// import { authenticate } from '../middleware/auth.js';
// router.use(authenticate);

// GET routes
router.get('/', NotificationController.getNotifications);
router.get('/unread', NotificationController.getUnreadNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.get('/type/:type', NotificationController.getByType);

// POST routes
router.post('/', NotificationController.createNotification);
router.post('/bulk', NotificationController.createBulkNotifications);

// PUT routes
router.put('/:id/read', NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);

// DELETE routes
router.delete('/:id', NotificationController.deleteNotification);
router.delete('/read/all', NotificationController.deleteAllRead);

export default router;

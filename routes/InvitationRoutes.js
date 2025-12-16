import express from 'express';
import { sendInvitations, acceptInvitation, testEmail } from '../controllers/InvitationController.js';

const router = express.Router();

// Test email endpoint (debugging ke liye)
router.get('/test-email', testEmail);

// Send invitations
router.post('/send', sendInvitations);
router.post('/', sendInvitations); // Also support root path

// Accept invitation
router.get('/accept/:token', acceptInvitation);

export default router;
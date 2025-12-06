import express from 'express';
import { sendInvitations, acceptInvitation } from '../controllers/InvitationController.js';

const router = express.Router();

// Send invitations
router.post('/send', sendInvitations);

// Accept invitation
router.get('/accept/:token', acceptInvitation);

export default router;
import express from 'express';
import { saveEmail } from '../controllers/SignUpemailController.js';

const router = express.Router();

router.post('/email', saveEmail);

export default router;

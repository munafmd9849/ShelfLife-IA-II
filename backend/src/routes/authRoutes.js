import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { requireFields } from '../middleware/validate.js';
const router = Router();
router.post('/login', requireFields(['email', 'password']), login);
export default router;

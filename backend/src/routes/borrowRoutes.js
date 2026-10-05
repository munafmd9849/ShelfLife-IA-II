import { Router } from 'express';
import { issueBook, returnBook } from '../controllers/borrowController.js';
import { authenticate } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
const router = Router();
router.post('/borrow', authenticate, requireFields(['bookId', 'memberId']), issueBook);
router.post('/return/:borrowId', authenticate, returnBook);
export default router;

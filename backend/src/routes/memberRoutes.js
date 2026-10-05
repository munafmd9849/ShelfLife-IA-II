import { Router } from 'express';
import { createMember, getMemberHistory, getMembers } from '../controllers/memberController.js';
import { requireFields, validateEmail } from '../middleware/validate.js';
const router = Router();
router.post('/', requireFields(['name', 'email', 'membershipId']), validateEmail, createMember);
router.get('/', getMembers);
router.get('/:id/history', getMemberHistory);
export default router;

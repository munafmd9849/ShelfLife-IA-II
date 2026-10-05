import { Router } from 'express';
import { createBook, getBooks } from '../controllers/bookController.js';
import { requireFields, validateBook } from '../middleware/validate.js';
const router = Router();
router.route('/').post(requireFields(['title', 'author', 'isbn', 'genre', 'totalCopies', 'availableCopies']), validateBook, createBook).get(getBooks);
export default router;

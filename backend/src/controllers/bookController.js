import Book from '../models/Book.js';

export async function createBook(req, res) {
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, data: book });
}

export async function getBooks(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const filter = {};
  if (req.query.genre) filter.genre = new RegExp(`^${escapeRegex(req.query.genre)}$`, 'i');
  if (req.query.search) filter.title = new RegExp(escapeRegex(req.query.search), 'i');
  const [books, total] = await Promise.all([
    Book.find(filter).sort({ title: 1 }).skip((page - 1) * limit).limit(limit),
    Book.countDocuments(filter)
  ]);
  res.json({ success: true, data: books, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

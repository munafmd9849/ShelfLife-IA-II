import Book from '../models/Book.js';
import Member from '../models/Member.js';
import BorrowRecord from '../models/BorrowRecord.js';

export async function issueBook(req, res) {
  const { bookId, memberId } = req.body;
  const dueDate = req.body.dueDate ? new Date(req.body.dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  if (Number.isNaN(dueDate.getTime()) || dueDate <= new Date()) return res.status(400).json({ success: false, message: 'dueDate must be a valid future date' });
  const member = await Member.findById(memberId);
  if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
  // This conditional update is atomic, so two requests cannot both issue the final copy.
  const book = await Book.findOneAndUpdate({ _id: bookId, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } }, { new: true });
  if (!book) return res.status(409).json({ success: false, message: 'Book not found or no copies are available' });
  try {
    const record = await BorrowRecord.create({ book: book._id, member: member._id, dueDate });
    res.status(201).json({ success: true, message: 'Book issued successfully', data: record });
  } catch (error) {
    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: 1 } });
    throw error;
  }
}

export async function returnBook(req, res) {
  const record = await BorrowRecord.findOneAndUpdate(
    { _id: req.params.borrowId, returnDate: null },
    { $set: { returnDate: new Date(), status: 'returned' } },
    { new: true }
  );
  if (!record) {
    const existingRecord = await BorrowRecord.findById(req.params.borrowId);
    if (!existingRecord) return res.status(404).json({ success: false, message: 'Borrow record not found' });
    return res.status(409).json({ success: false, message: 'This book has already been returned' });
  }
  await Book.findByIdAndUpdate(record.book, { $inc: { availableCopies: 1 } });
  res.json({ success: true, message: 'Book returned successfully', data: record });
}

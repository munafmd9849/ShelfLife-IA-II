import Member from '../models/Member.js';
import BorrowRecord from '../models/BorrowRecord.js';

export async function createMember(req, res) {
  const member = await Member.create(req.body);
  res.status(201).json({ success: true, data: member });
}

export async function getMembers(req, res) {
  const members = await Member.find().sort({ name: 1 }).select('name email membershipId joinedDate');
  res.json({ success: true, data: members });
}

export async function getMemberHistory(req, res) {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
  const now = new Date();
  await BorrowRecord.updateMany({ member: member._id, returnDate: null, dueDate: { $lt: now }, status: 'issued' }, { status: 'overdue' });
  const records = await BorrowRecord.find({ member: member._id }).populate('book', 'title author isbn genre').populate('member', 'name email membershipId').sort({ issueDate: -1 });
  res.json({ success: true, data: { member, history: records } });
}

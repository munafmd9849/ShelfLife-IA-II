import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const librarian = { email: 'librarian@shelflife.com', passwordHash: '$2a$10$4nZiP3Llp5oE/Fz9D.9TFOCuPMxyRNfEMDt6cGpiJDIrcPxcuCPKC' };

export async function login(req, res) {
  const { email, password } = req.body;
  if (email !== librarian.email || !(await bcrypt.compare(password || '', librarian.passwordHash))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const token = jwt.sign({ email: librarian.email, role: 'librarian' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token, user: { email: librarian.email, role: 'librarian' } });
}

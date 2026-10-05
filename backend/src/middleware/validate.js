export const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');
  if (missing.length) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
  next();
};

export function validateBook(req, res, next) {
  const { totalCopies, availableCopies } = req.body;
  if (!Number.isInteger(totalCopies) || totalCopies < 0 || !Number.isInteger(availableCopies) || availableCopies < 0 || availableCopies > totalCopies) {
    return res.status(400).json({ success: false, message: 'Copy counts must be non-negative integers and availableCopies cannot exceed totalCopies' });
  }
  next();
}

export function validateEmail(req, res, next) {
  if (!/^\S+@\S+\.\S+$/.test(req.body.email || '')) return res.status(400).json({ success: false, message: 'A valid email is required' });
  next();
}

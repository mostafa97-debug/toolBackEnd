import jwt from 'jsonwebtoken';
const { verify } = jwt; 
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting: "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;

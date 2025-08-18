import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function auth(req, res, next){
  try{
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.token);
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
    next();
  } catch (e){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

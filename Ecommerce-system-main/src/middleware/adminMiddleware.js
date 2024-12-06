import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";

const authenticateAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
      const user = await userModel.findById(decoded.id); 
      
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }
  
      // Kiểm tra nếu user có role là admin không
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. You are not an admin." });
      }
  
      req.user = user;
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid token." });
    }
  };
  export default authenticateAdmin;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret'
      ) as JWTPayload;

      // Find user by ID
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
        return;
      }

      // Attach user to request object
      req.user = user;
      req.userId = user._id.toString();

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Middleware to check if user is admin (for future use)
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    // For now, we don't have roles in User model
    // This can be extended when needed
    next();
  };
};
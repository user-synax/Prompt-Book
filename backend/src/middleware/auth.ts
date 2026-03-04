import { Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types';

export function auth(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw ApiError.unauthorized('No authentication token provided');
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error: any) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token expired'));
    } else {
      next(ApiError.unauthorized());
    }
  }
}

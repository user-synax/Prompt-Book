import { Response } from 'express';
import { User } from '../models/User';
import { generateToken, setTokenCookie, clearTokenCookie } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest('Email already registered');
  }

  const user = await User.create({ name, email, password });

  const token = generateToken({ id: (user._id as any).toString(), email: user.email, name: user.name });
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken({ id: (user._id as any).toString(), email: user.email, name: user.name });
  setTokenCookie(res, token);

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  clearTokenCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

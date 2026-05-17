import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest, RegisterBody, LoginBody } from '../types';

export const register = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body as RegisterBody;

    const { user, token } = await AuthService.register({
      name,
      email,
      password,
      role,
    });

    ApiResponse.created(res, 'User registered successfully', { user, token });
  }
);

export const login = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginBody;

    const { user, token } = await AuthService.login({ email, password });

    ApiResponse.ok(res, 'Login successful', { user, token });
  }
);

export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await AuthService.getUserById(req.user!.id);

    ApiResponse.ok(res, 'User profile retrieved', { user });
  }
);

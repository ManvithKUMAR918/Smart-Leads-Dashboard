import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { RegisterBody, LoginBody, AuthTokenPayload } from '../types';

export class AuthService {
  static generateToken(user: IUserDocument): string {
    const payload: AuthTokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  static async register(data: RegisterBody): Promise<{ user: IUserDocument; token: string }> {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    const token = AuthService.generateToken(user);

    return { user, token };
  }

  static async login(data: LoginBody): Promise<{ user: IUserDocument; token: string }> {
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = AuthService.generateToken(user);

    return { user, token };
  }

  static async getUserById(id: string): Promise<IUserDocument> {
    const user = await User.findById(id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }
}

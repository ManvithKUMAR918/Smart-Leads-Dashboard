import { Response } from 'express';
import { ApiResponseType, PaginationMeta } from '../types';

export class ApiResponse {
  static send<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    pagination?: PaginationMeta
  ): Response {
    const response: ApiResponseType<T> = {
      success: statusCode >= 200 && statusCode < 300,
      message,
      ...(data !== undefined && { data }),
      ...(pagination && { pagination }),
    };
    return res.status(statusCode).json(response);
  }

  static ok<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.send(res, 200, message, data);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.send(res, 201, message, data);
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: T,
    pagination: PaginationMeta
  ): Response {
    return ApiResponse.send(res, 200, message, data, pagination);
  }

  static noContent(res: Response, message = 'Deleted successfully'): Response {
    return ApiResponse.send(res, 200, message);
  }
}

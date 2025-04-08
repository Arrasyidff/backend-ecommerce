// src/api/auth/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { AuthError } from '../../utils/errors/auth-error';
import { config } from '../../config';
import { TokenPayload } from '../../types';

export class AuthMiddleware {
  public authenticate = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractTokenFromHeader(req);
      
      if (!token) {
        throw new AuthError('No token provided');
      }
      
      // Type assertion
      const secretKey = config.jwt.secret as jwt.Secret;
      const decoded = jwt.verify(token, secretKey) as TokenPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });
      
      if (!user) {
        throw new AuthError('User not found');
      }
      
      // Attach user to request
      req.user = user;
      
      next();
    } catch (error) {
      // Proper type checking for error
      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        next(new AuthError('Invalid or expired token'));
      } else if (error instanceof Error) {
        // For any other error types
        next(error);
      } else {
        // For completely unknown errors
        next(new AuthError('Authentication failed'));
      }
    }
  };
  
  public authorize = (roles: string[]) => {
    return (req: Request, _: Response, next: NextFunction): void => {
      if (!req.user) {
        next(new AuthError('Not authenticated'));
        return;
      }
      
      if (!roles.includes(req.user.role)) {
        next(new AuthError('Not authorized to access this resource'));
        return;
      }
      
      next();
    };
  };
  
  private extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.split(' ')[1];
  }
}
// src/api/auth/auth.service.ts
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { AuthError } from '../../utils/errors/auth-error';
import { DatabaseError } from '../../utils/errors/database-error';
import { config } from '../../config';
import { LoginDto, RegisterDto, TokenPayload, AuthResult } from '../../types';

export class AuthService {
  private generateToken(payload: TokenPayload): string {
    const secretKey = config.jwt.secret as jwt.Secret;
    const options = { expiresIn: config.jwt.expiresIn } as SignOptions;
    
    return jwt.sign(payload, secretKey, options);
  }
  
  public async register(userData: RegisterDto): Promise<AuthResult> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      
      if (existingUser) {
        throw new AuthError('User with this email already exists');
      }
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'USER', // Default role
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      const tokenPayload: TokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };
      
      const token = this.generateToken(tokenPayload);
      
      return {
        user: newUser,
        token,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new DatabaseError('Failed to register user');
    }
  }
  
  public async login(loginData: LoginDto): Promise<AuthResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });
      
      if (!user) {
        throw new AuthError('Invalid email or password');
      }
      
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      
      if (!isPasswordValid) {
        throw new AuthError('Invalid email or password');
      }
      
      const { password, ...userWithoutPassword } = user;
      
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      
      const token = this.generateToken(tokenPayload);
      
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new DatabaseError('Failed to login user');
    }
  }
}
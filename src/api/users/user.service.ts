import { prisma } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database-error';
import { ApiError } from '../../utils/errors/api-error';

export class UserService {
  public async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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
      
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch user');
    }
  }
  
  public async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
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
      
      return users;
    } catch (error) {
      throw new DatabaseError('Failed to fetch users');
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthError } from '../../utils/errors/auth-error';

export class UserController {
  private userService: UserService;
  
  constructor() {
    this.userService = new UserService();
  }
  
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthError('User not authenticated');
      }
      const userId = req.user.id;
      const user = await this.userService.getUserById(userId);
      
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getAllUsers = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      
      res.status(200).json({
        status: 'success',
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  };
}
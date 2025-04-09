import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';

export class OrderController {
  private orderService: OrderService;
  
  constructor() {
    this.orderService = new OrderService();
  }
  
  public checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
        return;
      }
      
      const userId = req.user.id;
      
      const order = await this.orderService.createOrder(userId);
      
      res.status(201).json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
        return;
      }
      
      const userId = req.user.id;
      const orders = await this.orderService.getUserOrders(userId);
      
      res.status(200).json({
        status: 'success',
        data: { orders }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
        return;
      }
      
      const userId = req.user.id;
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id, userId);
      
      res.status(200).json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedOrder = await this.orderService.updateOrderStatus(id, status);
      
      res.status(200).json({
        status: 'success',
        data: { order: updatedOrder }
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Admin method to get all orders
  public getAllOrders = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getAllOrders();
      
      res.status(200).json({
        status: 'success',
        data: { orders }
      });
    } catch (error) {
      next(error);
    }
  };
}
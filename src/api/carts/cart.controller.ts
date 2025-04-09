import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { CartDto } from './cart.model';

export class CartController {
  private cartService: CartService;
  
  constructor() {
    this.cartService = new CartService();
  }
  
  public getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
        return;
      }
      
      const userId = req.user.id;
      const cartItems = await this.cartService.getCartByUserId(userId);
      
      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      res.status(200).json({
        status: 'success',
        data: {
          items: cartItems,
          total
        }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
        return;
      }
      
      const userId = req.user.id;
      const cartData: CartDto = {
        userId,
        productId: req.body.productId,
        quantity: req.body.quantity || 1
      };
      
      const cartItem = await this.cartService.addToCart(cartData);
      
      res.status(201).json({
        status: 'success',
        data: { cartItem }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      const updatedCartItem = await this.cartService.updateCartItem(id, quantity);
      
      res.status(200).json({
        status: 'success',
        data: { cartItem: updatedCartItem }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public removeCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.cartService.removeCartItem(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Cart item removed successfully'
      });
    } catch (error) {
      next(error);
    }
  };
  
  public clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
        return;
      }
      
      const userId = req.user.id;
      await this.cartService.clearCart(userId);
      
      res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
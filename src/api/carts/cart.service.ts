import { prisma } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database-error';
import { ApiError } from '../../utils/errors/api-error';
import { CartDto, CartItemResponse, CartProductInfo } from './cart.model';

export class CartService {
  public async getCartByUserId(userId: string): Promise<CartItemResponse[]> {
    try {
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              stock: true
            }
          }
        }
      });
      
      return cartItems.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image
        } as CartProductInfo,
        quantity: item.quantity,
        subtotal: item.quantity * item.product.price
      }));
    } catch (error) {
      throw new DatabaseError('Failed to fetch cart items');
    }
  }

  public async addToCart(cartData: CartDto): Promise<CartItemResponse> {
    try {
      // Check if product exists and has enough stock
      const product = await prisma.product.findUnique({
        where: { id: cartData.productId }
      });
      
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }
      
      if (product.stock < cartData.quantity) {
        throw new ApiError(400, 'Not enough stock available');
      }
      
      // Check if item already exists in cart
      const existingCartItem = await prisma.cart.findUnique({
        where: {
          userId_productId: {
            userId: cartData.userId,
            productId: cartData.productId
          }
        }
      });
      
      let cartItem;
      
      if (existingCartItem) {
        // Update quantity if item already exists
        cartItem = await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + cartData.quantity },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cart.create({
          data: cartData,
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        });
      }
      
      return {
        id: cartItem.id,
        product: cartItem.product as CartProductInfo,
        quantity: cartItem.quantity,
        subtotal: cartItem.quantity * cartItem.product.price
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to add item to cart');
    }
  }

  public async updateCartItem(id: string, quantity: number): Promise<CartItemResponse> {
    try {
      const cartItem = await prisma.cart.findUnique({
        where: { id },
        include: {
          product: true
        }
      });
      
      if (!cartItem) {
        throw new ApiError(404, 'Cart item not found');
      }
      
      // Check if there's enough stock
      if (cartItem.product.stock < quantity) {
        throw new ApiError(400, 'Not enough stock available');
      }
      
      const updatedCartItem = await prisma.cart.update({
        where: { id },
        data: { quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true
            }
          }
        }
      });
      
      return {
        id: updatedCartItem.id,
        product: updatedCartItem.product as CartProductInfo,
        quantity: updatedCartItem.quantity,
        subtotal: updatedCartItem.quantity * updatedCartItem.product.price
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to update cart item');
    }
  }

  public async removeCartItem(id: string): Promise<{ success: boolean }> {
    try {
      const cartItem = await prisma.cart.findUnique({
        where: { id }
      });
      
      if (!cartItem) {
        throw new ApiError(404, 'Cart item not found');
      }
      
      await prisma.cart.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to remove cart item');
    }
  }

  public async clearCart(userId: string): Promise<{ success: boolean }> {
    try {
      await prisma.cart.deleteMany({
        where: { userId }
      });
      
      return { success: true };
    } catch (error) {
      throw new DatabaseError('Failed to clear cart');
    }
  }
}
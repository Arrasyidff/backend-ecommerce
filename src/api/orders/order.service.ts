// src/api/orders/order.service.ts
import { prisma } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database-error';
import { ApiError } from '../../utils/errors/api-error';
import { OrderResponse, OrderItemModel, OrderWithItems } from './order.model';
import { OrderStatus } from '.prisma/client';

export class OrderService {
  public async createOrder(userId: string): Promise<OrderResponse> {
    try {
      // Start a transaction to ensure all operations succeed or fail together
      return await prisma.$transaction(async (tx) => {
        // Get user's cart items
        const cartItems = await tx.cart.findMany({
          where: { userId },
          include: {
            product: true
          }
        });
        
        if (cartItems.length === 0) {
          throw new ApiError(400, 'Cart is empty');
        }
        
        // Validate stock for all items
        for (const item of cartItems) {
          if (item.product.stock < item.quantity) {
            throw new ApiError(400, `Not enough stock for ${item.product.name}`);
          }
        }
        
        // Calculate total
        const total = cartItems.reduce((sum, item) => {
          return sum + (item.quantity * item.product.price);
        }, 0);
        
        // Create order
        const order = await tx.order.create({
          data: {
            userId,
            total,
            status: 'PENDING',
            // Additional data from checkout
            // shippingAddress: checkoutData.shippingAddress,
            // paymentMethod: checkoutData.paymentMethod,
          }
        });
        
        // Create order items and update product stock
        for (const item of cartItems) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }
          });
          
          // Update product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: item.product.stock - item.quantity
            }
          });
        }
        
        // Clear the user's cart
        await tx.cart.deleteMany({
          where: { userId }
        });
        
        // Return the created order with items
        const orderWithItems = await tx.order.findUnique({
          where: { id: order.id },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        });
        
        if (!orderWithItems) {
          throw new ApiError(500, 'Failed to create order');
        }
        
        return {
          id: orderWithItems.id,
          total: orderWithItems.total,
          status: orderWithItems.status,
          createdAt: orderWithItems.createdAt,
          items: orderWithItems.items.map(item => ({
            id: item.id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price
          }))
        };
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to create order');
    }
  }

  public async getUserOrders(userId: string): Promise<OrderResponse[]> {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return orders.map(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        }))
      }));
    } catch (error) {
      throw new DatabaseError('Failed to fetch user orders');
    }
  }

  public async getOrderById(id: string, userId: string): Promise<OrderResponse> {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }
      
      // Make sure the order belongs to the user
      if (order.userId !== userId) {
        throw new ApiError(403, 'You do not have permission to view this order');
      }
      
      return {
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        }))
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch order');
    }
  }

  public async updateOrderStatus(id: string, status: string): Promise<OrderResponse> {
    try {
      const order = await prisma.order.findUnique({
        where: { id }
      });
      
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      const orderStatus = status as OrderStatus;
      
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: orderStatus },
        include: {  // Tambahkan bagian ini
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      const typedOrder = updatedOrder as unknown as OrderWithItems;
      
      return {
        id: typedOrder.id,
        total: typedOrder.total,
        status: typedOrder.status,
        createdAt: typedOrder.createdAt,
        items: typedOrder.items.map((item: OrderItemModel) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        }))
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to update order status');
    }
  }

  // Admin method to get all orders
  public async getAllOrders(): Promise<OrderResponse[]> {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return orders.map(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        user: order.user,
        items: order.items.map(item => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        }))
      }));
    } catch (error) {
      throw new DatabaseError('Failed to fetch orders');
    }
  }
}
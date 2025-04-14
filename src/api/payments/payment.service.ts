// src/api/payments/payment.service.ts
import { prisma } from '../../config/database';
import { PaymentWebhookDto } from './payment.model';
import { ApiError } from '../../utils/errors/api-error';
import { DatabaseError } from '../../utils/errors/database-error';
import { invoiceQueue } from '../../jobs/queues';
import logger from '../../utils/logger';
import { OrderStatus } from '.prisma/client';

export class PaymentService {
  public async processPaymentWebhook(paymentData: PaymentWebhookDto) {
    try {
      const { orderId, status, amount, transactionId } = paymentData;
      
      // Verifikasi order exist
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      });
      
      if (!order) {
        throw new ApiError(404, `Order ${orderId} not found`);
      }
      
      // Verifikasi jumlah pembayaran
      if (order.total !== amount) {
        logger.warn(`Payment amount mismatch: expected ${order.total}, got ${amount}`);
      }
      
      // Update status order berdasarkan status pembayaran
      let orderStatus: OrderStatus;
      switch (status) {
        case 'success':
          orderStatus = 'PROCESSING';
          break;
        case 'failed':
          orderStatus = 'CANCELLED';
          break;
        case 'pending':
        default:
          orderStatus = 'PENDING';
      }
      
      // Update order dengan status baru
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
          // Tambahkan field payment di model Order jika perlu menyimpan info payment
          // payment: {
          //   create: {
          //     transactionId,
          //     amount,
          //     status,
          //     paymentMethod
          //   }
          // }
        }
      });
      
      // Jika pembayaran berhasil, tambahkan ke antrian invoice
      if (status === 'success') {
        await invoiceQueue.add(
          'send-invoice',
          {
            orderId: order.id,
            email: order.user.email,
            transactionId
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000
            }
          }
        );
        
        logger.info(`Added invoice job for order ${orderId} to queue`);
      }
      
      return {
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status
        },
        payment: {
          transactionId,
          status
        }
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to process payment webhook');
    }
  }
}
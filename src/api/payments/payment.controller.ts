// src/api/payments/payment.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { PaymentWebhookDto } from './payment.model';
import logger from '../../utils/logger';

export class PaymentController {
  private paymentService: PaymentService;
  
  constructor() {
    this.paymentService = new PaymentService();
  }
  
  public simulatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paymentData: PaymentWebhookDto = {
        orderId: req.body.orderId,
        status: req.body.status || 'success',
        amount: req.body.amount,
        transactionId: req.body.transactionId || `tx-${Date.now()}`,
        paymentMethod: req.body.paymentMethod,
      };
      
      logger.info(`Simulating payment webhook: ${JSON.stringify(paymentData)}`);
      
      const result = await this.paymentService.processPaymentWebhook(paymentData);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
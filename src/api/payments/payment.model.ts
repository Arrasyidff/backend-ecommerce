// src/api/payments/payment.model.ts
export interface PaymentWebhookDto {
  orderId: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  transactionId: string;
  paymentMethod?: string;
}
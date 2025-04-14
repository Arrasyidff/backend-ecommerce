// src/jobs/invoiceWorker.ts
import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import logger from '../utils/logger';
import { prisma } from '../config/database';
// import nodemailer from 'nodemailer';

// Dummy transporter untuk simulasi
// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 2525,
//   auth: {
//     user: process.env.MAIL_USER || 'your_mailtrap_user',
//     pass: process.env.MAIL_PASS || 'your_mailtrap_password'
//   }
// });

// Buat worker untuk memproses invoice jobs
const invoiceWorker = new Worker('invoice', async job => {
  const { orderId } = job.data;
  
  logger.info(`Processing invoice job for order ${orderId}`);
  
  try {
    // Dapatkan order data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    // Simulasi generasi invoice
    // const invoiceHtml = `
    //   <h1>Invoice #${orderId.substring(0, 8)}</h1>
    //   <p>Thank you for your order!</p>
    //   <p>Total: $${order.total}</p>
    //   <p>Status: ${order.status}</p>
    //   <h2>Items:</h2>
    //   <ul>
    //     ${order.items.map(item => `
    //       <li>${item.quantity}x ${item.product.name} - $${item.price}</li>
    //     `).join('')}
    //   </ul>
    // `;
    
    // // Simulasi pengiriman email
    // await transporter.sendMail({
    //   from: 'store@example.com',
    //   to: email || order.user.email,
    //   subject: `Invoice for Order #${orderId.substring(0, 8)}`,
    //   html: invoiceHtml,
    // });
    
    logger.info(`Invoice sent for order ${orderId}`);
    
    // Update status order jika belum PROCESSING
    if (order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' }
      });
      logger.info(`Order ${orderId} status updated to PROCESSING`);
    }
    
    return { success: true };
  } catch (error) {
    logger.error(`Error processing invoice for order ${orderId}:`, error);
    throw error;
  }
}, { connection: redis });

invoiceWorker.on('completed', job => {
  logger.info(`Job ${job.id} completed for order ${job.data.orderId}`);
});

invoiceWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed for order ${job?.data.orderId}:`, err);
});

export default invoiceWorker;
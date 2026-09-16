import { FatalError } from 'workflow';
import { nGeniusService } from '@/lib/services/ngenius';
import type { Payment } from '../types';

export async function checkPayment(orderReference: string, currency: string): Promise<Payment> {
  'use step';
  console.log(`[reconcile-step:payment] checkPayment orderReference=${orderReference} currency=${currency}`);
  const order = await nGeniusService.getPaymentStatus(orderReference);
  const rawState = String(order._embedded?.payment?.[0]?.state || order.status || 'UNKNOWN').toUpperCase();
  console.log(`[reconcile-step:payment] nGenius returned rawState=${rawState} amount=${order.amount?.value}`);
  const status = ['CAPTURED', 'PURCHASED'].includes(rawState) ? 'successful'
    : ['FAILED', 'REVERSED', 'CANCELLED'].includes(rawState) ? 'failed' : 'pending';
  const value = order.amount?.value;
  if (status === 'successful' && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    throw new FatalError('Successful payment is missing a valid amount');
  }
  return {
    status,
    rawState,
    paymentId: order._embedded?.payment?.[0]?._id || order._id || '',
    amount: (value || 0) / 100,
    currency: order.amount?.currencyCode || currency,
  };
}

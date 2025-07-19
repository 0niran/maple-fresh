import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    const webhookResult = await PaymentService.handleWebhook(body, signature);

    if (!webhookResult.success || !webhookResult.event) {
      return NextResponse.json(
        { success: false, error: webhookResult.error || 'Webhook verification failed' },
        { status: 400 }
      );
    }

    const event = webhookResult.event;

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      // Update booking status to confirmed and paid
      await prisma.bookingRequest.update({
        where: { id: bookingId },
        data: {
          status: 'confirmed',
          updatedAt: new Date(),
        },
      });

      // Send payment confirmation notification
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_update',
          bookingId,
          oldStatus: 'pending',
        }),
      }).catch(error => {
        console.error('Failed to send payment confirmation notification:', error);
      });

      console.log(`Payment succeeded for booking ${bookingId}`);
    }

    // You might also want to create a payment record in your database
    // await prisma.payment.create({
    //   data: {
    //     stripePaymentIntentId: paymentIntent.id,
    //     amount: paymentIntent.amount / 100,
    //     currency: paymentIntent.currency,
    //     status: 'succeeded',
    //     bookingId,
    //   },
    // });

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      // Optionally update booking status or send notification
      console.log(`Payment failed for booking ${bookingId}`);
      
      // You might want to notify the admin or customer about the failed payment
    }

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  try {
    const bookingId = invoice.metadata?.bookingId;

    if (bookingId) {
      await prisma.bookingRequest.update({
        where: { id: bookingId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`Invoice payment succeeded for booking ${bookingId}`);
    }

  } catch (error) {
    console.error('Error handling invoice payment:', error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    console.log(`Subscription ${subscription.status} for customer ${customerId}`);

    // Handle subscription logic here
    // You might want to create a subscription table in your database

  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}
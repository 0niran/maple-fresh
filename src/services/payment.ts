import Stripe from 'stripe';
import { BookingRequest, Quote } from '@/types';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo', {
  apiVersion: '2024-06-20',
});

export class PaymentService {
  // Create payment intent for booking
  static async createPaymentIntent(booking: BookingRequest): Promise<{
    success: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    error?: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.total * 100), // Convert to cents
        currency: 'cad',
        metadata: {
          bookingId: booking.id,
          customerId: booking.customerId,
          customerEmail: booking.customer.email,
          services: Array.isArray(booking.services) 
            ? booking.services.join(', ') 
            : JSON.parse(booking.services || '[]').join(', '),
        },
        description: `MapleFresh Services - Booking ${booking.id.slice(-8)}`,
        receipt_email: booking.customer.email,
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret || undefined,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment setup failed',
      };
    }
  }

  // Create payment intent for quote
  static async createQuotePaymentIntent(quote: Quote, customerEmail: string): Promise<{
    success: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    error?: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(quote.total * 100), // Convert to cents
        currency: 'cad',
        metadata: {
          quoteId: quote.id,
          customerEmail,
          services: quote.services.join(', '),
          propertyType: quote.propertyType,
        },
        description: `MapleFresh Services - Quote ${quote.id.slice(-8)}`,
        receipt_email: customerEmail,
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret || undefined,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Quote payment intent creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment setup failed',
      };
    }
  }

  // Retrieve payment intent
  static async getPaymentIntent(paymentIntentId: string): Promise<{
    success: boolean;
    paymentIntent?: Stripe.PaymentIntent;
    error?: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Failed to retrieve payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve payment',
      };
    }
  }

  // Create customer in Stripe
  static async createCustomer(customer: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<{
    success: boolean;
    customerId?: string;
    error?: string;
  }> {
    try {
      const stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
      });

      return {
        success: true,
        customerId: stripeCustomer.id,
      };
    } catch (error) {
      console.error('Failed to create Stripe customer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer',
      };
    }
  }

  // Create invoice for completed service
  static async createInvoice(booking: BookingRequest): Promise<{
    success: boolean;
    invoiceId?: string;
    invoiceUrl?: string;
    error?: string;
  }> {
    try {
      // First create/get customer
      const customerResult = await this.createCustomer({
        email: booking.customer.email,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
        phone: booking.customer.phone,
      });

      if (!customerResult.success || !customerResult.customerId) {
        return {
          success: false,
          error: 'Failed to create customer for invoice',
        };
      }

      // Create invoice
      const invoice = await stripe.invoices.create({
        customer: customerResult.customerId,
        description: `Services completed for booking ${booking.id.slice(-8)}`,
        metadata: {
          bookingId: booking.id,
        },
      });

      // Add line items
      const services = Array.isArray(booking.services) 
        ? booking.services 
        : JSON.parse(booking.services || '[]');

      for (const service of services) {
        await stripe.invoiceItems.create({
          customer: customerResult.customerId,
          invoice: invoice.id,
          description: `${service} service`,
          amount: Math.round((booking.subtotal / services.length) * 100),
        });
      }

      // Add discount if applicable
      if (booking.bundleDiscount > 0) {
        await stripe.invoiceItems.create({
          customer: customerResult.customerId,
          invoice: invoice.id,
          description: 'Bundle discount',
          amount: -Math.round(booking.bundleDiscount * 100),
        });
      }

      // Add taxes
      await stripe.invoiceItems.create({
        customer: customerResult.customerId,
        invoice: invoice.id,
        description: 'HST',
        amount: Math.round(booking.taxes * 100),
      });

      // Finalize and send invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

      return {
        success: true,
        invoiceId: finalizedInvoice.id,
        invoiceUrl: finalizedInvoice.hosted_invoice_url || undefined,
      };
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invoice',
      };
    }
  }

  // Handle webhook events
  static async handleWebhook(
    body: string,
    signature: string
  ): Promise<{
    success: boolean;
    event?: Stripe.Event;
    error?: string;
  }> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return {
          success: false,
          error: 'Webhook secret not configured',
        };
      }

      const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

      return {
        success: true,
        event,
      };
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook verification failed',
      };
    }
  }

  // Create subscription for regular customers
  static async createSubscription(customerId: string, priceId: string): Promise<{
    success: boolean;
    subscriptionId?: string;
    clientSecret?: string;
    error?: string;
  }> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret || undefined,
      };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subscription',
      };
    }
  }
}
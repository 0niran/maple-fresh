import nodemailer from 'nodemailer';
import { BookingRequest, Quote, Customer } from '@/types';
import { COMPANY_INFO } from '@/constants';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // In production, use environment variables
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'demo@maplefresh.ca',
        pass: process.env.SMTP_PASS || 'demo-password',
      },
    };

    this.transporter = nodemailer.createTransporter(config);
  }

  private async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const mailOptions = {
        from: `${COMPANY_INFO.name} <${process.env.SMTP_USER || 'noreply@maplefresh.ca'}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // Booking confirmation email to customer
  async sendBookingConfirmation(booking: BookingRequest): Promise<{ success: boolean; error?: string }> {
    const subject = `Booking Confirmation - ${COMPANY_INFO.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; }
          .btn { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_INFO.name}</h1>
            <h2>Booking Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear ${booking.customer.firstName} ${booking.customer.lastName},</p>
            
            <p>Thank you for choosing ${COMPANY_INFO.name}! Your booking request has been confirmed.</p>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.id.slice(-8).toUpperCase()}</p>
              <p><strong>Services:</strong> ${Array.isArray(booking.services) ? booking.services.join(', ') : JSON.parse(booking.services || '[]').join(', ')}</p>
              <p><strong>Property Type:</strong> ${booking.propertyType}</p>
              <p><strong>Address:</strong> ${booking.address}, ${booking.city}, ${booking.postalCode}</p>
              <p><strong>Preferred Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString()}</p>
              <p><strong>Preferred Time:</strong> ${booking.preferredTime}</p>
              <p><strong>Total Amount:</strong> $${booking.total.toFixed(2)}</p>
              ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
            </div>
            
            <p>We will contact you within 24 hours to confirm the final details and schedule your service.</p>
            
            <p>If you have any questions, please don't hesitate to contact us:</p>
            <ul>
              <li>Phone: ${COMPANY_INFO.phone}</li>
              <li>Email: ${COMPANY_INFO.email}</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}</p>
            <p>${COMPANY_INFO.address}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(booking.customer.email, subject, html);
  }

  // Quote notification email to customer
  async sendQuoteNotification(quote: Quote, customerEmail: string): Promise<{ success: boolean; error?: string }> {
    const subject = `Your Quote is Ready - ${COMPANY_INFO.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .quote-details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .total { font-size: 24px; font-weight: bold; color: #2563eb; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; }
          .btn { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_INFO.name}</h1>
            <h2>Your Custom Quote</h2>
          </div>
          
          <div class="content">
            <p>Hello!</p>
            
            <p>Your custom quote is ready! Here are the details:</p>
            
            <div class="quote-details">
              <h3>Quote Details</h3>
              <p><strong>Quote ID:</strong> ${quote.id.slice(-8).toUpperCase()}</p>
              <p><strong>Services:</strong> ${quote.services.join(', ')}</p>
              <p><strong>Property:</strong> ${quote.propertyType} (${quote.bedrooms}BR/${quote.bathrooms}BA, ${quote.squareFootage} sq ft)</p>
              
              <div style="margin: 20px 0; padding: 15px; background: white; border-radius: 6px;">
                <p><strong>Subtotal:</strong> $${quote.subtotal.toFixed(2)}</p>
                ${quote.bundleDiscount > 0 ? `<p><strong>Bundle Discount:</strong> -$${quote.bundleDiscount.toFixed(2)}</p>` : ''}
                <p><strong>HST:</strong> $${quote.taxes.toFixed(2)}</p>
                <hr>
                <p class="total">Total: $${quote.total.toFixed(2)}</p>
              </div>
            </div>
            
            <p>This quote is valid until ${quote.expiresAt ? new Date(quote.expiresAt).toLocaleDateString() : 'further notice'}.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/book" class="btn">Book Now</a>
            </div>
            
            <p>Questions? Contact us:</p>
            <ul>
              <li>Phone: ${COMPANY_INFO.phone}</li>
              <li>Email: ${COMPANY_INFO.email}</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}</p>
            <p>${COMPANY_INFO.address}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(customerEmail, subject, html);
  }

  // Booking status update email
  async sendBookingStatusUpdate(booking: BookingRequest, oldStatus: string): Promise<{ success: boolean; error?: string }> {
    const statusMessages = {
      confirmed: 'Your booking has been confirmed! Our team will be in touch soon.',
      in_progress: 'Your service is currently in progress. Our team is working hard for you!',
      completed: 'Your service has been completed! Thank you for choosing us.',
      cancelled: 'Your booking has been cancelled. If you have questions, please contact us.',
    };

    const subject = `Booking Update: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} - ${COMPANY_INFO.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .status-update { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_INFO.name}</h1>
            <h2>Booking Status Update</h2>
          </div>
          
          <div class="content">
            <p>Dear ${booking.customer.firstName} ${booking.customer.lastName},</p>
            
            <div class="status-update">
              <h3>Status Update</h3>
              <p><strong>Booking ID:</strong> ${booking.id.slice(-8).toUpperCase()}</p>
              <p><strong>Previous Status:</strong> ${oldStatus}</p>
              <p><strong>Current Status:</strong> ${booking.status}</p>
              <p>${statusMessages[booking.status as keyof typeof statusMessages] || 'Your booking status has been updated.'}</p>
            </div>
            
            <p>If you have any questions about this update, please don't hesitate to contact us:</p>
            <ul>
              <li>Phone: ${COMPANY_INFO.phone}</li>
              <li>Email: ${COMPANY_INFO.email}</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(booking.customer.email, subject, html);
  }

  // Admin notification for new booking
  async sendAdminBookingNotification(booking: BookingRequest): Promise<{ success: boolean; error?: string }> {
    const subject = `New Booking: ${booking.customer.firstName} ${booking.customer.lastName} - ${COMPANY_INFO.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .urgent { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Booking Alert</h1>
          </div>
          
          <div class="content">
            <p class="urgent">A new booking has been submitted and requires attention!</p>
            
            <div class="booking-details">
              <h3>Booking Information</h3>
              <p><strong>Booking ID:</strong> ${booking.id}</p>
              <p><strong>Customer:</strong> ${booking.customer.firstName} ${booking.customer.lastName}</p>
              <p><strong>Email:</strong> ${booking.customer.email}</p>
              <p><strong>Phone:</strong> ${booking.customer.phone}</p>
              <p><strong>Services:</strong> ${Array.isArray(booking.services) ? booking.services.join(', ') : JSON.parse(booking.services || '[]').join(', ')}</p>
              <p><strong>Address:</strong> ${booking.address}, ${booking.city}, ${booking.postalCode}</p>
              <p><strong>Preferred Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString()}</p>
              <p><strong>Total Value:</strong> $${booking.total.toFixed(2)}</p>
              <p><strong>Submitted:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
            </div>
            
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View in Admin Dashboard</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin email
    const adminEmail = process.env.ADMIN_EMAIL || COMPANY_INFO.email;
    return await this.sendEmail(adminEmail, subject, html);
  }
}

export const emailService = new EmailService();
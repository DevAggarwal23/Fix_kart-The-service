/**
 * Email Service
 * Handles all email communications using Nodemailer
 */

const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const fromEmail = process.env.EMAIL_FROM || 'FixKart <noreply@fixkart.com>';

/**
 * Send email
 */
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email Templates
 */
const templates = {
  /**
   * Welcome email for new users
   */
  welcome: (userData) => ({
    subject: 'Welcome to FixKart! 🎉',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FixKart</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to FixKart!</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Hi ${userData.displayName || 'there'},
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Welcome to FixKart! We're thrilled to have you on board. Your account has been successfully created and you're all set to explore our home services.
        </p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <h3 style="color: #1e40af; margin: 0 0 15px;">What you can do with FixKart:</h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Book AC repairs, plumbing, electrical services & more</li>
            <li>Get instant quotes with our AI assistant</li>
            <li>Track your service professional in real-time</li>
            <li>Enjoy 30-day warranty on all repairs</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://fixkart.com/services" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Explore Services
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
          Have questions? Reply to this email or chat with us in the app!
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 10px;">
          © ${new Date().getFullYear()} FixKart. All rights reserved.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          You received this email because you signed up for FixKart.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  /**
   * OTP verification email
   */
  otp: (otp, purpose = 'verification') => ({
    subject: `Your FixKart OTP: ${otp}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">FixKart Verification</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <p style="color: #333333; font-size: 16px; margin: 0 0 30px;">
          Your OTP for ${purpose} is:
        </p>
        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 25px; margin: 0 auto; max-width: 200px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e40af;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px; margin: 30px 0 0;">
          This OTP is valid for 10 minutes. Do not share it with anyone.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #fef2f2; padding: 20px 30px; text-align: center;">
        <p style="color: #dc2626; font-size: 13px; margin: 0;">
          ⚠️ If you didn't request this OTP, please ignore this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  /**
   * Booking confirmation email
   */
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmed - ${booking.serviceName} | #${booking.bookingNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
          <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 18px;">Booking Details</h2>
          <table width="100%" style="color: #475569; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Booking ID</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">#${booking.bookingNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Service</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${booking.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Date & Time</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${booking.scheduledDate} at ${booking.scheduledTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Amount</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #059669;">₹${booking.finalAmount}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px 20px; margin-bottom: 25px;">
          <p style="color: #166534; margin: 0; font-size: 14px;">
            <strong>Your OTP:</strong> ${booking.otp}<br>
            <span style="font-size: 12px;">Share this with the service professional when they arrive.</span>
          </p>
        </div>
        
        <div style="text-align: center;">
          <a href="https://fixkart.com/bookings/${booking.id}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Track Booking
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          Need help? Contact us at support@fixkart.com or call 1800-123-4567
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  /**
   * Payment receipt email
   */
  paymentReceipt: (payment, booking) => ({
    subject: `Payment Receipt - ₹${payment.amount} | FixKart`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Receipt</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; color: #22c55e;">✓</div>
          <p style="color: #22c55e; font-size: 18px; font-weight: 600; margin: 10px 0;">Payment Successful</p>
          <p style="color: #1e293b; font-size: 36px; font-weight: bold; margin: 0;">₹${payment.amount}</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px;">
          <table width="100%" style="color: #475569; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">Transaction ID</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${payment.transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">Booking ID</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">#${booking.bookingNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">Service</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${booking.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">Payment Method</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${payment.method}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">Date</td>
              <td style="padding: 10px 0; text-align: right;">${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://fixkart.com/payments/${payment.id}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Download Invoice
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          This is an auto-generated receipt. Please keep it for your records.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  /**
   * Booking reminder email
   */
  bookingReminder: (booking) => ({
    subject: `Reminder: ${booking.serviceName} scheduled for tomorrow | FixKart`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🔔</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Service Reminder</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">
          Hi ${booking.customerName || 'there'},
        </p>
        <p style="color: #333333; font-size: 16px; margin: 0 0 25px;">
          This is a friendly reminder that your <strong>${booking.serviceName}</strong> is scheduled for tomorrow.
        </p>
        
        <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
          <p style="color: #9a3412; margin: 0; font-size: 16px;">
            📅 <strong>${booking.scheduledDate}</strong> at <strong>${booking.scheduledTime}</strong>
          </p>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin: 0 0 25px;">
          Please ensure someone is available at the service address to receive our professional.
        </p>
        
        <div style="text-align: center;">
          <a href="https://fixkart.com/bookings/${booking.id}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
            View Booking
          </a>
          <a href="https://fixkart.com/bookings/${booking.id}/reschedule" style="display: inline-block; background-color: #ffffff; color: #2563eb; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #2563eb;">
            Reschedule
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          Need to make changes? Contact us at 1800-123-4567
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  /**
   * Service completed email
   */
  serviceCompleted: (booking) => ({
    subject: `Service Completed - ${booking.serviceName} | Rate your experience`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Service Completed!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">
          Hi ${booking.customerName || 'there'},
        </p>
        <p style="color: #333333; font-size: 16px; margin: 0 0 25px;">
          Your <strong>${booking.serviceName}</strong> service has been completed successfully. We hope you had a great experience!
        </p>
        
        <div style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px;">
          <p style="color: #166534; margin: 0 0 15px; font-size: 16px;">How was your experience?</p>
          <div style="display: inline-block;">
            <a href="https://fixkart.com/review/${booking.id}?rating=5" style="font-size: 32px; text-decoration: none; margin: 0 5px;">⭐</a>
            <a href="https://fixkart.com/review/${booking.id}?rating=4" style="font-size: 32px; text-decoration: none; margin: 0 5px;">⭐</a>
            <a href="https://fixkart.com/review/${booking.id}?rating=3" style="font-size: 32px; text-decoration: none; margin: 0 5px;">⭐</a>
            <a href="https://fixkart.com/review/${booking.id}?rating=2" style="font-size: 32px; text-decoration: none; margin: 0 5px;">⭐</a>
            <a href="https://fixkart.com/review/${booking.id}?rating=1" style="font-size: 32px; text-decoration: none; margin: 0 5px;">⭐</a>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 16px;">30-Day Warranty</h3>
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Your service comes with a 30-day warranty. If you face any issues, we'll fix it for free!
          </p>
        </div>
        
        <div style="text-align: center;">
          <a href="https://fixkart.com/review/${booking.id}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Write a Review
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          Thank you for choosing FixKart! 💙
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  /**
   * Password reset email
   */
  passwordReset: (resetLink) => ({
    subject: 'Reset your FixKart password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <p style="color: #333333; font-size: 16px; margin: 0 0 30px;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px; margin: 30px 0 0;">
          This link will expire in 1 hour.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #fef2f2; padding: 20px 30px; text-align: center;">
        <p style="color: #dc2626; font-size: 13px; margin: 0;">
          If you didn't request this, please ignore this email or contact support.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),
};

/**
 * Send templated email
 */
const sendTemplatedEmail = async (to, templateName, data) => {
  if (!templates[templateName]) {
    throw new Error(`Template '${templateName}' not found`);
  }
  
  const template = templates[templateName](data);
  return sendEmail(to, template.subject, template.html);
};

module.exports = {
  sendEmail,
  sendTemplatedEmail,
  templates,
};

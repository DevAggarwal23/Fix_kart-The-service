/**
 * SMS Service
 * Handles all SMS communications using Twilio
 */

const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const fromNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send SMS
 */
const sendSMS = async (to, message) => {
  try {
    // Format phone number for India
    let formattedNumber = to;
    if (!to.startsWith('+')) {
      formattedNumber = to.startsWith('91') ? `+${to}` : `+91${to}`;
    }

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedNumber,
    });

    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * SMS Templates
 */
const templates = {
  /**
   * OTP verification
   */
  otp: (otp) => 
    `Your FixKart verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`,

  /**
   * Booking confirmation
   */
  bookingConfirmed: (booking) =>
    `FixKart Booking Confirmed! 🎉
Service: ${booking.serviceName}
Date: ${booking.scheduledDate}
Time: ${booking.scheduledTime}
OTP: ${booking.otp}
Track: fixkart.com/b/${booking.id.slice(-6)}`,

  /**
   * Worker assigned
   */
  workerAssigned: (booking, worker) =>
    `FixKart: ${worker.name} has been assigned for your ${booking.serviceName}. They will arrive at ${booking.scheduledTime}. Contact: ${worker.phone}`,

  /**
   * Worker on the way
   */
  workerOnWay: (booking, eta) =>
    `FixKart: Your service professional is on the way! ETA: ${eta} mins. Track live: fixkart.com/track/${booking.id.slice(-6)}`,

  /**
   * Worker arrived
   */
  workerArrived: (booking) =>
    `FixKart: Your service professional has arrived! Share OTP: ${booking.otp} to start the service.`,

  /**
   * Service started
   */
  serviceStarted: (booking) =>
    `FixKart: Your ${booking.serviceName} service has started. We'll notify you when it's completed.`,

  /**
   * Service completed
   */
  serviceCompleted: (booking) =>
    `FixKart: Your ${booking.serviceName} is complete! 🎉 Rate your experience: fixkart.com/review/${booking.id.slice(-6)}`,

  /**
   * Booking cancelled
   */
  bookingCancelled: (booking, refundAmount) =>
    `FixKart: Your booking #${booking.bookingNumber} has been cancelled. ${refundAmount > 0 ? `Refund of ₹${refundAmount} will be processed within 5-7 days.` : ''}`,

  /**
   * Booking reminder
   */
  bookingReminder: (booking) =>
    `FixKart Reminder: Your ${booking.serviceName} is scheduled for tomorrow at ${booking.scheduledTime}. Need to reschedule? Call 1800-123-4567`,

  /**
   * Payment received
   */
  paymentReceived: (amount, bookingNumber) =>
    `FixKart: Payment of ₹${amount} received for booking #${bookingNumber}. Thank you!`,

  /**
   * Refund processed
   */
  refundProcessed: (amount, bookingNumber) =>
    `FixKart: Refund of ₹${amount} for booking #${bookingNumber} has been initiated. It will reflect in 5-7 business days.`,

  /**
   * Worker registration approved
   */
  workerApproved: (name) =>
    `Congratulations ${name}! Your FixKart partner registration is approved. Login to the app to start receiving job requests.`,

  /**
   * Worker new job alert
   */
  workerNewJob: (job) =>
    `FixKart Job Alert! New ${job.serviceName} job near you. Earn ₹${job.earnings}. Accept now in the app!`,

  /**
   * Worker job reminder
   */
  workerJobReminder: (job) =>
    `FixKart Reminder: You have a ${job.serviceName} job scheduled in 1 hour at ${job.address}. Customer: ${job.customerName}`,

  /**
   * Worker payment
   */
  workerPaymentProcessed: (amount) =>
    `FixKart: ₹${amount} has been transferred to your bank account. Check earnings in the app.`,

  /**
   * Promotional offer
   */
  promotional: (offer) =>
    `FixKart: ${offer.title}! ${offer.description}. Use code: ${offer.code}. Valid till ${offer.validTill}. T&C apply.`,

  /**
   * Welcome message
   */
  welcome: (name) =>
    `Welcome to FixKart, ${name}! 🎉 Book AC repair, plumbing, electrical & more services at your doorstep. Download app: fixkart.com/app`,
};

/**
 * Send templated SMS
 */
const sendTemplatedSMS = async (to, templateName, data) => {
  if (!templates[templateName]) {
    throw new Error(`Template '${templateName}' not found`);
  }

  const message = typeof templates[templateName] === 'function'
    ? templates[templateName](data)
    : templates[templateName];

  return sendSMS(to, message);
};

/**
 * Send bulk SMS
 */
const sendBulkSMS = async (recipients, message) => {
  const results = {
    success: [],
    failed: [],
  };

  for (const to of recipients) {
    const result = await sendSMS(to, message);
    if (result.success) {
      results.success.push({ to, sid: result.sid });
    } else {
      results.failed.push({ to, error: result.error });
    }
    // Rate limiting - wait 100ms between messages
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};

/**
 * Verify Twilio webhook signature
 */
const verifyWebhookSignature = (signature, url, params) => {
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    params
  );
};

module.exports = {
  sendSMS,
  sendTemplatedSMS,
  sendBulkSMS,
  verifyWebhookSignature,
  templates,
};

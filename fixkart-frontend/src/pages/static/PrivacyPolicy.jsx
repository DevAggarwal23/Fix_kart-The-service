import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiMail } from 'react-icons/fi';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `
        Welcome to FixKart ("Company", "we", "our", "us"). We are committed to protecting 
        your personal information and your right to privacy. This Privacy Policy explains 
        how we collect, use, disclose, and safeguard your information when you use our 
        mobile application and website (collectively, the "Platform").

        Please read this privacy policy carefully. If you do not agree with the terms of 
        this privacy policy, please do not access the Platform.
      `,
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      content: `
        We collect information that you provide directly to us, including:

        **Personal Information:**
        - Name, email address, phone number
        - Billing and shipping addresses
        - Date of birth
        - Profile picture
        - Government ID (for verification purposes)

        **Payment Information:**
        - Credit/debit card details (processed via secure payment gateway)
        - UPI details
        - Bank account information (for professionals)

        **Service Information:**
        - Booking history and preferences
        - Reviews and ratings
        - Communication with professionals

        **Automatically Collected Information:**
        - Device information (type, operating system, unique device identifiers)
        - IP address and location data
        - App usage data and analytics
        - Cookies and similar tracking technologies
      `,
    },
    {
      id: 'use-of-information',
      title: '3. How We Use Your Information',
      content: `
        We use the information we collect for various purposes, including:

        **Service Delivery:**
        - Process and manage bookings
        - Connect customers with service professionals
        - Provide customer support
        - Process payments and prevent fraud

        **Communication:**
        - Send booking confirmations and updates
        - Notify about promotions and offers (with your consent)
        - Respond to inquiries and feedback

        **Improvement & Analytics:**
        - Improve our Platform and services
        - Analyze usage patterns and trends
        - Develop new features and services
        - Personalize your experience

        **Legal & Safety:**
        - Comply with legal obligations
        - Enforce our terms and policies
        - Protect against fraudulent or illegal activity
      `,
    },
    {
      id: 'sharing-information',
      title: '4. Sharing of Information',
      content: `
        We may share your information in the following circumstances:

        **With Service Professionals:**
        - Your name, address, and contact details are shared with professionals assigned to your booking.

        **With Third-Party Service Providers:**
        - Payment processors (Razorpay)
        - Cloud hosting providers (Firebase, Google Cloud)
        - Analytics providers (Google Analytics)
        - SMS and email service providers

        **For Legal Reasons:**
        - To comply with legal process or government requests
        - To enforce our terms and policies
        - To protect rights, privacy, safety, or property

        **Business Transfers:**
        - In connection with mergers, acquisitions, or sale of assets

        We do not sell your personal information to third parties for marketing purposes.
      `,
    },
    {
      id: 'data-security',
      title: '5. Data Security',
      content: `
        We implement appropriate technical and organizational security measures to protect 
        your personal information, including:

        - SSL/TLS encryption for data in transit
        - Encrypted storage for sensitive data
        - Access controls and authentication
        - Regular security audits and updates
        - Employee training on data protection

        However, no method of transmission over the Internet or electronic storage is 
        100% secure. While we strive to protect your information, we cannot guarantee 
        absolute security.
      `,
    },
    {
      id: 'your-rights',
      title: '6. Your Rights',
      content: `
        You have certain rights regarding your personal information:

        **Access:** Request a copy of the personal data we hold about you.

        **Correction:** Request correction of inaccurate or incomplete data.

        **Deletion:** Request deletion of your personal data (subject to legal requirements).

        **Opt-out:** Unsubscribe from marketing communications at any time.

        **Data Portability:** Request your data in a portable format.

        **Withdraw Consent:** Withdraw consent where processing is based on consent.

        To exercise these rights, please contact us at privacy@fixkart.com.
      `,
    },
    {
      id: 'cookies',
      title: '7. Cookies & Tracking',
      content: `
        We use cookies and similar tracking technologies to:

        - Remember your preferences and settings
        - Authenticate users and prevent fraud
        - Analyze site traffic and usage
        - Personalize content and ads

        You can control cookies through your browser settings. Note that disabling cookies 
        may affect the functionality of our Platform.

        **Types of Cookies:**
        - Essential cookies (required for basic functionality)
        - Analytics cookies (to understand usage patterns)
        - Functional cookies (to remember preferences)
        - Advertising cookies (to show relevant ads)
      `,
    },
    {
      id: 'data-retention',
      title: '8. Data Retention',
      content: `
        We retain your personal information for as long as necessary to:

        - Provide our services to you
        - Comply with legal obligations
        - Resolve disputes and enforce agreements
        - Meet business requirements

        After the retention period, we securely delete or anonymize your data. 
        Typical retention periods:

        - Active accounts: Until account deletion
        - Booking records: 7 years (for legal/tax purposes)
        - Payment data: As required by payment regulations
        - Analytics data: 26 months
      `,
    },
    {
      id: 'children',
      title: '9. Children\'s Privacy',
      content: `
        Our Platform is not intended for children under 18 years of age. We do not 
        knowingly collect personal information from children. If you are a parent or 
        guardian and believe your child has provided us with personal information, 
        please contact us immediately.
      `,
    },
    {
      id: 'changes',
      title: '10. Changes to This Policy',
      content: `
        We may update this Privacy Policy from time to time. We will notify you of 
        any changes by posting the new Privacy Policy on this page and updating the 
        "Last Updated" date.

        We encourage you to review this Privacy Policy periodically for any changes. 
        Your continued use of the Platform after changes constitutes acceptance of the 
        updated policy.
      `,
    },
    {
      id: 'contact',
      title: '11. Contact Us',
      content: `
        If you have questions or concerns about this Privacy Policy or our data practices, 
        please contact us:

        **Data Protection Officer**
        FixKart Services Private Limited
        15th Floor, WeWork, BKC
        Mumbai, Maharashtra 400051

        Email: privacy@fixkart.com
        Phone: +91 9876543210

        For general inquiries: support@fixkart.com
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiShield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg opacity-90">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-8 -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: FiLock, title: 'Data Encrypted', desc: 'All data is encrypted in transit and at rest' },
              { icon: FiEye, title: 'No Selling Data', desc: 'We never sell your personal data to third parties' },
              { icon: FiMail, title: 'Contact Us', desc: 'Reach out anytime at privacy@fixkart.com' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Table of Contents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
            <nav className="grid md:grid-cols-2 gap-2">
              {sections.map((section, idx) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-primary-600 hover:underline text-sm"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {section.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

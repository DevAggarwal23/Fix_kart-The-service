import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFileText, FiAlertCircle, FiCheck } from 'react-icons/fi';

const Terms = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `
        By accessing or using the FixKart platform ("Platform"), including our website 
        and mobile application, you agree to be bound by these Terms of Service ("Terms"). 
        If you do not agree to these Terms, please do not use our Platform.

        These Terms constitute a legally binding agreement between you and FixKart Services 
        Private Limited ("Company", "we", "us", "our"). We may update these Terms from time 
        to time, and your continued use of the Platform constitutes acceptance of any changes.
      `,
    },
    {
      id: 'eligibility',
      title: '2. Eligibility',
      content: `
        To use our Platform, you must:

        • Be at least 18 years of age
        • Be legally capable of entering into binding contracts
        • Not be prohibited from using the Platform under applicable law
        • Have a valid phone number and email address

        By using our Platform, you represent and warrant that you meet all eligibility requirements.
      `,
    },
    {
      id: 'account',
      title: '3. User Account',
      content: `
        **Account Creation:**
        You must create an account to access certain features. You agree to provide accurate, 
        current, and complete information during registration and keep your account information 
        updated.

        **Account Security:**
        You are responsible for maintaining the confidentiality of your account credentials 
        and for all activities that occur under your account. Notify us immediately of any 
        unauthorized access.

        **Account Termination:**
        We reserve the right to suspend or terminate your account for violation of these Terms, 
        suspicious activity, or at our discretion. You may also delete your account at any time.
      `,
    },
    {
      id: 'services',
      title: '4. Services',
      content: `
        **Platform Services:**
        FixKart is a technology platform that connects customers with independent service 
        professionals. We do not provide the actual services ourselves but facilitate the 
        connection between customers and professionals.

        **Service Booking:**
        When you book a service, you are entering into an agreement with the assigned 
        service professional. FixKart acts as an intermediary to facilitate this transaction.

        **Service Quality:**
        While we verify and train professionals, we do not guarantee the quality of services 
        provided. Our professionals are independent contractors, not employees of FixKart.
      `,
    },
    {
      id: 'pricing',
      title: '5. Pricing & Payments',
      content: `
        **Service Pricing:**
        All prices are displayed in Indian Rupees (INR) and include applicable taxes unless 
        otherwise stated. Prices may vary based on location, time slots, and service type.

        **Payment Methods:**
        We accept various payment methods including credit/debit cards, UPI, net banking, 
        and FixKart wallet. Cash payments may be available for select services.

        **Cancellation & Refunds:**
        • Cancellations made 2+ hours before scheduled time: Full refund
        • Cancellations within 2 hours: Partial refund (cancellation fee applies)
        • No-shows: No refund
        • Refunds are processed within 5-7 business days

        **Additional Charges:**
        Additional work identified during service will be quoted separately and requires 
        your approval before proceeding. You are responsible for any agreed additional charges.
      `,
    },
    {
      id: 'user-conduct',
      title: '6. User Conduct',
      content: `
        You agree NOT to:

        • Provide false or misleading information
        • Harass, abuse, or harm service professionals
        • Use the Platform for illegal purposes
        • Attempt to circumvent the Platform to engage professionals directly
        • Copy, modify, or distribute Platform content without permission
        • Use automated systems to access the Platform
        • Interfere with the proper working of the Platform
        • Engage in fraudulent activities or misuse promotions

        Violation of these terms may result in account suspension or termination.
      `,
    },
    {
      id: 'professional-terms',
      title: '7. Terms for Service Professionals',
      content: `
        **Independent Contractor:**
        Service professionals are independent contractors and not employees of FixKart. 
        Professionals are responsible for their own taxes, insurance, and compliance.

        **Professional Obligations:**
        • Maintain valid licenses and certifications
        • Arrive on time and provide quality service
        • Follow FixKart's guidelines and code of conduct
        • Treat customers with respect and professionalism

        **Commission & Payments:**
        FixKart deducts a platform commission from each booking. Remaining earnings are 
        credited to the professional's wallet and can be withdrawn as per our policies.
      `,
    },
    {
      id: 'intellectual-property',
      title: '8. Intellectual Property',
      content: `
        **Our Content:**
        All content on the Platform, including logos, text, graphics, software, and design, 
        is owned by FixKart and protected by intellectual property laws. You may not use, 
        copy, or distribute our content without written permission.

        **User Content:**
        By posting reviews, photos, or other content on our Platform, you grant FixKart a 
        non-exclusive, royalty-free license to use, display, and share this content.
      `,
    },
    {
      id: 'disclaimer',
      title: '9. Disclaimers',
      content: `
        **As-Is Basis:**
        The Platform and services are provided "as is" without warranties of any kind. 
        We do not guarantee uninterrupted or error-free service.

        **Third-Party Services:**
        We are not responsible for services provided by professionals or third-party 
        payment processors. You engage with them at your own risk.

        **No Professional Advice:**
        Content on our Platform is for informational purposes only and does not constitute 
        professional advice.
      `,
    },
    {
      id: 'liability',
      title: '10. Limitation of Liability',
      content: `
        To the maximum extent permitted by law:

        • FixKart shall not be liable for indirect, incidental, special, or consequential damages
        • Our total liability shall not exceed the amount paid by you for the specific service
        • We are not liable for damages arising from professional negligence or misconduct

        Some jurisdictions do not allow limitation of liability, so some limitations may 
        not apply to you.
      `,
    },
    {
      id: 'indemnification',
      title: '11. Indemnification',
      content: `
        You agree to indemnify, defend, and hold harmless FixKart, its officers, directors, 
        employees, and agents from any claims, damages, losses, or expenses arising from:

        • Your use of the Platform
        • Your violation of these Terms
        • Your violation of any rights of third parties
        • Your interactions with service professionals
      `,
    },
    {
      id: 'dispute',
      title: '12. Dispute Resolution',
      content: `
        **Governing Law:**
        These Terms are governed by the laws of India.

        **Arbitration:**
        Any dispute arising from these Terms shall be resolved through binding arbitration 
        in Mumbai, India, in accordance with the Arbitration and Conciliation Act, 1996.

        **Time Limitation:**
        Any claim must be brought within one (1) year after the cause of action arises.

        **Customer Complaints:**
        For service-related complaints, please contact our support team. We aim to resolve 
        all complaints within 7 business days.
      `,
    },
    {
      id: 'general',
      title: '13. General Provisions',
      content: `
        **Entire Agreement:**
        These Terms, along with our Privacy Policy, constitute the entire agreement between 
        you and FixKart.

        **Severability:**
        If any provision is found invalid, the remaining provisions remain in effect.

        **Waiver:**
        Failure to enforce any right does not constitute a waiver of that right.

        **Assignment:**
        You may not assign your rights under these Terms. FixKart may assign its rights 
        without restriction.
      `,
    },
    {
      id: 'contact',
      title: '14. Contact Information',
      content: `
        For questions about these Terms, please contact:

        FixKart Services Private Limited
        15th Floor, WeWork, BKC
        Mumbai, Maharashtra 400051

        Email: legal@fixkart.com
        Phone: +91 9876543210
        
        For support: support@fixkart.com
      `,
    },
  ];

  const keyPoints = [
    'You must be 18+ to use FixKart',
    'Service professionals are independent contractors',
    'Cancellation within 2 hours may incur a fee',
    'Platform commission is deducted from professional earnings',
    'Disputes are resolved through arbitration in Mumbai',
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
              <FiFileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg opacity-90">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-8 -mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle className="w-6 h-6 text-primary-600" />
              <h2 className="font-bold text-gray-900 dark:text-white">Key Points</h2>
            </div>
            <ul className="grid md:grid-cols-2 gap-3">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Table of Contents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
            <nav className="grid md:grid-cols-2 gap-2">
              {sections.map((section) => (
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

          {/* Terms Sections */}
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

          {/* Acceptance Banner */}
          <div className="mt-12 bg-gradient-to-r from-primary-600 to-blue-700 rounded-xl p-6 text-white text-center">
            <p className="mb-4">
              By using FixKart, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100"
              >
                Create Account
              </Link>
              <Link
                to="/privacy"
                className="px-6 py-2 border border-white text-white rounded-lg font-medium hover:bg-white/10"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;

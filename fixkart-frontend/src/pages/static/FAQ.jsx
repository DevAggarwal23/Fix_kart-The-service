import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiMinus, FiMessageCircle, FiPhone } from 'react-icons/fi';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItems, setExpandedItems] = useState([]);

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'bookings', name: 'Bookings' },
    { id: 'payments', name: 'Payments' },
    { id: 'services', name: 'Services' },
    { id: 'workers', name: 'For Professionals' },
    { id: 'account', name: 'Account' },
  ];

  const faqs = {
    general: [
      {
        id: 1,
        question: 'What is FixKart?',
        answer: 'FixKart is India\'s leading AI-powered home services platform that connects you with verified and skilled professionals for all your home service needs including cleaning, repairs, installations, and more.',
      },
      {
        id: 2,
        question: 'In which cities is FixKart available?',
        answer: 'FixKart is currently available in 100+ cities across India including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, and many more. We are continuously expanding to new cities.',
      },
      {
        id: 3,
        question: 'Are all professionals verified?',
        answer: 'Yes, all professionals on FixKart go through a thorough verification process including ID verification, background checks, skill assessment, and training. We ensure only qualified and trustworthy professionals are onboarded.',
      },
      {
        id: 4,
        question: 'What if I\'m not satisfied with the service?',
        answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with the service, you can raise a complaint within 7 days and we\'ll either resolve the issue or provide a full refund.',
      },
    ],
    bookings: [
      {
        id: 5,
        question: 'How do I book a service?',
        answer: 'Booking a service is easy! Simply select your desired service, choose a time slot, provide your address, and confirm. You\'ll receive instant confirmation and can track your professional in real-time.',
      },
      {
        id: 6,
        question: 'Can I reschedule or cancel a booking?',
        answer: 'Yes, you can reschedule or cancel a booking up to 2 hours before the scheduled time without any charges. For cancellations within 2 hours, a nominal cancellation fee may apply.',
      },
      {
        id: 7,
        question: 'How far in advance can I book?',
        answer: 'You can book a service up to 30 days in advance. For immediate needs, we also offer express booking where a professional can reach you within 2-4 hours.',
      },
      {
        id: 8,
        question: 'Can I request a specific professional?',
        answer: 'Yes! If you\'ve had a great experience with a professional, you can add them to your favorites and request them for future bookings. Subject to their availability.',
      },
    ],
    payments: [
      {
        id: 9,
        question: 'What payment methods are accepted?',
        answer: 'We accept all major payment methods including Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, FixKart Wallet, and Cash on Service (for select locations).',
      },
      {
        id: 10,
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use industry-standard encryption and partner with Razorpay for payment processing. Your payment details are never stored on our servers.',
      },
      {
        id: 11,
        question: 'How do refunds work?',
        answer: 'Refunds are processed within 5-7 business days. The amount will be credited back to your original payment method or FixKart Wallet (for faster access).',
      },
      {
        id: 12,
        question: 'Are there any hidden charges?',
        answer: 'No, there are no hidden charges. The price shown during booking is the final price. Any additional work required will be quoted and approved by you before proceeding.',
      },
    ],
    services: [
      {
        id: 13,
        question: 'What services does FixKart offer?',
        answer: 'FixKart offers 50+ home services including AC repair & cleaning, home cleaning, plumbing, electrical work, appliance repair, pest control, painting, carpentry, and more.',
      },
      {
        id: 14,
        question: 'Do professionals bring their own tools?',
        answer: 'Yes, all professionals come equipped with the necessary tools and basic materials required for the service. Specialized parts may need to be purchased separately if required.',
      },
      {
        id: 15,
        question: 'What is the warranty on services?',
        answer: 'We provide a 30-day service warranty on all services. If there\'s any issue with the work done, we\'ll send the professional back to fix it at no extra cost.',
      },
      {
        id: 16,
        question: 'Can I book multiple services together?',
        answer: 'Yes! You can book multiple services in a single booking and even apply combo discounts. Our AI assistant can help you find the best package for your needs.',
      },
    ],
    workers: [
      {
        id: 17,
        question: 'How can I join FixKart as a professional?',
        answer: 'You can apply through our app or website. You\'ll need to submit ID proof, skill certifications, and undergo a verification process. Once approved, you can start accepting jobs.',
      },
      {
        id: 18,
        question: 'What are the earning opportunities?',
        answer: 'Professionals on FixKart earn ₹25,000 - ₹80,000+ monthly depending on their skills, ratings, and number of jobs completed. Top performers earn additional bonuses.',
      },
      {
        id: 19,
        question: 'How is payment handled for professionals?',
        answer: 'Earnings are credited to your FixKart wallet after each completed job. You can withdraw anytime to your bank account. Payouts are processed within 24 hours.',
      },
      {
        id: 20,
        question: 'Is there any training provided?',
        answer: 'Yes, we provide free training programs for skill enhancement, customer service, and platform usage. Completing training programs unlocks higher-paying jobs.',
      },
    ],
    account: [
      {
        id: 21,
        question: 'How do I create an account?',
        answer: 'You can sign up using your phone number or email. OTP verification is required for phone sign-up. You can also sign up using Google or Apple ID for faster access.',
      },
      {
        id: 22,
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page, enter your registered email/phone, and follow the OTP verification process to set a new password.',
      },
      {
        id: 23,
        question: 'Can I have multiple addresses saved?',
        answer: 'Yes, you can save multiple addresses (home, office, etc.) and choose the appropriate one during booking. You can manage addresses from your profile.',
      },
      {
        id: 24,
        question: 'How do I delete my account?',
        answer: 'Go to Settings > Account > Delete Account. Please note that this action is irreversible and you\'ll lose your booking history, wallet balance, and rewards.',
      },
    ],
  };

  const toggleItem = (id) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = searchQuery
    ? Object.values(faqs).flat().filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90 mb-8">
              Find answers to common questions about FixKart
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories */}
            {!searchQuery && (
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sticky top-24">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
                  <nav className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg ${
                          activeCategory === category.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* FAQ List */}
            <div className="flex-1">
              {searchQuery && (
                <p className="text-gray-500 mb-4">
                  Found {filteredFaqs.length} results for "{searchQuery}"
                </p>
              )}

              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        expandedItems.includes(faq.id)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {expandedItems.includes(faq.id) ? (
                          <FiMinus className="w-4 h-4" />
                        ) : (
                          <FiPlus className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No results found for your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary-600 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-500 mb-8">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <FiMessageCircle /> Contact Support
            </Link>
            <a
              href="tel:+919876543210"
              className="px-6 py-3 border dark:border-gray-700 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <FiPhone /> Call +91 9876543210
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

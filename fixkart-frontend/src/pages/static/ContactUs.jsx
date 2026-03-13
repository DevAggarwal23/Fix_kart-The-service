import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, FiPhone, FiMapPin, FiClock, FiSend,
  FiMessageCircle, FiHelpCircle, FiUser
} from 'react-icons/fi';
import { BsWhatsapp, BsTwitter, BsInstagram, BsFacebook, BsLinkedin } from 'react-icons/bs';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'support@fixkart.com', link: 'mailto:support@fixkart.com' },
    { icon: FiPhone, label: 'Phone', value: '+91 9876543210', link: 'tel:+919876543210' },
    { icon: BsWhatsapp, label: 'WhatsApp', value: '+91 9876543210', link: 'https://wa.me/919876543210' },
    { icon: FiClock, label: 'Working Hours', value: '8 AM - 10 PM, All Days' },
  ];

  const offices = [
    {
      city: 'Mumbai',
      address: '15th Floor, WeWork, BKC, Mumbai - 400051',
      phone: '+91 22 4567 8900',
    },
    {
      city: 'Delhi',
      address: '8th Floor, One Horizon, Sector 43, Gurugram - 122002',
      phone: '+91 124 456 7890',
    },
    {
      city: 'Bangalore',
      address: '5th Floor, Prestige Tower, MG Road, Bangalore - 560001',
      phone: '+91 80 4567 8900',
    },
  ];

  const subjects = [
    'General Inquiry',
    'Booking Issue',
    'Payment Problem',
    'Complaint',
    'Partnership',
    'Career Inquiry',
    'Media & Press',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-lg"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSend className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Message Sent!</h2>
          <p className="text-gray-500 mb-6">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">
              We're here to help! Reach out to us anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((info, idx) => (
              <motion.a
                key={idx}
                href={info.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <info.icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-gray-500 text-sm">{info.label}</p>
                <p className="font-bold text-gray-900 dark:text-white">{info.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        className="w-full pl-10 pr-4 py-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg resize-none dark:bg-gray-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend /> Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map & Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                    <p className="text-gray-500">Google Maps Integration</p>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Our Offices</h3>
                <div className="space-y-4">
                  {offices.map((office, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b dark:border-gray-700 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{office.city}</p>
                        <p className="text-sm text-gray-500">{office.address}</p>
                        <p className="text-sm text-primary-600">{office.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: BsFacebook, label: 'Facebook', color: 'bg-blue-600' },
                    { icon: BsTwitter, label: 'Twitter', color: 'bg-sky-500' },
                    { icon: BsInstagram, label: 'Instagram', color: 'bg-pink-600' },
                    { icon: BsLinkedin, label: 'LinkedIn', color: 'bg-blue-700' },
                    { icon: BsWhatsapp, label: 'WhatsApp', color: 'bg-green-600' },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className={`${social.color} text-white p-3 rounded-lg hover:opacity-80`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Quick Help?</h2>
            <p className="text-gray-500">Check out these resources for instant assistance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FiHelpCircle, title: 'FAQ', desc: 'Find answers to common questions', link: '/faq' },
              { icon: FiMessageCircle, title: 'Live Chat', desc: 'Chat with our AI assistant', link: '#' },
              { icon: FiPhone, title: 'Call Us', desc: 'Speak to a support agent', link: 'tel:+919876543210' },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="block p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

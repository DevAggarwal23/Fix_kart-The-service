import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiTarget, FiHeart, FiAward, FiMapPin,
  FiCheck, FiArrowRight
} from 'react-icons/fi';
import { BsBuilding, BsGraphUp, BsShieldCheck, BsLightning } from 'react-icons/bs';

const AboutUs = () => {
  const stats = [
    { value: '1M+', label: 'Happy Customers' },
    { value: '50K+', label: 'Verified Professionals' },
    { value: '100+', label: 'Cities Served' },
    { value: '10M+', label: 'Services Completed' },
  ];

  const values = [
    { icon: BsShieldCheck, title: 'Trust & Safety', desc: 'All professionals are background verified and trained' },
    { icon: BsLightning, title: 'Quick & Reliable', desc: 'Same-day service with punctual professionals' },
    { icon: FiHeart, title: 'Quality Assured', desc: '100% satisfaction guarantee on all services' },
    { icon: FiAward, title: 'Best Prices', desc: 'Transparent pricing with no hidden charges' },
  ];

  const team = [
    { name: 'Amit Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { name: 'Priya Patel', role: 'Co-Founder & COO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { name: 'Rahul Verma', role: 'CTO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
    { name: 'Neha Singh', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  ];

  const milestones = [
    { year: '2019', title: 'Founded', desc: 'FixKart was born with a vision to revolutionize home services' },
    { year: '2020', title: 'Expansion', desc: 'Expanded to 10 major cities across India' },
    { year: '2021', title: 'AI Integration', desc: 'Launched AI-powered assistant for smart recommendations' },
    { year: '2022', title: '1M Users', desc: 'Crossed 1 million satisfied customers' },
    { year: '2023', title: 'Series B', desc: 'Raised $50M to fuel nationwide expansion' },
    { year: '2024', title: '100 Cities', desc: 'Now serving customers in 100+ cities' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Making Home Services <br />Simple & Reliable
            </h1>
            <p className="text-xl opacity-90 mb-8">
              FixKart is India's leading AI-powered home services platform, 
              connecting millions of customers with verified professionals.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/services"
                className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100"
              >
                Explore Services
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                FixKart was founded in 2019 with a simple mission: to make home services 
                accessible, reliable, and affordable for everyone. We noticed that finding 
                a trusted professional for home repairs and services was a frustrating experience.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Starting with just 3 cities and 100 professionals, we've grown to become 
                India's most trusted home services platform. Today, we connect millions of 
                customers with over 50,000 verified professionals across 100+ cities.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI-powered platform ensures you get the right professional for your need, 
                at the best price, with complete transparency and safety.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400"
                alt="Service"
                className="rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
                alt="Cleaning"
                className="rounded-2xl shadow-lg mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              What sets us apart and drives everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl text-center"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-500">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-gray-500">Key milestones in our growth story</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-primary-200 dark:bg-primary-900" />
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow inline-block">
                      <span className="text-primary-600 font-bold">{milestone.year}</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                      <p className="text-gray-500">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white dark:border-gray-900 z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-gray-500">Meet the people behind FixKart</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                />
                <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the FixKart Family</h2>
          <p className="text-lg opacity-90 mb-8">
            Whether you're a customer looking for home services or a professional 
            looking to grow your business, we'd love to have you!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 flex items-center gap-2"
            >
              Sign Up Now <FiArrowRight />
            </Link>
            <Link
              to="/worker/signup"
              className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10"
            >
              Join as Professional
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

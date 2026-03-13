import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiPrinter, FiShare2 } from 'react-icons/fi';

const Invoice = () => {
  const { invoiceId } = useParams();
  const invoiceRef = useRef(null);

  // Mock invoice data
  const invoice = {
    id: invoiceId || 'INV-2024-001',
    bookingId: 'FX12345678',
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    customer: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      email: 'john@example.com',
      address: '123 Main Street, Sector 15, Noida, UP - 201301',
    },
    service: {
      category: 'AC Repair & Service',
      name: 'AC General Service',
      worker: 'Rajesh Kumar',
      workerId: 'WRK-001',
    },
    items: [
      { description: 'AC General Service', qty: 1, rate: 399, amount: 399 },
      { description: 'Gas Refill (R32)', qty: 1, rate: 1500, amount: 1500 },
      { description: 'Filter Cleaning', qty: 1, rate: 0, amount: 0 },
    ],
    subtotal: 1899,
    visitingCharge: 49,
    discount: 100,
    tax: 89,
    total: 1937,
    paymentMethod: 'UPI - Google Pay',
    transactionId: 'TXN87654321',
    status: 'Paid',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        {/* Header Actions - Hide on print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            to="/dashboard/bookings"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Bookings
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FiPrinter className="w-5 h-5" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <FiDownload className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <motion.div
          ref={invoiceRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white print:bg-primary-600">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-bold">FixKart</h1>
                <p className="text-sm opacity-80 mt-1">AI-Powered Home Services</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold">INVOICE</h2>
                <p className="text-sm opacity-80 mt-1">{invoice.id}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Bill To
                </h3>
                <p className="font-bold text-gray-900 dark:text-white">{invoice.customer.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.customer.phone}</p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.customer.email}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{invoice.customer.address}</p>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Invoice Date
                  </h3>
                  <p className="text-gray-900 dark:text-white">{invoice.date}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Booking ID
                  </h3>
                  <p className="text-gray-900 dark:text-white font-mono">{invoice.bookingId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Status
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    ✓ {invoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Service Details
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{invoice.service.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.service.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Service Provider</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.service.worker}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Description
                    </th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Qty
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Rate
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-700">
                      <td className="py-3 text-gray-900 dark:text-white">{item.description}</td>
                      <td className="py-3 text-center text-gray-600 dark:text-gray-400">{item.qty}</td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                        {item.rate === 0 ? 'Free' : `₹${item.rate}`}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                        {item.amount === 0 ? 'Free' : `₹${item.amount}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₹{invoice.subtotal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Visiting Charge</span>
                  <span className="text-gray-900 dark:text-white">₹{invoice.visitingCharge}</span>
                </div>
                <div className="flex justify-between py-2 text-green-600">
                  <span>Discount</span>
                  <span>-₹{invoice.discount}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax (GST 18%)</span>
                  <span className="text-gray-900 dark:text-white">₹{invoice.tax}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 dark:border-gray-700 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">₹{invoice.total}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-8">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase mb-2">
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                  <p className="font-mono text-gray-900 dark:text-white">{invoice.transactionId}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t dark:border-gray-700 pt-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Thank you for choosing FixKart! 🎉
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                For any queries, contact us at support@fixkart.com | +91 1800-123-4567
              </p>
              <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400">
                <span>GST: 07ABCDE1234F1Z5</span>
                <span>CIN: U74999DL2024PTC123456</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Options - Hide on print */}
        <div className="flex justify-center gap-4 mt-6 print:hidden">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
            <FiShare2 className="w-5 h-5" />
            Share via WhatsApp
          </button>
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
            <FiShare2 className="w-5 h-5" />
            Share via Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

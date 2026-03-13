import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiEye, FiEdit2, FiDownload, FiCalendar,
  FiMapPin, FiClock, FiUser, FiPhone, FiX, FiCheck
} from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock Data
  const bookings = [
    {
      id: 'FK125001',
      customer: { name: 'Amit Sharma', phone: '+91 98765 43210', avatar: 'https://i.pravatar.cc/150?img=8' },
      worker: { name: 'Rajesh Kumar', phone: '+91 87654 32109', avatar: 'https://i.pravatar.cc/150?img=12' },
      service: 'AC Repair',
      category: 'AC Services',
      address: '245, Koramangala 4th Block, Bangalore',
      scheduledDate: 'Dec 15, 2024',
      scheduledTime: '10:30 AM',
      amount: 549,
      paymentStatus: 'paid',
      status: 'in_progress',
      createdAt: 'Dec 13, 2024',
    },
    {
      id: 'FK125002',
      customer: { name: 'Priya Mehta', phone: '+91 87654 32109', avatar: 'https://i.pravatar.cc/150?img=5' },
      worker: { name: 'Suresh Patel', phone: '+91 76543 21098', avatar: 'https://i.pravatar.cc/150?img=15' },
      service: 'Bathroom Cleaning',
      category: 'Home Cleaning',
      address: 'HSR Layout Sector 7, Bangalore',
      scheduledDate: 'Dec 15, 2024',
      scheduledTime: '2:00 PM',
      amount: 399,
      paymentStatus: 'paid',
      status: 'completed',
      createdAt: 'Dec 12, 2024',
    },
    {
      id: 'FK125003',
      customer: { name: 'Rahul Patel', phone: '+91 76543 21098', avatar: 'https://i.pravatar.cc/150?img=9' },
      worker: null,
      service: 'Plumbing Repair',
      category: 'Plumbing',
      address: 'JP Nagar 6th Phase, Bangalore',
      scheduledDate: 'Dec 16, 2024',
      scheduledTime: '11:00 AM',
      amount: 699,
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: 'Dec 14, 2024',
    },
    {
      id: 'FK125004',
      customer: { name: 'Kavitha Reddy', phone: '+91 65432 10987', avatar: 'https://i.pravatar.cc/150?img=25' },
      worker: { name: 'Mohan Verma', phone: '+91 54321 09876', avatar: 'https://i.pravatar.cc/150?img=18' },
      service: 'Electrical Wiring',
      category: 'Electrical',
      address: 'Indiranagar, Bangalore',
      scheduledDate: 'Dec 14, 2024',
      scheduledTime: '4:00 PM',
      amount: 299,
      paymentStatus: 'paid',
      status: 'completed',
      createdAt: 'Dec 12, 2024',
    },
    {
      id: 'FK125005',
      customer: { name: 'Deepak Nair', phone: '+91 54321 09876', avatar: 'https://i.pravatar.cc/150?img=22' },
      worker: { name: 'Anil Sharma', phone: '+91 43210 98765', avatar: 'https://i.pravatar.cc/150?img=20' },
      service: 'Wall Painting',
      category: 'Painting',
      address: 'Whitefield, Bangalore',
      scheduledDate: 'Dec 17, 2024',
      scheduledTime: '9:00 AM',
      amount: 1999,
      paymentStatus: 'partial',
      status: 'scheduled',
      createdAt: 'Dec 10, 2024',
    },
    {
      id: 'FK125006',
      customer: { name: 'Sneha K.', phone: '+91 32109 87654', avatar: 'https://i.pravatar.cc/150?img=32' },
      worker: null,
      service: 'Sofa Cleaning',
      category: 'Home Cleaning',
      address: 'Electronic City, Bangalore',
      scheduledDate: 'Dec 15, 2024',
      scheduledTime: '3:00 PM',
      amount: 899,
      paymentStatus: 'refunded',
      status: 'cancelled',
      createdAt: 'Dec 11, 2024',
    },
  ];

  const stats = [
    { label: 'Total Bookings', value: '2,845', period: 'This Month' },
    { label: 'Pending', value: '45', status: 'warning' },
    { label: 'In Progress', value: '128', status: 'info' },
    { label: 'Completed', value: '2,612', status: 'success' },
    { label: 'Cancelled', value: '60', status: 'error' },
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      partial: 'bg-blue-100 text-blue-700',
      refunded: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-gray-500">Manage all service bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border dark:border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow border-l-4 ${
              stat.status === 'success' ? 'border-green-500' :
              stat.status === 'warning' ? 'border-yellow-500' :
              stat.status === 'info' ? 'border-blue-500' :
              stat.status === 'error' ? 'border-red-500' : 'border-primary-500'
            }`}
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            {stat.period && <p className="text-xs text-gray-400">{stat.period}</p>}
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, customer, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'scheduled', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <span className="font-medium text-primary-600">{booking.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={booking.customer.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <span className="text-sm text-gray-900 dark:text-white">{booking.customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{booking.service}</p>
                    <p className="text-xs text-gray-500">{booking.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    {booking.worker ? (
                      <div className="flex items-center gap-2">
                        <img src={booking.worker.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <span className="text-sm text-gray-900 dark:text-white">{booking.worker.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-yellow-600">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{booking.scheduledDate}</p>
                    <p className="text-xs text-gray-500">{booking.scheduledTime}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    ₹{booking.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaymentBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowBookingModal(true); }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredBookings.length} of {bookings.length} bookings</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Previous</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">1</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {showBookingModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BsTicketPerforated className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold">Booking #{selectedBooking.id}</h2>
                </div>
                <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPaymentBadge(selectedBooking.paymentStatus)}`}>
                    Payment: {selectedBooking.paymentStatus}
                  </span>
                </div>

                {/* Service Details */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{selectedBooking.service}</h3>
                  <p className="text-gray-500">{selectedBooking.category}</p>
                </div>

                {/* Customer & Worker */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border dark:border-gray-700 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Customer</p>
                    <div className="flex items-center gap-3">
                      <img src={selectedBooking.customer.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customer.name}</p>
                        <p className="text-xs text-gray-500">{selectedBooking.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border dark:border-gray-700 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Worker</p>
                    {selectedBooking.worker ? (
                      <div className="flex items-center gap-3">
                        <img src={selectedBooking.worker.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.worker.name}</p>
                          <p className="text-xs text-gray-500">{selectedBooking.worker.phone}</p>
                        </div>
                      </div>
                    ) : (
                      <button className="w-full py-2 border-2 border-dashed dark:border-gray-600 rounded-lg text-primary-600 font-medium">
                        Assign Worker
                      </button>
                    )}
                  </div>
                </div>

                {/* Schedule & Address */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedBooking.scheduledDate} at {selectedBooking.scheduledTime}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedBooking.address}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">₹{selectedBooking.amount}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button className="flex-1 py-2 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                        <FiCheck /> Confirm
                      </button>
                      <button className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                        <FiX /> Cancel
                      </button>
                    </>
                  )}
                  {selectedBooking.status !== 'pending' && selectedBooking.status !== 'cancelled' && (
                    <>
                      <button className="flex-1 py-2 border dark:border-gray-700 rounded-xl font-medium">
                        Edit Booking
                      </button>
                      <button className="flex-1 py-2 bg-primary-600 text-white rounded-xl font-medium">
                        Contact Customer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;

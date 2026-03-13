import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiMoreVertical, FiEye, FiEdit2, FiTrash2,
  FiDownload, FiPlus, FiMail, FiPhone, FiMapPin, FiCalendar, FiX
} from 'react-icons/fi';
import { BsShieldCheck, BsExclamationTriangle } from 'react-icons/bs';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock Data
  const users = [
    {
      id: 'USR001',
      name: 'Amit Sharma',
      email: 'amit.sharma@email.com',
      phone: '+91 98765 43210',
      avatar: 'https://i.pravatar.cc/150?img=8',
      city: 'Bangalore',
      totalBookings: 15,
      totalSpent: '₹12,450',
      status: 'active',
      verified: true,
      joinedDate: 'Jan 15, 2024',
      lastActive: '2 hours ago',
    },
    {
      id: 'USR002',
      name: 'Priya Mehta',
      email: 'priya.m@email.com',
      phone: '+91 87654 32109',
      avatar: 'https://i.pravatar.cc/150?img=5',
      city: 'Mumbai',
      totalBookings: 8,
      totalSpent: '₹6,200',
      status: 'active',
      verified: true,
      joinedDate: 'Feb 22, 2024',
      lastActive: '1 day ago',
    },
    {
      id: 'USR003',
      name: 'Rahul Patel',
      email: 'rahul.p@email.com',
      phone: '+91 76543 21098',
      avatar: 'https://i.pravatar.cc/150?img=12',
      city: 'Delhi',
      totalBookings: 3,
      totalSpent: '₹2,100',
      status: 'inactive',
      verified: false,
      joinedDate: 'Mar 10, 2024',
      lastActive: '1 week ago',
    },
    {
      id: 'USR004',
      name: 'Kavitha Reddy',
      email: 'kavitha.r@email.com',
      phone: '+91 65432 10987',
      avatar: 'https://i.pravatar.cc/150?img=9',
      city: 'Hyderabad',
      totalBookings: 22,
      totalSpent: '₹18,900',
      status: 'active',
      verified: true,
      joinedDate: 'Dec 5, 2023',
      lastActive: '5 hours ago',
    },
    {
      id: 'USR005',
      name: 'Deepak Nair',
      email: 'deepak.n@email.com',
      phone: '+91 54321 09876',
      avatar: 'https://i.pravatar.cc/150?img=15',
      city: 'Chennai',
      totalBookings: 0,
      totalSpent: '₹0',
      status: 'blocked',
      verified: false,
      joinedDate: 'Apr 1, 2024',
      lastActive: 'Never',
    },
  ];

  const stats = [
    { label: 'Total Users', value: '8,932', change: '+125 this week' },
    { label: 'Active Users', value: '6,245', change: '70% of total' },
    { label: 'New Signups', value: '342', change: 'This month' },
    { label: 'Verified Users', value: '7,021', change: '78.6%' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-yellow-100 text-yellow-700',
      blocked: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border dark:border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FiDownload /> Export
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2">
            <FiPlus /> Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive', 'blocked'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                        {user.verified && (
                          <BsShieldCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.totalBookings}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.totalSpent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-500">
                        <FiTrash2 className="w-4 h-4" />
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
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Previous</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">1</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">3</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold">User Details</h2>
                <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedUser.avatar} alt="" className="w-20 h-20 rounded-full" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedUser.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Joined {selectedUser.joinedDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.totalBookings}</p>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary-600">{selectedUser.totalSpent}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 py-2 border dark:border-gray-700 rounded-xl font-medium">
                    View Bookings
                  </button>
                  <button className="flex-1 py-2 bg-primary-600 text-white rounded-xl font-medium">
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;

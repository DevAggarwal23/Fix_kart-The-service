import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiMoreVertical, FiEye, FiEdit2, FiTrash2,
  FiDownload, FiPlus, FiMail, FiPhone, FiMapPin, FiCalendar, FiX,
  FiStar, FiCheck, FiAlertTriangle
} from 'react-icons/fi';
import { BsShieldCheck, BsShieldExclamation, BsWallet2 } from 'react-icons/bs';

const AdminWorkers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  // Mock Data
  const workers = [
    {
      id: 'WRK001',
      name: 'Rajesh Kumar',
      email: 'rajesh.k@email.com',
      phone: '+91 98765 43210',
      avatar: 'https://i.pravatar.cc/150?img=12',
      city: 'Bangalore',
      categories: ['AC Repair', 'Electrical'],
      totalJobs: 245,
      rating: 4.9,
      earnings: '₹1,24,500',
      status: 'active',
      verified: true,
      level: 'Gold',
      joinedDate: 'Jan 2022',
      documents: { aadhaar: true, pan: true, bank: true },
    },
    {
      id: 'WRK002',
      name: 'Suresh Patel',
      email: 'suresh.p@email.com',
      phone: '+91 87654 32109',
      avatar: 'https://i.pravatar.cc/150?img=15',
      city: 'Mumbai',
      categories: ['Plumbing', 'Bathroom Fitting'],
      totalJobs: 189,
      rating: 4.8,
      earnings: '₹98,200',
      status: 'active',
      verified: true,
      level: 'Silver',
      joinedDate: 'Mar 2022',
      documents: { aadhaar: true, pan: true, bank: true },
    },
    {
      id: 'WRK003',
      name: 'Mohan Verma',
      email: 'mohan.v@email.com',
      phone: '+91 76543 21098',
      avatar: 'https://i.pravatar.cc/150?img=18',
      city: 'Delhi',
      categories: ['Home Cleaning'],
      totalJobs: 56,
      rating: 4.5,
      earnings: '₹32,100',
      status: 'pending',
      verified: false,
      level: 'Bronze',
      joinedDate: 'Oct 2024',
      documents: { aadhaar: true, pan: false, bank: true },
    },
    {
      id: 'WRK004',
      name: 'Anil Sharma',
      email: 'anil.s@email.com',
      phone: '+91 65432 10987',
      avatar: 'https://i.pravatar.cc/150?img=20',
      city: 'Hyderabad',
      categories: ['Painting', 'Waterproofing'],
      totalJobs: 312,
      rating: 4.7,
      earnings: '₹2,15,800',
      status: 'active',
      verified: true,
      level: 'Platinum',
      joinedDate: 'Jun 2021',
      documents: { aadhaar: true, pan: true, bank: true },
    },
    {
      id: 'WRK005',
      name: 'Ravi Teja',
      email: 'ravi.t@email.com',
      phone: '+91 54321 09876',
      avatar: 'https://i.pravatar.cc/150?img=22',
      city: 'Chennai',
      categories: ['Carpentry'],
      totalJobs: 0,
      rating: 0,
      earnings: '₹0',
      status: 'blocked',
      verified: false,
      level: 'New',
      joinedDate: 'Dec 2024',
      documents: { aadhaar: false, pan: false, bank: false },
    },
  ];

  const categories = ['AC Repair', 'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry'];

  const stats = [
    { label: 'Total Workers', value: '1,245', change: '+32 this month' },
    { label: 'Active Workers', value: '987', change: '79% of total' },
    { label: 'Pending Approval', value: '45', change: 'Needs review' },
    { label: 'Avg. Rating', value: '4.6', change: '↑ 0.1 this month' },
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || worker.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || worker.categories.includes(filterCategory);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      blocked: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getLevelColor = (level) => {
    const colors = {
      Platinum: 'text-purple-600 bg-purple-100',
      Gold: 'text-yellow-600 bg-yellow-100',
      Silver: 'text-gray-600 bg-gray-100',
      Bronze: 'text-orange-600 bg-orange-100',
      New: 'text-blue-600 bg-blue-100',
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workers</h1>
          <p className="text-gray-500">Manage service professionals</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border dark:border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FiDownload /> Export
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2">
            <FiPlus /> Add Worker
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
            placeholder="Search workers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {['all', 'active', 'pending', 'blocked'].map((status) => (
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

      {/* Workers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={worker.avatar} alt="" className="w-10 h-10 rounded-full" />
                        {worker.verified ? (
                          <BsShieldCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                        ) : (
                          <BsShieldExclamation className="absolute -bottom-1 -right-1 w-4 h-4 text-yellow-500 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{worker.name}</p>
                        <p className="text-xs text-gray-500">{worker.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {worker.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                          {cat}
                        </span>
                      ))}
                      {worker.categories.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                          +{worker.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{worker.totalJobs}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-900 dark:text-white">{worker.rating || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{worker.earnings}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(worker.level)}`}>
                      {worker.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(worker.status)}`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedWorker(worker); setShowWorkerModal(true); }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      {worker.status === 'pending' && (
                        <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg text-green-500">
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredWorkers.length} of {workers.length} workers</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Previous</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">1</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
            <button className="px-3 py-1 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Worker Detail Modal */}
      <AnimatePresence>
        {showWorkerModal && selectedWorker && (
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
                <h2 className="text-xl font-bold">Worker Details</h2>
                <button onClick={() => setShowWorkerModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedWorker.avatar} alt="" className="w-20 h-20 rounded-full" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedWorker.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedWorker.level)}`}>
                        {selectedWorker.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedWorker.status)}`}>
                        {selectedWorker.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Status */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Document Verification</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedWorker.documents).map(([doc, verified]) => (
                      <div key={doc} className={`p-3 rounded-lg text-center ${verified ? 'bg-green-50' : 'bg-red-50'}`}>
                        {verified ? (
                          <FiCheck className="w-5 h-5 mx-auto text-green-500 mb-1" />
                        ) : (
                          <FiAlertTriangle className="w-5 h-5 mx-auto text-red-500 mb-1" />
                        )}
                        <p className={`text-xs font-medium capitalize ${verified ? 'text-green-700' : 'text-red-700'}`}>
                          {doc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedWorker.totalJobs}</p>
                    <p className="text-xs text-gray-500">Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      <FiStar className="text-yellow-500 fill-current" /> {selectedWorker.rating}
                    </p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary-600">{selectedWorker.earnings}</p>
                    <p className="text-xs text-gray-500">Earnings</p>
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.categories.map((cat) => (
                      <span key={cat} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {selectedWorker.status === 'pending' && (
                    <>
                      <button className="flex-1 py-2 bg-green-500 text-white rounded-xl font-medium">
                        Approve
                      </button>
                      <button className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium">
                        Reject
                      </button>
                    </>
                  )}
                  {selectedWorker.status === 'active' && (
                    <>
                      <button className="flex-1 py-2 border dark:border-gray-700 rounded-xl font-medium">
                        View Jobs
                      </button>
                      <button className="flex-1 py-2 bg-primary-600 text-white rounded-xl font-medium">
                        Send Message
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

export default AdminWorkers;

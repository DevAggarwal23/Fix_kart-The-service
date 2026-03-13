import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, FiGlobe, FiBell, FiDollarSign, FiShield,
  FiUsers, FiMail, FiPhone, FiSave, FiToggleLeft, FiToggleRight,
  FiChevronRight, FiPlus, FiTrash2, FiEdit2, FiCreditCard
} from 'react-icons/fi';
import { BsGoogle, BsWhatsapp } from 'react-icons/bs';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'FixKart',
    tagline: 'AI-Powered Home Services',
    email: 'support@fixkart.com',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    workerUpdates: true,
    
    // Payment
    razorpayEnabled: true,
    upiEnabled: true,
    walletEnabled: true,
    codEnabled: false,
    razorpayKey: 'rzp_live_xxxxxxxxxxxx',
    razorpaySecret: '************************',
    
    // Commission
    platformCommission: 20,
    referralBonus: 100,
    workerReferralBonus: 200,
    
    // Service Areas
    serviceAreas: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'],
    
    // Working Hours
    startTime: '08:00',
    endTime: '22:00',
    emergencyEnabled: true,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'payments', label: 'Payments', icon: FiDollarSign },
    { id: 'commission', label: 'Commission', icon: FiUsers },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'integrations', label: 'Integrations', icon: FiGlobe },
  ];

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className="relative">
      <motion.div
        className={`w-12 h-6 rounded-full ${enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </motion.div>
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500">Configure platform settings</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2">
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && <FiChevronRight className="ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMail className="inline mr-2" /> Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiPhone className="inline mr-2" /> Support Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Address
                </label>
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full p-3 border dark:border-gray-700 rounded-lg resize-none dark:bg-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Areas
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {settings.serviceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {area}
                      <button className="text-red-500 hover:text-red-700">
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button className="text-primary-600 text-sm flex items-center gap-1">
                  <FiPlus /> Add City
                </button>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Settings</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send notifications via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send push notifications to app' },
                  { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'Alert admins on new bookings' },
                  { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Alert on payment events' },
                  { key: 'workerUpdates', label: 'Worker Updates', desc: 'Notify on worker activities' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings[item.key]}
                      onToggle={() => handleToggle(item.key)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment Settings</h2>
              
              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Payment Methods</h3>
                {[
                  { key: 'razorpayEnabled', label: 'Razorpay', icon: FiCreditCard },
                  { key: 'upiEnabled', label: 'UPI Payments' },
                  { key: 'walletEnabled', label: 'Wallet Payments' },
                  { key: 'codEnabled', label: 'Cash on Delivery' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-5 h-5 text-primary-600" />}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ToggleSwitch
                      enabled={settings[item.key]}
                      onToggle={() => handleToggle(item.key)}
                    />
                  </div>
                ))}
              </div>

              {/* Razorpay Config */}
              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Razorpay Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">API Key</label>
                    <input
                      type="text"
                      value={settings.razorpayKey}
                      onChange={(e) => handleChange('razorpayKey', e.target.value)}
                      className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">API Secret</label>
                    <input
                      type="password"
                      value={settings.razorpaySecret}
                      onChange={(e) => handleChange('razorpaySecret', e.target.value)}
                      className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Commission Settings */}
          {activeTab === 'commission' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Commission & Bonuses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    value={settings.platformCommission}
                    onChange={(e) => handleChange('platformCommission', e.target.value)}
                    className="w-full p-3 text-2xl font-bold text-center border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">Deducted from worker earnings</p>
                </div>
                
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    User Referral Bonus (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.referralBonus}
                    onChange={(e) => handleChange('referralBonus', e.target.value)}
                    className="w-full p-3 text-2xl font-bold text-center border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">Per successful referral</p>
                </div>
                
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Worker Referral Bonus (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.workerReferralBonus}
                    onChange={(e) => handleChange('workerReferralBonus', e.target.value)}
                    className="w-full p-3 text-2xl font-bold text-center border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">For new worker sign-ups</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security Settings</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin login', enabled: true },
                  { label: 'OTP Verification', desc: 'Require OTP for service completion', enabled: true },
                  { label: 'Background Verification', desc: 'Mandatory for all workers', enabled: true },
                  { label: 'Payment Security', desc: 'Enable fraud detection', enabled: true },
                  { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes', enabled: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch enabled={item.enabled} onToggle={() => {}} />
                  </div>
                ))}
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Admin Access Logs</h3>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>Last login: Today at 10:45 AM from Mumbai, India</p>
                  <p>Password changed: 15 days ago</p>
                  <button className="text-primary-600 hover:underline">View all activity</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Third-Party Integrations</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Google Maps', icon: BsGoogle, status: 'connected', desc: 'Location & navigation services' },
                  { name: 'WhatsApp Business', icon: BsWhatsapp, status: 'connected', desc: 'Customer communication' },
                  { name: 'Firebase', icon: FiGlobe, status: 'connected', desc: 'Authentication & notifications' },
                  { name: 'OpenAI', icon: FiGlobe, status: 'connected', desc: 'AI Assistant & recommendations' },
                  { name: 'MSG91', icon: FiPhone, status: 'pending', desc: 'SMS gateway' },
                  { name: 'SendGrid', icon: FiMail, status: 'disconnected', desc: 'Email delivery' },
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <integration.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{integration.name}</p>
                        <p className="text-sm text-gray-500">{integration.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        integration.status === 'connected' ? 'bg-green-100 text-green-700' :
                        integration.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {integration.status}
                      </span>
                      <button className="text-primary-600 hover:underline text-sm">
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

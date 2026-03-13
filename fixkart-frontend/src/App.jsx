import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import WorkerLayout from './components/layout/WorkerLayout';
import LoadingScreen from './components/ui/LoadingScreen';
import CitySelectionModal from './components/modals/CitySelectionModal';
import AIAssistant from './components/ai/AIAssistant';
import NotificationDropdown from './components/ui/NotificationDropdown';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ProfileSetup = lazy(() => import('./pages/auth/ProfileSetup'));

const Services = lazy(() => import('./pages/services/Services'));
const ServiceCategory = lazy(() => import('./pages/services/ServiceCategory'));
const ServiceDetail = lazy(() => import('./pages/services/ServiceDetail'));

const Booking = lazy(() => import('./pages/booking/Booking'));
const BookingConfirmation = lazy(() => import('./pages/booking/BookingConfirmation'));
const TrackBooking = lazy(() => import('./pages/booking/TrackBooking'));

const Payment = lazy(() => import('./pages/payment/Payment'));
const PaymentSuccess = lazy(() => import('./pages/payment/PaymentSuccess'));
const Invoice = lazy(() => import('./pages/payment/Invoice'));

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MyBookings = lazy(() => import('./pages/dashboard/MyBookings'));
const BookingDetails = lazy(() => import('./pages/dashboard/BookingDetails'));
const Wallet = lazy(() => import('./pages/dashboard/Wallet'));
const Addresses = lazy(() => import('./pages/dashboard/Addresses'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const HelpSupport = lazy(() => import('./pages/dashboard/HelpSupport'));

const RateService = lazy(() => import('./pages/rating/RateService'));
const Complaint = lazy(() => import('./pages/rating/Complaint'));

// Worker Portal
const WorkerDashboard = lazy(() => import('./pages/worker/WorkerDashboard'));
const WorkerJobs = lazy(() => import('./pages/worker/WorkerJobs'));
const WorkerActiveJob = lazy(() => import('./pages/worker/WorkerActiveJob'));
const WorkerEarnings = lazy(() => import('./pages/worker/WorkerEarnings'));
const WorkerRatings = lazy(() => import('./pages/worker/WorkerRatings'));
const WorkerProfile = lazy(() => import('./pages/worker/WorkerProfile'));

// Admin Panel
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminWorkers = lazy(() => import('./pages/admin/AdminWorkers'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminLiveMap = lazy(() => import('./pages/admin/AdminLiveMap'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminRatings = lazy(() => import('./pages/admin/AdminRatings'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Static Pages
const AboutUs = lazy(() => import('./pages/static/AboutUs'));
const ContactUs = lazy(() => import('./pages/static/ContactUs'));
const FAQ = lazy(() => import('./pages/static/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/static/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/static/Terms'));

const NotFound = lazy(() => import('./pages/NotFound'));
const Welcome = lazy(() => import('./pages/Welcome'));

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { isDarkMode, initTheme } = useThemeStore();
  const { showCityModal, showAIAssistant } = useAuthStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="profile-setup" element={<ProfileSetup />} />
            
            <Route path="services" element={<Services />} />
            <Route path="services/:categorySlug" element={<ServiceCategory />} />
            <Route path="services/:categorySlug/:serviceSlug" element={<ServiceDetail />} />
            
            <Route path="book" element={<Booking />} />
            <Route path="book/:step" element={<Booking />} />
            <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
            <Route path="track/:bookingId" element={<TrackBooking />} />
            
            <Route path="payment/:bookingId" element={<Payment />} />
            <Route path="payment-success/:bookingId" element={<PaymentSuccess />} />
            <Route path="invoice/:bookingId" element={<Invoice />} />
            
            {/* Protected User Routes */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="booking/:bookingId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
            <Route path="wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
            
            <Route path="rate/:bookingId" element={<ProtectedRoute><RateService /></ProtectedRoute>} />
            <Route path="complaint/:bookingId" element={<ProtectedRoute><Complaint /></ProtectedRoute>} />
            
            {/* Static Pages */}
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
          
          {/* Worker Portal Routes */}
          <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerLayout /></ProtectedRoute>}>
            <Route index element={<WorkerDashboard />} />
            <Route path="jobs" element={<WorkerJobs />} />
            <Route path="active-job/:jobId" element={<WorkerActiveJob />} />
            <Route path="earnings" element={<WorkerEarnings />} />
            <Route path="ratings" element={<WorkerRatings />} />
            <Route path="profile" element={<WorkerProfile />} />
          </Route>
          
          {/* Admin Panel Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="live-map" element={<AdminLiveMap />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="ratings" element={<AdminRatings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Welcome */}
          <Route path="welcome" element={<Welcome />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Global Modals */}
      {showCityModal && <CitySelectionModal />}
      {showAIAssistant && <AIAssistant />}
    </div>
  );
}

export default App;

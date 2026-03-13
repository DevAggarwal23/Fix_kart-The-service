/**
 * Custom Auth Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: clearAuth,
  } = useAuthStore();

  const [error, setError] = useState(null);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(({ user, userData }) => {
      if (userData) {
        setUser(userData);
      } else {
        clearAuth();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearAuth, setLoading]);

  // Login with email
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.loginWithEmail(email, password);
      setUser(userData);
      toast.success('Welcome back!');
      return userData;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  // Register with email
  const registerWithEmail = useCallback(async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.registerWithEmail(email, password, userData);
      setUser(result);
      toast.success('Account created successfully!');
      return result;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.loginWithGoogle();
      setUser(userData);
      toast.success('Welcome!');
      return userData;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  // Send OTP
  const sendOTP = useCallback(async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      await authService.sendOTP(phoneNumber);
      toast.success('OTP sent successfully!');
      return true;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Verify OTP
  const verifyOTP = useCallback(async (otp) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.verifyOTP(otp);
      if (!result.isNewUser) {
        setUser(result.userData);
        toast.success('Welcome back!');
      }
      return result;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  // Update profile
  const updateProfile = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.updateUserProfile(user.id, data);
      setUser(userData);
      toast.success('Profile updated!');
      return userData;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, setUser, setLoading]);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(email);
      toast.success('Password reset email sent!');
      return true;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      clearAuth();
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [clearAuth]);

  // Setup recaptcha
  const setupRecaptcha = useCallback((containerId) => {
    return authService.setupRecaptcha(containerId);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendOTP,
    verifyOTP,
    updateProfile,
    resetPassword,
    logout,
    setupRecaptcha,
    clearError: () => setError(null),
  };
};

// Helper function to get user-friendly error messages
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'This operation is not allowed',
    'auth/weak-password': 'Password is too weak',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-verification-code': 'Invalid OTP code',
    'auth/code-expired': 'OTP has expired',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/popup-closed-by-user': 'Sign in was cancelled',
  };

  return messages[code] || 'An error occurred. Please try again';
}

export default useAuth;

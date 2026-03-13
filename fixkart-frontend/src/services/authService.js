/**
 * Authentication Service
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  RecaptchaVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import api, { endpoints } from './api';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Email/Password Login
  async loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return this.getUserData(result.user.uid);
  },

  // Email/Password Register
  async registerWithEmail(email, password, userData) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(result.user, {
      displayName: userData.name,
    });
    
    // Create user document in Firestore
    await this.createUserDocument(result.user.uid, {
      ...userData,
      email,
      role: 'customer',
    });
    
    // Register with backend
    await api.post(endpoints.auth.register, {
      name: userData.name,
      email,
      phone: userData.phone,
    });
    
    return this.getUserData(result.user.uid);
  },

  // Google Sign In
  async loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      await this.createUserDocument(result.user.uid, {
        name: result.user.displayName,
        email: result.user.email,
        profileImage: result.user.photoURL,
        role: 'customer',
      });
    }
    
    return this.getUserData(result.user.uid);
  },

  // Phone OTP Login
  setupRecaptcha(containerId) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    });
    return window.recaptchaVerifier;
  },

  async sendOTP(phoneNumber) {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  },

  async verifyOTP(otp) {
    const result = await window.confirmationResult.confirm(otp);
    
    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // New user - needs profile setup
      return { user: result.user, isNewUser: true };
    }
    
    return { user: result.user, isNewUser: false, userData: userDoc.data() };
  },

  // Create user document
  async createUserDocument(uid, userData) {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      isVerified: false,
      isActive: true,
      wallet: { balance: 0 },
      addresses: [],
      favorites: [],
      totalBookings: 0,
      totalSpent: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Get user data
  async getUserData(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: uid, ...userDoc.data() };
    }
    return null;
  },

  // Update profile
  async updateUserProfile(uid, data) {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return this.getUserData(uid);
  },

  // Password reset
  async resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  },

  // Sign out
  async logout() {
    await signOut(auth);
  },

  // Auth state listener
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await this.getUserData(user.uid);
        callback({ user, userData });
      } else {
        callback({ user: null, userData: null });
      }
    });
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Get ID token
  async getIdToken() {
    const user = auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return null;
  },
};

export default authService;

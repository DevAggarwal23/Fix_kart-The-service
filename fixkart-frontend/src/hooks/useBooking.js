/**
 * Custom Booking Hook
 */
import { useState, useCallback } from 'react';
import { useBookingStore } from '../store/bookingStore';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';

export const useBooking = () => {
  const {
    currentBooking,
    bookings,
    activeBookings,
    setCurrentBooking,
    setBookings,
    setActiveBookings,
    updateBookingStatus,
    clearCurrentBooking,
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create booking
  const createBooking = useCallback(async (bookingData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await bookingService.create(bookingData);
      setCurrentBooking(result.booking);
      toast.success('Booking created successfully!');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentBooking]);

  // Fetch user's bookings
  const fetchBookings = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await bookingService.getMyBookings(filters);
      setBookings(result.bookings);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setBookings]);

  // Fetch booking details
  const fetchBookingById = useCallback(async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.getBookingById(bookingId);
      setCurrentBooking(booking);
      return booking;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentBooking]);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId, reason) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await bookingService.cancelBooking(bookingId, reason);
      updateBookingStatus(bookingId, 'cancelled');
      toast.success('Booking cancelled successfully');
      return result;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateBookingStatus]);

  // Track booking
  const trackBooking = useCallback(async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await bookingService.trackBooking(bookingId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get invoice
  const getInvoice = useCallback(async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await bookingService.getInvoice(bookingId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch active bookings
  const fetchActiveBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await bookingService.getActive();
      setActiveBookings(result.bookings);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setActiveBookings]);

  // Subscribe to booking updates
  const subscribeToBooking = useCallback((bookingId, callback) => {
    return bookingService.subscribeToBooking(bookingId, (booking) => {
      setCurrentBooking(booking);
      callback?.(booking);
    });
  }, [setCurrentBooking]);

  // Subscribe to worker location
  const subscribeToWorkerLocation = useCallback((workerId, callback) => {
    return bookingService.subscribeToWorkerLocation(workerId, callback);
  }, []);

  // Calculate price
  const calculatePrice = useCallback((service, options) => {
    return bookingService.calculatePrice(service, options);
  }, []);

  // Get time slots
  const getTimeSlots = useCallback((date) => {
    return bookingService.getTimeSlots(date);
  }, []);

  return {
    currentBooking,
    bookings,
    activeBookings,
    isLoading,
    error,
    createBooking,
    fetchBookings,
    fetchBookingById,
    cancelBooking,
    trackBooking,
    getInvoice,
    fetchActiveBookings,
    subscribeToBooking,
    subscribeToWorkerLocation,
    calculatePrice,
    getTimeSlots,
    clearCurrentBooking,
    clearError: () => setError(null),
  };
};

export default useBooking;

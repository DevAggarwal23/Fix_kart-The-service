/**
 * Custom Services Hook
 */
import { useState, useCallback, useEffect } from 'react';
import serviceService from '../services/serviceService';

export const useServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await serviceService.getCategories();
      setCategories(result.categories || result);
      return result;
    } catch (err) {
      // Fallback to local Firestore
      try {
        const localCategories = await serviceService.getCategoriesLocal();
        setCategories(localCategories);
        return localCategories;
      } catch (localErr) {
        setError(err.message);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch services
  const fetchServices = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await serviceService.getServices(filters);
      setServices(result.services || result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch services by category
  const fetchServicesByCategory = useCallback(async (categorySlug) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await serviceService.getServicesByCategory(categorySlug);
      setServices(result.services || result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch service by ID
  const fetchServiceById = useCallback(async (serviceId) => {
    try {
      setIsLoading(true);
      setError(null);
      const service = await serviceService.getServiceById(serviceId);
      setCurrentService(service);
      return service;
    } catch (err) {
      // Fallback to local
      try {
        const localService = await serviceService.getServiceLocal(serviceId);
        setCurrentService(localService);
        return localService;
      } catch (localErr) {
        setError(err.message);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch popular services
  const fetchPopularServices = useCallback(async (limit = 8) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await serviceService.getPopularServices(limit);
      return result.services || result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search services
  const searchServices = useCallback(async (query, filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await serviceService.searchServices(query, filters);
      setServices(result.services || result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get service reviews
  const fetchServiceReviews = useCallback(async (serviceId, page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      return await serviceService.getServiceReviews(serviceId, page, limit);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    services,
    currentService,
    isLoading,
    error,
    fetchCategories,
    fetchServices,
    fetchServicesByCategory,
    fetchServiceById,
    fetchPopularServices,
    searchServices,
    fetchServiceReviews,
    setCurrentService,
    clearError: () => setError(null),
  };
};

export default useServices;

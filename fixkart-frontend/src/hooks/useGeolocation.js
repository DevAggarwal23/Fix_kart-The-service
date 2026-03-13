/**
 * Geolocation Hook
 */
import { useState, useCallback, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    ...options,
  };

  // Get current position
  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation is not supported');
        setError(err.message);
        reject(err);
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(coords);
          setIsLoading(false);
          resolve(coords);
        },
        (err) => {
          const message = getGeolocationErrorMessage(err.code);
          setError(message);
          setIsLoading(false);
          reject(new Error(message));
        },
        defaultOptions
      );
    });
  }, []);

  // Watch position
  const watchPosition = useCallback((callback) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(coords);
        callback?.(coords);
      },
      (err) => {
        setError(getGeolocationErrorMessage(err.code));
      },
      defaultOptions
    );

    return watchId;
  }, []);

  // Clear watch
  const clearWatch = useCallback((watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Reverse geocode (get address from coordinates)
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return parseGoogleAddress(data.results[0]);
      }
      return null;
    } catch (err) {
      console.error('Reverse geocode error:', err);
      return null;
    }
  }, []);

  // Geocode (get coordinates from address)
  const geocode = useCallback(async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          ...parseGoogleAddress(result),
        };
      }
      return null;
    } catch (err) {
      console.error('Geocode error:', err);
      return null;
    }
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(point1.lat)) *
        Math.cos(toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  return {
    location,
    error,
    isLoading,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    reverseGeocode,
    geocode,
    calculateDistance,
    clearError: () => setError(null),
  };
};

// Helper functions
function getGeolocationErrorMessage(code) {
  switch (code) {
    case 1:
      return 'Location access denied. Please enable location permissions.';
    case 2:
      return 'Unable to determine location. Please try again.';
    case 3:
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred.';
  }
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function parseGoogleAddress(result) {
  const address = {
    formattedAddress: result.formatted_address,
    streetNumber: '',
    route: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  };

  result.address_components.forEach((component) => {
    const types = component.types;
    if (types.includes('street_number')) {
      address.streetNumber = component.long_name;
    } else if (types.includes('route')) {
      address.route = component.long_name;
    } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
      address.area = component.long_name;
    } else if (types.includes('locality')) {
      address.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      address.state = component.long_name;
    } else if (types.includes('country')) {
      address.country = component.long_name;
    } else if (types.includes('postal_code')) {
      address.pincode = component.long_name;
    }
  });

  return address;
}

export default useGeolocation;

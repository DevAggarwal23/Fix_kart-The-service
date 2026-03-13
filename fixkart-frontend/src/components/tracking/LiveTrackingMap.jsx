/**
 * LiveTrackingMap Component
 * Real-time map tracking with worker movement, ETA, and route display
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPhone, FiMessageSquare, FiNavigation, FiClock, FiMapPin,
  FiX, FiSend, FiChevronUp, FiChevronDown
} from 'react-icons/fi';
import { 
  subscribeToWorkerLocation, 
  subscribeToBookingStatus,
  subscribeToETA,
  subscribeToChatMessages,
  sendChatMessage,
  BOOKING_STATUS_STEPS
} from '../../services/trackingService';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] }
  ]
};

const libraries = ['places', 'geometry'];

const LiveTrackingMap = ({ 
  bookingId,
  worker,
  userLocation,
  onClose,
  showChat = true
}) => {
  const [workerLocation, setWorkerLocation] = useState(null);
  const [status, setStatus] = useState({ current: 'confirmed' });
  const [eta, setEta] = useState({ minutes: 15, distance: '3 km' });
  const [routePath, setRoutePath] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(true);
  
  const mapRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Default user location
  const defaultUserLocation = userLocation || { lat: 28.6139, lng: 77.2090 };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!bookingId) return;

    // Worker location updates
    const unsubLocation = subscribeToWorkerLocation(bookingId, (location) => {
      setWorkerLocation(location);
      
      // Update route path
      setRoutePath(prev => {
        const newPath = [...prev, { lat: location.lat, lng: location.lng }];
        // Keep only last 50 points for performance
        return newPath.slice(-50);
      });
    });

    // Status updates
    const unsubStatus = subscribeToBookingStatus(bookingId, setStatus);

    // ETA updates
    const unsubEta = subscribeToETA(bookingId, setEta);

    // Chat messages
    const unsubChat = subscribeToChatMessages(bookingId, setMessages);

    return () => {
      unsubLocation();
      unsubStatus();
      unsubEta();
      unsubChat();
    };
  }, [bookingId]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Center map on worker and user
  useEffect(() => {
    if (mapRef.current && workerLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(workerLocation.lat, workerLocation.lng));
      bounds.extend(new window.google.maps.LatLng(defaultUserLocation.lat, defaultUserLocation.lng));
      mapRef.current.fitBounds(bounds, { padding: 80 });
    }
  }, [workerLocation, defaultUserLocation]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendChatMessage(bookingId, {
      text: newMessage,
      sender: 'user',
      senderName: 'You'
    });

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: Date.now()
    }]);

    setNewMessage('');
  };

  // Get current status step index
  const currentStepIndex = BOOKING_STATUS_STEPS.findIndex(s => s.id === status.current);

  // Call worker
  const handleCallWorker = () => {
    if (worker?.phone) {
      window.location.href = `tel:${worker.phone}`;
    }
  };

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-500">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={workerLocation || defaultUserLocation}
        zoom={14}
        options={mapOptions}
        onLoad={(map) => { mapRef.current = map; }}
      >
        {/* User Location Marker */}
        <Marker
          position={defaultUserLocation}
          icon={{
            url: 'data:image/svg+xml,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
                <circle cx="20" cy="20" r="6" fill="white"/>
              </svg>
            `),
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 20, y: 20 }
          }}
        />

        {/* Worker Location Marker */}
        {workerLocation && (
          <Marker
            position={{ lat: workerLocation.lat, lng: workerLocation.lng }}
            icon={{
              url: worker?.avatar || 'data:image/svg+xml,' + encodeURIComponent(`
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="22" fill="#3B82F6" stroke="white" stroke-width="4"/>
                  <text x="25" y="32" text-anchor="middle" fill="white" font-size="20">🚗</text>
                </svg>
              `),
              scaledSize: { width: 50, height: 50 },
              anchor: { x: 25, y: 25 }
            }}
          />
        )}

        {/* Route Path */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeWeight: 4
            }}
          />
        )}
      </GoogleMap>

      {/* Top Header - ETA Card */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={worker?.avatar || 'https://i.pravatar.cc/100'} 
                alt={worker?.name}
                className="w-14 h-14 rounded-full border-2 border-primary-500"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{worker?.name || 'Professional'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status.current === 'on_the_way' ? 'On the way' : BOOKING_STATUS_STEPS.find(s => s.id === status.current)?.title}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
              <FiClock className="w-5 h-5" />
              <span className="text-2xl font-bold">{eta.minutes}</span>
              <span className="text-sm">min</span>
            </div>
            <p className="text-sm text-gray-500">{eta.distance} away</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCallWorker}
            className="flex-1 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <FiPhone className="w-4 h-4" />
            Call
          </button>
          <button
            onClick={() => setShowChatPanel(true)}
            className="flex-1 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <FiMessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => {/* Open navigation */}}
            className="flex-1 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <FiNavigation className="w-4 h-4" />
            Navigate
          </button>
        </div>
      </motion.div>

      {/* Status Steps Panel */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl"
      >
        <div 
          className="flex items-center justify-center py-2 cursor-pointer"
          onClick={() => setShowStatusPanel(!showStatusPanel)}
        >
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <AnimatePresence>
          {showStatusPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-6 overflow-hidden"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tracking Status</h3>
              
              <div className="space-y-3">
                {BOOKING_STATUS_STEPS.slice(0, 4).map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500' 
                          : isCurrent 
                            ? 'bg-primary-500 animate-pulse' 
                            : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <span className="text-lg">{step.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCompleted || isCurrent 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      {isCompleted && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChatPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute inset-0 bg-white dark:bg-gray-800 z-20 flex flex-col"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <img 
                  src={worker?.avatar || 'https://i.pravatar.cc/100'} 
                  alt={worker?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{worker?.name || 'Professional'}</p>
                  <p className="text-sm text-green-500">Online</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatPanel(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-primary-100' : 'text-gray-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary-500 text-white rounded-full disabled:opacity-50"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTrackingMap;

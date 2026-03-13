import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      selectedCity: null,
      showCityModal: false,
      showAIAssistant: false,
      notifications: [],
      unreadCount: 0,
      
      // Auth Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call - Replace with Firebase auth
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const mockUser = {
            id: 'user_123',
            name: credentials.name || 'John Doe',
            email: credentials.email,
            phone: credentials.phone || '+91 9876543210',
            role: 'user',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            addresses: [],
            wallet: { balance: 500 },
          };
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call - Replace with Firebase auth
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const mockUser = {
            id: 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: 'user',
            avatar: null,
            addresses: [],
            wallet: { balance: 0 },
          };
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          notifications: [],
          unreadCount: 0 
        });
      },

      // Set user directly (for Firebase auth)
      setUser: (userData) => {
        set({ 
          user: userData, 
          isAuthenticated: !!userData,
          isLoading: false 
        });
      },
      
      updateProfile: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates }
        }));
      },
      
      // City Selection
      setSelectedCity: (city) => {
        set({ selectedCity: city, showCityModal: false });
      },
      
      toggleCityModal: () => {
        set((state) => ({ showCityModal: !state.showCityModal }));
      },
      
      // AI Assistant
      toggleAIAssistant: () => {
        set((state) => ({ showAIAssistant: !state.showAIAssistant }));
      },
      
      closeAIAssistant: () => {
        set({ showAIAssistant: false });
      },
      
      // Notifications
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },
      
      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },
      
      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      },
      
      // Address Management
      addAddress: (address) => {
        set((state) => ({
          user: {
            ...state.user,
            addresses: [...(state.user?.addresses || []), { ...address, id: Date.now() }]
          }
        }));
      },
      
      removeAddress: (addressId) => {
        set((state) => ({
          user: {
            ...state.user,
            addresses: state.user?.addresses?.filter(a => a.id !== addressId) || []
          }
        }));
      },
      
      setDefaultAddress: (addressId) => {
        set((state) => ({
          user: {
            ...state.user,
            addresses: state.user?.addresses?.map(a => ({
              ...a,
              isDefault: a.id === addressId
            })) || []
          }
        }));
      },
    }),
    {
      name: 'fixkart-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        selectedCity: state.selectedCity 
      }),
    }
  )
);

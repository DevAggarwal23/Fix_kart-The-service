import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
  // Booking State
  currentBooking: null,
  bookingStep: 1,
  totalSteps: 5,
  
  // Problem Description
  problemDescription: '',
  problemImages: [],
  selectedCategory: null,
  selectedSubCategory: null,
  urgencyLevel: 'normal', // low, normal, high, emergency
  
  // Booking Mode
  bookingMode: null, // instant, bidding, direct
  
  // Address & Schedule
  selectedAddress: null,
  selectedDate: null,
  selectedTime: null,
  
  // Worker Selection
  availableWorkers: [],
  selectedWorker: null,
  workerBids: [],
  
  // AI Analysis
  aiAnalysis: null,
  priceEstimate: null,
  
  // Timer for bidding
  biddingTimer: 0,
  biddingTimerActive: false,
  
  // Actions
  setStep: (step) => set({ bookingStep: step }),
  
  nextStep: () => set((state) => ({ 
    bookingStep: Math.min(state.bookingStep + 1, state.totalSteps) 
  })),
  
  prevStep: () => set((state) => ({ 
    bookingStep: Math.max(state.bookingStep - 1, 1) 
  })),
  
  setProblemDescription: (description) => set({ problemDescription: description }),
  
  addProblemImage: (image) => set((state) => ({
    problemImages: [...state.problemImages, image]
  })),
  
  removeProblemImage: (index) => set((state) => ({
    problemImages: state.problemImages.filter((_, i) => i !== index)
  })),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSelectedSubCategory: (subCategory) => set({ selectedSubCategory: subCategory }),
  
  setUrgencyLevel: (level) => set({ urgencyLevel: level }),
  
  setBookingMode: (mode) => set({ bookingMode: mode }),
  
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  
  setSchedule: (date, time) => set({ selectedDate: date, selectedTime: time }),
  
  setAvailableWorkers: (workers) => set({ availableWorkers: workers }),
  
  setSelectedWorker: (worker) => set({ selectedWorker: worker }),
  
  addWorkerBid: (bid) => set((state) => ({
    workerBids: [...state.workerBids, bid]
  })),
  
  setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  
  setPriceEstimate: (estimate) => set({ priceEstimate: estimate }),
  
  // Bidding Timer
  startBiddingTimer: (seconds = 300) => {
    set({ biddingTimer: seconds, biddingTimerActive: true });
    
    const interval = setInterval(() => {
      const current = get().biddingTimer;
      if (current <= 0) {
        clearInterval(interval);
        set({ biddingTimerActive: false });
      } else {
        set({ biddingTimer: current - 1 });
      }
    }, 1000);
    
    return interval;
  },
  
  stopBiddingTimer: () => set({ biddingTimerActive: false }),
  
  // Create Booking
  createBooking: async () => {
    const state = get();
    
    const booking = {
      id: 'BKG' + Date.now(),
      problemDescription: state.problemDescription,
      problemImages: state.problemImages,
      category: state.selectedCategory,
      subCategory: state.selectedSubCategory,
      urgencyLevel: state.urgencyLevel,
      bookingMode: state.bookingMode,
      address: state.selectedAddress,
      scheduledDate: state.selectedDate,
      scheduledTime: state.selectedTime,
      worker: state.selectedWorker,
      priceEstimate: state.priceEstimate,
      aiAnalysis: state.aiAnalysis,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    set({ currentBooking: booking });
    return booking;
  },
  
  // Reset Booking
  resetBooking: () => set({
    currentBooking: null,
    bookingStep: 1,
    problemDescription: '',
    problemImages: [],
    selectedCategory: null,
    selectedSubCategory: null,
    urgencyLevel: 'normal',
    bookingMode: null,
    selectedAddress: null,
    selectedDate: null,
    selectedTime: null,
    availableWorkers: [],
    selectedWorker: null,
    workerBids: [],
    aiAnalysis: null,
    priceEstimate: null,
    biddingTimer: 0,
    biddingTimerActive: false,
  }),
}));

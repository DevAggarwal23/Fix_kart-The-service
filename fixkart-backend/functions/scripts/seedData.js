/**
 * Seed Data Script for FixKart
 * Populates Firestore with initial data for development/testing
 * 
 * Usage: node seedData.js
 * Make sure to set GOOGLE_APPLICATION_CREDENTIALS environment variable
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
// For local development, use service account key
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });
} else {
  // For Firebase emulator
  admin.initializeApp({
    projectId: 'fixkart-demo',
  });
}

const db = admin.firestore();
const auth = admin.auth();

// ============================================
// SEED DATA
// ============================================

const categories = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Professional home cleaning services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/cleaning.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/home-cleaning.jpg',
    color: '#10B981',
    isActive: true,
    displayOrder: 1,
    servicesCount: 8,
    popularTags: ['deep cleaning', 'sanitization', 'bathroom cleaning'],
  },
  {
    id: 'electrical',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Electrical repair and installation services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/electrical.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/electrical.jpg',
    color: '#F59E0B',
    isActive: true,
    displayOrder: 2,
    servicesCount: 12,
    popularTags: ['wiring', 'fan installation', 'switch repair'],
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Plumbing repair and installation services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/plumbing.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/plumbing.jpg',
    color: '#3B82F6',
    isActive: true,
    displayOrder: 3,
    servicesCount: 10,
    popularTags: ['tap repair', 'leakage', 'drain cleaning'],
  },
  {
    id: 'ac-appliance',
    name: 'AC & Appliance',
    slug: 'ac-appliance',
    description: 'AC service, repair and appliance maintenance',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/ac.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/ac-appliance.jpg',
    color: '#6366F1',
    isActive: true,
    displayOrder: 4,
    servicesCount: 15,
    popularTags: ['AC repair', 'deep cleaning', 'gas refill'],
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Furniture repair and carpentry services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/carpentry.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/carpentry.jpg',
    color: '#78350F',
    isActive: true,
    displayOrder: 5,
    servicesCount: 8,
    popularTags: ['furniture repair', 'door fix', 'assembly'],
  },
  {
    id: 'painting',
    name: 'Painting',
    slug: 'painting',
    description: 'Interior and exterior painting services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/painting.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/painting.jpg',
    color: '#EC4899',
    isActive: true,
    displayOrder: 6,
    servicesCount: 6,
    popularTags: ['wall painting', 'texture', 'waterproofing'],
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    slug: 'pest-control',
    description: 'Pest control and fumigation services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/pest.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/pest-control.jpg',
    color: '#059669',
    isActive: true,
    displayOrder: 7,
    servicesCount: 7,
    popularTags: ['cockroach', 'termite', 'bed bugs'],
  },
  {
    id: 'salon-spa',
    name: 'Salon & Spa',
    slug: 'salon-spa',
    description: 'At-home beauty and wellness services',
    icon: 'https://storage.googleapis.com/fixkart-assets/icons/salon.png',
    image: 'https://storage.googleapis.com/fixkart-assets/categories/salon-spa.jpg',
    color: '#DB2777',
    isActive: true,
    displayOrder: 8,
    servicesCount: 20,
    popularTags: ['haircut', 'facial', 'massage'],
  },
];

const services = [
  // Home Cleaning Services
  {
    id: 'full-home-cleaning',
    categoryId: 'home-cleaning',
    name: 'Full Home Deep Cleaning',
    slug: 'full-home-cleaning',
    shortDescription: 'Complete home deep cleaning with sanitization',
    description: 'Comprehensive deep cleaning service covering all rooms, bathrooms, kitchen, and common areas. Includes dusting, mopping, sanitization, and detailed cleaning of fixtures.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/full-home-cleaning-1.jpg'],
    basePrice: 2999,
    discountedPrice: 2499,
    priceUnit: 'per 2BHK',
    duration: 240,
    rating: 4.7,
    totalReviews: 2847,
    bookingsCount: 15420,
    included: ['All rooms cleaning', 'Bathroom deep clean', 'Kitchen cleaning', 'Floor mopping', 'Dusting all surfaces', 'Sanitization'],
    excluded: ['Balcony cleaning', 'Terrace cleaning', 'Heavy lifting'],
    requirements: ['Running water supply', 'Electricity', 'Cleaning materials provided by us'],
    faqs: [
      { question: 'How long does it take?', answer: 'Around 4 hours for a 2BHK apartment' },
      { question: 'Do I need to provide materials?', answer: 'No, we bring all cleaning supplies' },
    ],
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['deep cleaning', 'sanitization', 'home', 'popular'],
  },
  {
    id: 'bathroom-cleaning',
    categoryId: 'home-cleaning',
    name: 'Bathroom Deep Cleaning',
    slug: 'bathroom-cleaning',
    shortDescription: 'Thorough bathroom cleaning and sanitization',
    description: 'Professional bathroom cleaning including tiles, fixtures, toilet, shower area, and complete sanitization.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/bathroom-cleaning-1.jpg'],
    basePrice: 699,
    discountedPrice: 499,
    priceUnit: 'per bathroom',
    duration: 60,
    rating: 4.6,
    totalReviews: 1523,
    bookingsCount: 8920,
    included: ['Toilet cleaning', 'Tile scrubbing', 'Mirror cleaning', 'Fixture polishing', 'Floor cleaning', 'Sanitization'],
    excluded: ['Tile replacement', 'Plumbing repairs'],
    requirements: ['Running water supply'],
    isActive: true,
    isFeatured: false,
    isPopular: true,
    tags: ['bathroom', 'sanitization', 'deep cleaning'],
  },
  {
    id: 'kitchen-cleaning',
    categoryId: 'home-cleaning',
    name: 'Kitchen Deep Cleaning',
    slug: 'kitchen-cleaning',
    shortDescription: 'Complete kitchen cleaning with degreasing',
    description: 'Professional kitchen cleaning including counters, appliances exterior, cabinets, chimney exterior, and floor.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/kitchen-cleaning-1.jpg'],
    basePrice: 1299,
    discountedPrice: 999,
    priceUnit: 'per kitchen',
    duration: 90,
    rating: 4.5,
    totalReviews: 984,
    bookingsCount: 5640,
    included: ['Counter cleaning', 'Cabinet exterior', 'Appliance exterior', 'Floor cleaning', 'Sink cleaning', 'Degreasing'],
    excluded: ['Appliance interior', 'Cabinet interior'],
    requirements: ['Empty sink'],
    isActive: true,
    isFeatured: false,
    isPopular: false,
    tags: ['kitchen', 'degreasing', 'deep cleaning'],
  },

  // Electrical Services
  {
    id: 'fan-installation',
    categoryId: 'electrical',
    name: 'Ceiling Fan Installation',
    slug: 'fan-installation',
    shortDescription: 'Professional ceiling fan installation',
    description: 'Expert ceiling fan installation service. Includes mounting, wiring connection, and testing. Fan not included.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/fan-installation-1.jpg'],
    basePrice: 349,
    discountedPrice: 299,
    priceUnit: 'per fan',
    duration: 45,
    rating: 4.8,
    totalReviews: 3241,
    bookingsCount: 18750,
    included: ['Fan mounting', 'Wiring connection', 'Speed regulator', 'Testing', 'Old fan removal'],
    excluded: ['Fan purchase', 'New wiring', 'Electrical repairs'],
    requirements: ['Pre-existing wiring', 'Fan hook installed'],
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['fan', 'installation', 'electrical', 'popular'],
  },
  {
    id: 'switchboard-repair',
    categoryId: 'electrical',
    name: 'Switchboard Repair',
    slug: 'switchboard-repair',
    shortDescription: 'Switch and socket repair/replacement',
    description: 'Repair or replacement of switches, sockets, and switchboard components. Includes inspection and testing.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/switchboard-1.jpg'],
    basePrice: 199,
    discountedPrice: 149,
    priceUnit: 'per visit',
    duration: 30,
    rating: 4.6,
    totalReviews: 1876,
    bookingsCount: 10230,
    included: ['Inspection', 'Minor repairs', 'Testing', 'Safety check'],
    excluded: ['New switchboard', 'Major rewiring', 'Parts cost extra'],
    requirements: ['Access to main switch'],
    isActive: true,
    isFeatured: false,
    isPopular: true,
    tags: ['switch', 'socket', 'repair', 'electrical'],
  },
  {
    id: 'wiring-repair',
    categoryId: 'electrical',
    name: 'Wiring & MCB Repair',
    slug: 'wiring-repair',
    shortDescription: 'Electrical wiring and MCB issues',
    description: 'Diagnose and repair electrical wiring issues, MCB trips, and circuit problems. Professional troubleshooting included.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/wiring-1.jpg'],
    basePrice: 299,
    discountedPrice: 249,
    priceUnit: 'per visit',
    duration: 60,
    rating: 4.7,
    totalReviews: 1432,
    bookingsCount: 7890,
    included: ['Diagnosis', 'Minor wiring fix', 'MCB reset', 'Testing', 'Safety check'],
    excluded: ['Major rewiring', 'New MCB', 'DB box replacement'],
    requirements: ['Access to DB box'],
    isActive: true,
    isFeatured: false,
    isPopular: false,
    tags: ['wiring', 'mcb', 'electrical', 'repair'],
  },

  // Plumbing Services
  {
    id: 'tap-repair',
    categoryId: 'plumbing',
    name: 'Tap Repair/Replacement',
    slug: 'tap-repair',
    shortDescription: 'Leaking tap repair or new tap installation',
    description: 'Fix leaking taps or install new taps in bathroom/kitchen. Includes washer replacement and minor adjustments.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/tap-repair-1.jpg'],
    basePrice: 199,
    discountedPrice: 149,
    priceUnit: 'per tap',
    duration: 30,
    rating: 4.5,
    totalReviews: 2156,
    bookingsCount: 12340,
    included: ['Tap inspection', 'Washer replacement', 'Leak fixing', 'Testing'],
    excluded: ['New tap cost', 'Major pipe work', 'Wall work'],
    requirements: ['Water shut-off access'],
    isActive: true,
    isFeatured: false,
    isPopular: true,
    tags: ['tap', 'leak', 'plumbing', 'repair'],
  },
  {
    id: 'drain-cleaning',
    categoryId: 'plumbing',
    name: 'Drain Cleaning',
    slug: 'drain-cleaning',
    shortDescription: 'Blocked drain and pipe cleaning',
    description: 'Professional drain cleaning for blocked sinks, floor drains, and pipes. Includes manual and chemical cleaning.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/drain-1.jpg'],
    basePrice: 399,
    discountedPrice: 349,
    priceUnit: 'per drain',
    duration: 45,
    rating: 4.4,
    totalReviews: 1342,
    bookingsCount: 7650,
    included: ['Drain inspection', 'Manual cleaning', 'Chemical treatment', 'Testing'],
    excluded: ['Pipe replacement', 'Underground work', 'Septic tank'],
    requirements: ['Access to drain'],
    isActive: true,
    isFeatured: false,
    isPopular: false,
    tags: ['drain', 'blocked', 'cleaning', 'plumbing'],
  },

  // AC & Appliance Services
  {
    id: 'split-ac-service',
    categoryId: 'ac-appliance',
    name: 'Split AC Service',
    slug: 'split-ac-service',
    shortDescription: 'Complete split AC servicing',
    description: 'Professional split AC service including filter cleaning, coil cleaning, gas check, and performance optimization.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/ac-service-1.jpg'],
    basePrice: 599,
    discountedPrice: 449,
    priceUnit: 'per AC',
    duration: 60,
    rating: 4.6,
    totalReviews: 4521,
    bookingsCount: 28430,
    included: ['Filter cleaning', 'Indoor unit cleaning', 'Gas pressure check', 'Basic check-up', 'Performance test'],
    excluded: ['Gas refill', 'Part replacement', 'Deep cleaning'],
    requirements: ['Power supply', 'AC accessible'],
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['ac', 'split ac', 'service', 'cleaning', 'popular'],
  },
  {
    id: 'ac-deep-cleaning',
    categoryId: 'ac-appliance',
    name: 'AC Deep Cleaning',
    slug: 'ac-deep-cleaning',
    shortDescription: 'Foam-jet deep cleaning for AC',
    description: 'Comprehensive AC deep cleaning using foam-jet technology. Removes dust, bacteria, and improves cooling efficiency.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/ac-deep-clean-1.jpg'],
    basePrice: 999,
    discountedPrice: 799,
    priceUnit: 'per AC',
    duration: 90,
    rating: 4.8,
    totalReviews: 2876,
    bookingsCount: 15670,
    included: ['Foam-jet cleaning', 'Filter deep clean', 'Coil cleaning', 'Drain clean', 'Sanitization', 'Efficiency check'],
    excluded: ['Gas refill', 'Part replacement', 'Outdoor unit'],
    requirements: ['Power supply', 'AC accessible', 'Drainage area'],
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['ac', 'deep cleaning', 'foam jet', 'premium'],
  },
  {
    id: 'ac-gas-refill',
    categoryId: 'ac-appliance',
    name: 'AC Gas Refill',
    slug: 'ac-gas-refill',
    shortDescription: 'AC refrigerant gas top-up',
    description: 'Professional AC gas refilling service. Includes leak check, gas top-up, and performance testing.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/ac-gas-1.jpg'],
    basePrice: 2499,
    discountedPrice: 1999,
    priceUnit: 'per AC',
    duration: 60,
    rating: 4.5,
    totalReviews: 1654,
    bookingsCount: 8920,
    included: ['Leak detection', 'Gas refill', 'Pressure check', 'Performance test', '30-day warranty'],
    excluded: ['Leak repair', 'Part replacement', 'Compressor issues'],
    requirements: ['Power supply', 'Outdoor unit accessible'],
    isActive: true,
    isFeatured: false,
    isPopular: true,
    tags: ['ac', 'gas refill', 'refrigerant'],
  },

  // Salon & Spa Services
  {
    id: 'mens-haircut',
    categoryId: 'salon-spa',
    name: "Men's Haircut at Home",
    slug: 'mens-haircut',
    shortDescription: 'Professional haircut at your doorstep',
    description: "Expert men's haircut service at home. Includes consultation, cut, styling, and cleanup.",
    images: ['https://storage.googleapis.com/fixkart-assets/services/mens-haircut-1.jpg'],
    basePrice: 349,
    discountedPrice: 249,
    priceUnit: 'per person',
    duration: 30,
    rating: 4.7,
    totalReviews: 5632,
    bookingsCount: 32100,
    included: ['Consultation', 'Haircut', 'Styling', 'Hair wash', 'Hot towel'],
    excluded: ['Hair color', 'Treatment', 'Products'],
    requirements: ['Well-lit area', 'Chair'],
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['haircut', 'men', 'grooming', 'popular'],
  },
  {
    id: 'facial-cleanup',
    categoryId: 'salon-spa',
    name: 'Facial & Cleanup',
    slug: 'facial-cleanup',
    shortDescription: 'Refreshing facial treatment',
    description: 'Professional facial service with cleansing, exfoliation, massage, and mask for glowing skin.',
    images: ['https://storage.googleapis.com/fixkart-assets/services/facial-1.jpg'],
    basePrice: 799,
    discountedPrice: 599,
    priceUnit: 'per session',
    duration: 45,
    rating: 4.6,
    totalReviews: 3421,
    bookingsCount: 18760,
    included: ['Cleansing', 'Exfoliation', 'Face massage', 'Face pack', 'Moisturization'],
    excluded: ['Advanced treatments', 'Premium products extra'],
    requirements: ['Clean face', 'Comfortable seating'],
    isActive: true,
    isFeatured: false,
    isPopular: true,
    tags: ['facial', 'skincare', 'cleanup', 'beauty'],
  },
];

const sampleUsers = [
  {
    id: 'user-001',
    email: 'john.doe@example.com',
    phone: '+919876543210',
    name: 'John Doe',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'customer',
    isVerified: true,
    isActive: true,
    addresses: [
      {
        id: 'addr-001',
        type: 'home',
        label: 'Home',
        fullAddress: '123, Green Park Extension, New Delhi',
        landmark: 'Near Metro Station',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        location: { lat: 28.5512, lng: 77.2072 },
        isDefault: true,
      },
    ],
    wallet: { balance: 500 },
    referralCode: 'JOHN5432',
    totalBookings: 12,
    totalSpent: 15600,
  },
  {
    id: 'user-002',
    email: 'priya.sharma@example.com',
    phone: '+919876543211',
    name: 'Priya Sharma',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    role: 'customer',
    isVerified: true,
    isActive: true,
    addresses: [
      {
        id: 'addr-002',
        type: 'home',
        label: 'Home',
        fullAddress: '45, Sector 15, Noida',
        landmark: 'Opposite City Mall',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        location: { lat: 28.5850, lng: 77.3541 },
        isDefault: true,
      },
    ],
    wallet: { balance: 1200 },
    referralCode: 'PRIYA8821',
    totalBookings: 8,
    totalSpent: 9800,
  },
];

const sampleWorkers = [
  {
    id: 'worker-001',
    email: 'rajesh.kumar@example.com',
    phone: '+919876543220',
    name: 'Rajesh Kumar',
    profileImage: 'https://randomuser.me/api/portraits/men/10.jpg',
    role: 'worker',
    isVerified: true,
    isActive: true,
    onlineStatus: true,
    categories: ['electrical', 'plumbing'],
    services: ['fan-installation', 'switchboard-repair', 'tap-repair'],
    experience: 8,
    about: 'Experienced electrician and plumber with 8+ years of experience. Expert in all types of electrical and plumbing work.',
    skills: ['Wiring', 'Fan Installation', 'Plumbing', 'Tap Repair'],
    languages: ['Hindi', 'English'],
    location: {
      city: 'Delhi',
      area: 'South Delhi',
      coordinates: { lat: 28.5245, lng: 77.1855 },
    },
    serviceRadius: 15,
    rating: 4.8,
    totalReviews: 342,
    completedJobs: 856,
    earnings: { total: 425000, thisMonth: 32000 },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      addressProof: { verified: true },
    },
    bankDetails: {
      accountNumber: '****4521',
      ifsc: 'HDFC0001234',
      verified: true,
    },
    availability: {
      monday: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
      tuesday: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
      wednesday: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
      thursday: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
      friday: { enabled: true, slots: ['09:00-12:00', '14:00-18:00'] },
      saturday: { enabled: true, slots: ['10:00-14:00'] },
      sunday: { enabled: false, slots: [] },
    },
  },
  {
    id: 'worker-002',
    email: 'suresh.singh@example.com',
    phone: '+919876543221',
    name: 'Suresh Singh',
    profileImage: 'https://randomuser.me/api/portraits/men/11.jpg',
    role: 'worker',
    isVerified: true,
    isActive: true,
    onlineStatus: true,
    categories: ['ac-appliance'],
    services: ['split-ac-service', 'ac-deep-cleaning', 'ac-gas-refill'],
    experience: 12,
    about: 'HVAC specialist with 12 years of experience. Certified AC technician for all major brands.',
    skills: ['AC Service', 'AC Repair', 'Gas Refill', 'Installation'],
    languages: ['Hindi', 'English', 'Punjabi'],
    location: {
      city: 'Delhi',
      area: 'North Delhi',
      coordinates: { lat: 28.7041, lng: 77.1025 },
    },
    serviceRadius: 20,
    rating: 4.9,
    totalReviews: 521,
    completedJobs: 1245,
    earnings: { total: 680000, thisMonth: 48000 },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      addressProof: { verified: true },
    },
    bankDetails: {
      accountNumber: '****7832',
      ifsc: 'ICIC0002341',
      verified: true,
    },
    availability: {
      monday: { enabled: true, slots: ['08:00-12:00', '13:00-19:00'] },
      tuesday: { enabled: true, slots: ['08:00-12:00', '13:00-19:00'] },
      wednesday: { enabled: true, slots: ['08:00-12:00', '13:00-19:00'] },
      thursday: { enabled: true, slots: ['08:00-12:00', '13:00-19:00'] },
      friday: { enabled: true, slots: ['08:00-12:00', '13:00-19:00'] },
      saturday: { enabled: true, slots: ['08:00-15:00'] },
      sunday: { enabled: true, slots: ['10:00-14:00'] },
    },
  },
  {
    id: 'worker-003',
    email: 'meera.beauty@example.com',
    phone: '+919876543222',
    name: 'Meera Gupta',
    profileImage: 'https://randomuser.me/api/portraits/women/10.jpg',
    role: 'worker',
    isVerified: true,
    isActive: true,
    onlineStatus: true,
    categories: ['salon-spa'],
    services: ['mens-haircut', 'facial-cleanup'],
    experience: 6,
    about: 'Professional beautician with expertise in haircuts, facials, and skincare treatments.',
    skills: ['Haircut', 'Facial', 'Makeup', 'Skincare'],
    languages: ['Hindi', 'English'],
    location: {
      city: 'Delhi',
      area: 'Central Delhi',
      coordinates: { lat: 28.6139, lng: 77.2090 },
    },
    serviceRadius: 12,
    rating: 4.7,
    totalReviews: 289,
    completedJobs: 654,
    earnings: { total: 320000, thisMonth: 28000 },
    documents: {
      aadhaar: { verified: true },
      pan: { verified: true },
      addressProof: { verified: true },
    },
    bankDetails: {
      accountNumber: '****9145',
      ifsc: 'SBIN0003456',
      verified: true,
    },
    availability: {
      monday: { enabled: true, slots: ['10:00-13:00', '15:00-20:00'] },
      tuesday: { enabled: true, slots: ['10:00-13:00', '15:00-20:00'] },
      wednesday: { enabled: true, slots: ['10:00-13:00', '15:00-20:00'] },
      thursday: { enabled: true, slots: ['10:00-13:00', '15:00-20:00'] },
      friday: { enabled: true, slots: ['10:00-13:00', '15:00-20:00'] },
      saturday: { enabled: true, slots: ['09:00-20:00'] },
      sunday: { enabled: true, slots: ['09:00-18:00'] },
    },
  },
];

const sampleBookings = [
  {
    id: 'booking-001',
    bookingNumber: 'FK20240115001',
    customerId: 'user-001',
    customerName: 'John Doe',
    customerPhone: '+919876543210',
    workerId: 'worker-001',
    workerName: 'Rajesh Kumar',
    workerPhone: '+919876543220',
    serviceId: 'fan-installation',
    serviceName: 'Ceiling Fan Installation',
    categoryId: 'electrical',
    status: 'completed',
    scheduledDate: '2024-01-15',
    scheduledTime: '10:00 AM',
    scheduledSlot: '10:00-11:00',
    address: {
      fullAddress: '123, Green Park Extension, New Delhi',
      landmark: 'Near Metro Station',
      city: 'New Delhi',
      pincode: '110016',
      location: { lat: 28.5512, lng: 77.2072 },
    },
    pricing: {
      basePrice: 299,
      discount: 50,
      taxes: 44.82,
      totalAmount: 294,
    },
    payment: {
      method: 'razorpay',
      status: 'paid',
      transactionId: 'pay_LmN3OpQ4RsTu56',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-14T15:30:00'), note: 'Booking created' },
      { status: 'confirmed', timestamp: new Date('2024-01-14T15:35:00'), note: 'Worker assigned' },
      { status: 'on_the_way', timestamp: new Date('2024-01-15T09:45:00'), note: 'Worker on the way' },
      { status: 'arrived', timestamp: new Date('2024-01-15T10:05:00'), note: 'Worker arrived' },
      { status: 'in_progress', timestamp: new Date('2024-01-15T10:10:00'), note: 'Service started' },
      { status: 'completed', timestamp: new Date('2024-01-15T10:55:00'), note: 'Service completed' },
    ],
    rating: 5,
    review: 'Excellent service! Very professional and quick.',
  },
  {
    id: 'booking-002',
    bookingNumber: 'FK20240120002',
    customerId: 'user-002',
    customerName: 'Priya Sharma',
    customerPhone: '+919876543211',
    workerId: 'worker-002',
    workerName: 'Suresh Singh',
    workerPhone: '+919876543221',
    serviceId: 'ac-deep-cleaning',
    serviceName: 'AC Deep Cleaning',
    categoryId: 'ac-appliance',
    status: 'confirmed',
    scheduledDate: '2024-01-25',
    scheduledTime: '02:00 PM',
    scheduledSlot: '14:00-16:00',
    address: {
      fullAddress: '45, Sector 15, Noida',
      landmark: 'Opposite City Mall',
      city: 'Noida',
      pincode: '201301',
      location: { lat: 28.5850, lng: 77.3541 },
    },
    pricing: {
      basePrice: 799,
      discount: 100,
      taxes: 125.82,
      totalAmount: 825,
    },
    payment: {
      method: 'wallet',
      status: 'paid',
      transactionId: 'wallet_Ab12CdEf3456',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-20T10:00:00'), note: 'Booking created' },
      { status: 'confirmed', timestamp: new Date('2024-01-20T10:15:00'), note: 'Worker assigned' },
    ],
  },
];

const sampleReviews = [
  {
    id: 'review-001',
    bookingId: 'booking-001',
    serviceId: 'fan-installation',
    workerId: 'worker-001',
    customerId: 'user-001',
    customerName: 'John Doe',
    customerImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    title: 'Excellent Service!',
    comment: 'Rajesh was very professional and completed the fan installation quickly. He also cleaned up after the work. Highly recommended!',
    images: [],
    isVerified: true,
    isApproved: true,
    helpful: 12,
    createdAt: new Date('2024-01-15T12:00:00'),
  },
];

const coupons = [
  {
    id: 'coupon-001',
    code: 'WELCOME50',
    type: 'percentage',
    value: 50,
    maxDiscount: 200,
    minOrderAmount: 499,
    description: 'Get 50% off on your first booking',
    terms: ['Valid for new users only', 'Maximum discount ₹200', 'Minimum order ₹499'],
    usageLimit: 1000,
    usageCount: 245,
    perUserLimit: 1,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    categories: [],
    services: [],
    isActive: true,
    isFirstOrderOnly: true,
  },
  {
    id: 'coupon-002',
    code: 'AC100',
    type: 'flat',
    value: 100,
    maxDiscount: 100,
    minOrderAmount: 599,
    description: 'Flat ₹100 off on AC services',
    terms: ['Valid on AC services only', 'Minimum order ₹599'],
    usageLimit: 500,
    usageCount: 87,
    perUserLimit: 2,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-03-31'),
    categories: ['ac-appliance'],
    services: [],
    isActive: true,
    isFirstOrderOnly: false,
  },
  {
    id: 'coupon-003',
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    maxDiscount: 500,
    minOrderAmount: 999,
    description: 'Summer special - 20% off on all services',
    terms: ['Valid on all services', 'Maximum discount ₹500', 'Minimum order ₹999'],
    usageLimit: 2000,
    usageCount: 534,
    perUserLimit: 3,
    validFrom: new Date('2024-04-01'),
    validTo: new Date('2024-06-30'),
    categories: [],
    services: [],
    isActive: true,
    isFirstOrderOnly: false,
  },
];

const platformSettings = {
  id: 'platform-settings',
  general: {
    platformName: 'FixKart',
    tagline: 'AI-Powered Home Services',
    supportEmail: 'support@fixkart.com',
    supportPhone: '+91-1800-123-4567',
    whatsappNumber: '+919876543200',
  },
  business: {
    commissionRate: 15,
    minOrderAmount: 199,
    maxBookingsPerDay: 5,
    advanceBookingDays: 30,
    cancellationHours: 2,
    refundPolicy: 'full',
  },
  payment: {
    razorpayEnabled: true,
    walletEnabled: true,
    codEnabled: false,
    minWalletRecharge: 100,
    maxWalletBalance: 10000,
  },
  notifications: {
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
    whatsappEnabled: true,
  },
  referral: {
    enabled: true,
    referrerBonus: 100,
    refereeDiscount: 50,
  },
  serviceAreas: [
    { city: 'New Delhi', state: 'Delhi', isActive: true },
    { city: 'Noida', state: 'Uttar Pradesh', isActive: true },
    { city: 'Gurgaon', state: 'Haryana', isActive: true },
    { city: 'Bangalore', state: 'Karnataka', isActive: true },
    { city: 'Mumbai', state: 'Maharashtra', isActive: true },
  ],
};

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedCategories() {
  console.log('Seeding categories...');
  const batch = db.batch();
  
  for (const category of categories) {
    const ref = db.collection('categories').doc(category.id);
    batch.set(ref, {
      ...category,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${categories.length} categories`);
}

async function seedServices() {
  console.log('Seeding services...');
  const batch = db.batch();
  
  for (const service of services) {
    const ref = db.collection('services').doc(service.id);
    batch.set(ref, {
      ...service,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${services.length} services`);
}

async function seedUsers() {
  console.log('Seeding users...');
  
  for (const user of sampleUsers) {
    // Create auth user
    try {
      await auth.createUser({
        uid: user.id,
        email: user.email,
        phoneNumber: user.phone,
        displayName: user.name,
        photoURL: user.profileImage,
        emailVerified: true,
      });
    } catch (error) {
      if (error.code !== 'auth/uid-already-exists') {
        console.log(`Auth user ${user.id} may already exist, skipping...`);
      }
    }
    
    // Create Firestore document
    await db.collection('users').doc(user.id).set({
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  console.log(`✓ Seeded ${sampleUsers.length} users`);
}

async function seedWorkers() {
  console.log('Seeding workers...');
  
  for (const worker of sampleWorkers) {
    // Create auth user
    try {
      await auth.createUser({
        uid: worker.id,
        email: worker.email,
        phoneNumber: worker.phone,
        displayName: worker.name,
        photoURL: worker.profileImage,
        emailVerified: true,
      });
    } catch (error) {
      if (error.code !== 'auth/uid-already-exists') {
        console.log(`Auth user ${worker.id} may already exist, skipping...`);
      }
    }
    
    // Create Firestore document
    await db.collection('workers').doc(worker.id).set({
      ...worker,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  console.log(`✓ Seeded ${sampleWorkers.length} workers`);
}

async function seedBookings() {
  console.log('Seeding bookings...');
  const batch = db.batch();
  
  for (const booking of sampleBookings) {
    const ref = db.collection('bookings').doc(booking.id);
    batch.set(ref, {
      ...booking,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${sampleBookings.length} bookings`);
}

async function seedReviews() {
  console.log('Seeding reviews...');
  const batch = db.batch();
  
  for (const review of sampleReviews) {
    const ref = db.collection('reviews').doc(review.id);
    batch.set(ref, {
      ...review,
      createdAt: review.createdAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${sampleReviews.length} reviews`);
}

async function seedCoupons() {
  console.log('Seeding coupons...');
  const batch = db.batch();
  
  for (const coupon of coupons) {
    const ref = db.collection('coupons').doc(coupon.id);
    batch.set(ref, {
      ...coupon,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${coupons.length} coupons`);
}

async function seedSettings() {
  console.log('Seeding platform settings...');
  
  await db.collection('settings').doc('platform').set({
    ...platformSettings,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  console.log('✓ Seeded platform settings');
}

async function createAdminUser() {
  console.log('Creating admin user...');
  
  const adminData = {
    id: 'admin-001',
    email: 'admin@fixkart.com',
    name: 'Super Admin',
    role: 'admin',
    permissions: ['all'],
    isActive: true,
  };
  
  try {
    await auth.createUser({
      uid: adminData.id,
      email: adminData.email,
      password: 'Admin@123456',
      displayName: adminData.name,
      emailVerified: true,
    });
    
    // Set admin custom claim
    await auth.setCustomUserClaims(adminData.id, { admin: true });
  } catch (error) {
    if (error.code !== 'auth/uid-already-exists') {
      console.log('Admin user may already exist, skipping...');
    }
  }
  
  await db.collection('admins').doc(adminData.id).set({
    ...adminData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  console.log('✓ Created admin user (email: admin@fixkart.com, password: Admin@123456)');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function seedAll() {
  console.log('\n========================================');
  console.log('🚀 Starting FixKart Database Seed');
  console.log('========================================\n');
  
  try {
    await seedCategories();
    await seedServices();
    await seedUsers();
    await seedWorkers();
    await seedBookings();
    await seedReviews();
    await seedCoupons();
    await seedSettings();
    await createAdminUser();
    
    console.log('\n========================================');
    console.log('✅ Database seeding completed!');
    console.log('========================================\n');
    
    console.log('Summary:');
    console.log(`  - ${categories.length} categories`);
    console.log(`  - ${services.length} services`);
    console.log(`  - ${sampleUsers.length} users`);
    console.log(`  - ${sampleWorkers.length} workers`);
    console.log(`  - ${sampleBookings.length} bookings`);
    console.log(`  - ${sampleReviews.length} reviews`);
    console.log(`  - ${coupons.length} coupons`);
    console.log(`  - 1 admin user`);
    console.log(`  - Platform settings\n`);
    
    console.log('Test Credentials:');
    console.log('  Admin: admin@fixkart.com / Admin@123456');
    console.log('  User: john.doe@example.com');
    console.log('  Worker: rajesh.kumar@example.com\n');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

async function clearAll() {
  console.log('\n⚠️  Clearing all data...\n');
  
  const collections = [
    'categories',
    'services', 
    'users',
    'workers',
    'bookings',
    'reviews',
    'coupons',
    'settings',
    'admins',
    'notifications',
    'payments',
  ];
  
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`  Cleared ${collectionName} (${snapshot.size} docs)`);
  }
  
  console.log('\n✓ All data cleared\n');
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--clear')) {
  clearAll().then(() => process.exit(0));
} else if (args.includes('--clear-and-seed')) {
  clearAll().then(() => seedAll()).then(() => process.exit(0));
} else {
  seedAll().then(() => process.exit(0));
}

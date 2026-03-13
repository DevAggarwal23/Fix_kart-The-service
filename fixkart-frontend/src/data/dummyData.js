// Services & Categories Data
export const serviceCategories = [
  {
    id: 'plumber',
    name: 'Plumber',
    slug: 'plumber',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    description: 'Expert plumbing services for all your needs',
    color: 'from-blue-500 to-cyan-500',
    subCategories: [
      { id: 'p1', name: 'Tap Repair', price: 199, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=150&fit=crop' },
      { id: 'p2', name: 'Pipe Leakage', price: 299, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop' },
      { id: 'p3', name: 'Toilet Repair', price: 349, image: 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=200&h=150&fit=crop' },
      { id: 'p4', name: 'Water Tank', price: 499, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=150&fit=crop' },
      { id: 'p5', name: 'Drainage', price: 399, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop' },
    ]
  },
  {
    id: 'electrician',
    name: 'Electrician',
    slug: 'electrician',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1621905252507-b35b0e1312c6?w=400&h=300&fit=crop',
    description: 'Professional electrical services',
    color: 'from-yellow-500 to-orange-500',
    subCategories: [
      { id: 'e1', name: 'Fan Installation', price: 149, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&h=150&fit=crop' },
      { id: 'e2', name: 'Wiring Work', price: 299, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop' },
      { id: 'e3', name: 'Switch/Socket', price: 99, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&h=150&fit=crop' },
      { id: 'e4', name: 'MCB/Fuse Box', price: 399, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop' },
      { id: 'e5', name: 'Inverter Setup', price: 599, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&h=150&fit=crop' },
    ]
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    slug: 'carpenter',
    icon: '🪚',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    description: 'Quality carpentry and woodwork',
    color: 'from-amber-600 to-yellow-600',
    subCategories: [
      { id: 'c1', name: 'Furniture Repair', price: 299, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop' },
      { id: 'c2', name: 'Door Fitting', price: 399, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop' },
      { id: 'c3', name: 'Cabinet Work', price: 599, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop' },
      { id: 'c4', name: 'Bed Assembly', price: 349, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200&h=150&fit=crop' },
    ]
  },
  {
    id: 'cleaner',
    name: 'Home Cleaning',
    slug: 'cleaner',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    description: 'Deep cleaning and sanitization',
    color: 'from-green-500 to-emerald-500',
    subCategories: [
      { id: 'cl1', name: 'Full Home', price: 1499, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&h=150&fit=crop' },
      { id: 'cl2', name: 'Kitchen Deep Clean', price: 599, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop' },
      { id: 'cl3', name: 'Bathroom Clean', price: 399, image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=150&fit=crop' },
      { id: 'cl4', name: 'Sofa Cleaning', price: 699, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop' },
      { id: 'cl5', name: 'Carpet Cleaning', price: 499, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&h=150&fit=crop' },
    ]
  },
  {
    id: 'ac-service',
    name: 'AC Service',
    slug: 'ac-service',
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    description: 'AC repair, installation & service',
    color: 'from-sky-500 to-blue-500',
    subCategories: [
      { id: 'ac1', name: 'AC Service', price: 499, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=150&fit=crop' },
      { id: 'ac2', name: 'AC Installation', price: 999, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=150&fit=crop' },
      { id: 'ac3', name: 'Gas Refill', price: 1499, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=150&fit=crop' },
      { id: 'ac4', name: 'AC Repair', price: 699, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=150&fit=crop' },
    ]
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    slug: 'appliance',
    icon: '🔌',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    description: 'Repair for all home appliances',
    color: 'from-purple-500 to-pink-500',
    subCategories: [
      { id: 'ap1', name: 'Washing Machine', price: 399, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=150&fit=crop' },
      { id: 'ap2', name: 'Refrigerator', price: 499, image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=150&fit=crop' },
      { id: 'ap3', name: 'Microwave', price: 299, image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&h=150&fit=crop' },
      { id: 'ap4', name: 'Geyser', price: 349, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop' },
    ]
  },
  {
    id: 'painter',
    name: 'Painter',
    slug: 'painter',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
    description: 'Professional painting services',
    color: 'from-pink-500 to-rose-500',
    subCategories: [
      { id: 'pa1', name: 'Wall Painting', price: 15, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=150&fit=crop', unit: 'per sq ft' },
      { id: 'pa2', name: 'Texture Painting', price: 25, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=150&fit=crop', unit: 'per sq ft' },
      { id: 'pa3', name: 'Waterproofing', price: 35, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=150&fit=crop', unit: 'per sq ft' },
    ]
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    slug: 'pest-control',
    icon: '🐜',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
    description: 'Complete pest control solutions',
    color: 'from-red-500 to-orange-500',
    subCategories: [
      { id: 'pc1', name: 'Cockroach Control', price: 799, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=150&fit=crop' },
      { id: 'pc2', name: 'Termite Control', price: 1499, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=150&fit=crop' },
      { id: 'pc3', name: 'Bed Bug Control', price: 999, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=150&fit=crop' },
    ]
  },
];

// Workers Data
export const workers = [
  {
    id: 'w1',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    categories: ['plumber'],
    rating: 4.8,
    totalJobs: 523,
    experience: '8 years',
    location: { lat: 28.6139, lng: 77.2090 },
    distance: '1.2 km',
    eta: '15 min',
    price: 299,
    badges: ['Top Rated', 'Quick Response'],
    verified: true,
    available: true,
  },
  {
    id: 'w2',
    name: 'Suresh Sharma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    categories: ['electrician'],
    rating: 4.9,
    totalJobs: 789,
    experience: '12 years',
    location: { lat: 28.6229, lng: 77.2190 },
    distance: '2.5 km',
    eta: '20 min',
    price: 349,
    badges: ['Expert', 'Top Rated'],
    verified: true,
    available: true,
  },
  {
    id: 'w3',
    name: 'Amit Singh',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    categories: ['carpenter'],
    rating: 4.7,
    totalJobs: 342,
    experience: '6 years',
    location: { lat: 28.6339, lng: 77.2290 },
    distance: '3.0 km',
    eta: '25 min',
    price: 399,
    badges: ['Skilled'],
    verified: true,
    available: true,
  },
  {
    id: 'w4',
    name: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    categories: ['cleaner'],
    rating: 4.9,
    totalJobs: 456,
    experience: '5 years',
    location: { lat: 28.6439, lng: 77.2390 },
    distance: '1.8 km',
    eta: '18 min',
    price: 499,
    badges: ['Top Rated', 'Thorough'],
    verified: true,
    available: true,
  },
  {
    id: 'w5',
    name: 'Vikram Patel',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    categories: ['ac-service'],
    rating: 4.6,
    totalJobs: 234,
    experience: '7 years',
    location: { lat: 28.6539, lng: 77.2490 },
    distance: '2.2 km',
    eta: '22 min',
    price: 599,
    badges: ['Certified'],
    verified: true,
    available: true,
  },
];

// Testimonials Data
export const testimonials = [
  {
    id: 1,
    name: 'Ananya Gupta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    role: 'Homeowner',
    rating: 5,
    text: 'FixKart\'s AI assistant correctly identified my AC problem and sent a technician within 30 minutes. Absolutely amazing service!',
    service: 'AC Repair',
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'IT Professional',
    rating: 5,
    text: 'The bidding feature helped me get the best price for my home painting project. Saved ₹8,000 compared to other quotes!',
    service: 'Painting',
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'Interior Designer',
    rating: 5,
    text: 'I use FixKart for all my client projects. The quality of workers and transparent pricing make it my go-to platform.',
    service: 'Multiple Services',
  },
  {
    id: 4,
    name: 'Karan Shah',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    role: 'Restaurant Owner',
    rating: 5,
    text: 'Emergency plumbing issue at midnight - FixKart\'s 24/7 service was a lifesaver. Problem fixed in under an hour!',
    service: 'Plumbing',
  },
];

// Cities Data
export const cities = [
  { id: 1, name: 'Delhi NCR', state: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&h=150&fit=crop' },
  { id: 2, name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&h=150&fit=crop' },
  { id: 3, name: 'Bangalore', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200&h=150&fit=crop' },
  { id: 4, name: 'Chennai', state: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&h=150&fit=crop' },
  { id: 5, name: 'Hyderabad', state: 'Telangana', image: 'https://images.unsplash.com/photo-1576487236230-eaa4afe9b453?w=200&h=150&fit=crop' },
  { id: 6, name: 'Pune', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1572445271230-a78b4f071da0?w=200&h=150&fit=crop' },
  { id: 7, name: 'Kolkata', state: 'West Bengal', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&h=150&fit=crop' },
  { id: 8, name: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200&h=150&fit=crop' },
];

// Mock Bookings Data
export const mockBookings = [
  {
    id: 'BKG001',
    service: 'AC Service',
    category: 'ac-service',
    worker: workers[4],
    status: 'completed',
    date: '2024-01-15',
    time: '10:00 AM',
    amount: 599,
    address: '123, Green Park, New Delhi',
    rating: 5,
  },
  {
    id: 'BKG002',
    service: 'Pipe Leakage',
    category: 'plumber',
    worker: workers[0],
    status: 'in-progress',
    date: '2024-01-20',
    time: '2:00 PM',
    amount: 299,
    address: '456, Sector 18, Noida',
    rating: null,
  },
  {
    id: 'BKG003',
    service: 'Full Home Cleaning',
    category: 'cleaner',
    worker: workers[3],
    status: 'scheduled',
    date: '2024-01-25',
    time: '9:00 AM',
    amount: 1499,
    address: '789, Cyber City, Gurgaon',
    rating: null,
  },
];

// FAQ Data
export const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is FixKart?',
        a: 'FixKart is an AI-powered home services platform that connects you with verified professionals for plumbing, electrical, cleaning, and more. Our AI helps diagnose problems and find the best solutions.'
      },
      {
        q: 'How do I book a service?',
        a: 'Simply describe your problem (text, voice, or image), our AI will analyze it, and you can choose from instant booking, bidding, or direct call options. Select a worker, schedule, and confirm!'
      },
      {
        q: 'Is FixKart available in my city?',
        a: 'We\'re currently operational in Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and Jaipur. We\'re expanding to more cities soon!'
      },
    ]
  },
  {
    category: 'Booking & Pricing',
    questions: [
      {
        q: 'How does pricing work?',
        a: 'We offer transparent pricing with no hidden charges. You can see estimated costs before booking. Choose instant fixed prices or get competitive bids from multiple workers.'
      },
      {
        q: 'Can I reschedule or cancel?',
        a: 'Yes! Free cancellation up to 2 hours before the scheduled time. Rescheduling is always free. Check our cancellation policy for details.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, debit/credit cards, net banking, wallets, and cash. Digital payments are processed securely through Razorpay.'
      },
    ]
  },
  {
    category: 'Workers & Quality',
    questions: [
      {
        q: 'Are workers verified?',
        a: 'Absolutely! All workers undergo thorough background verification, skill testing, and document verification. Only verified professionals are allowed on our platform.'
      },
      {
        q: 'What if I\'m not satisfied?',
        a: 'We have a 100% satisfaction guarantee. If you\'re not happy, we\'ll send another professional or provide a full refund. Just raise a complaint within 48 hours.'
      },
    ]
  },
];

// Offers Data
export const offers = [
  {
    id: 1,
    title: '20% OFF First Booking',
    code: 'FIRST20',
    description: 'Get 20% off on your first service booking',
    validTill: '2024-02-28',
    minOrder: 299,
    maxDiscount: 500,
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 2,
    title: 'Flat ₹200 OFF',
    code: 'CLEAN200',
    description: 'On home cleaning services above ₹999',
    validTill: '2024-02-15',
    minOrder: 999,
    maxDiscount: 200,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    title: 'AC Service @ ₹399',
    code: 'SUMMER399',
    description: 'Complete AC service at special price',
    validTill: '2024-03-31',
    minOrder: 0,
    maxDiscount: 100,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=200&fit=crop',
    color: 'from-cyan-500 to-blue-500',
  },
];

// Quick Actions for Home
export const quickActions = [
  { id: 1, name: 'Plumber', icon: '🔧', route: '/services/plumber' },
  { id: 2, name: 'Electrician', icon: '⚡', route: '/services/electrician' },
  { id: 3, name: 'Cleaning', icon: '🧹', route: '/services/cleaner' },
  { id: 4, name: 'AC Repair', icon: '❄️', route: '/services/ac-service' },
  { id: 5, name: 'Carpenter', icon: '🪚', route: '/services/carpenter' },
  { id: 6, name: 'Painter', icon: '🎨', route: '/services/painter' },
  { id: 7, name: 'Appliance', icon: '🔌', route: '/services/appliance' },
  { id: 8, name: 'Pest Control', icon: '🐜', route: '/services/pest-control' },
];

// Urgency Levels
export const urgencyLevels = [
  { id: 'low', label: 'Low', description: 'Can wait a few days', color: 'bg-green-500', icon: '🟢' },
  { id: 'normal', label: 'Normal', description: 'Within 24-48 hours', color: 'bg-blue-500', icon: '🔵' },
  { id: 'high', label: 'High', description: 'Need it today', color: 'bg-orange-500', icon: '🟠' },
  { id: 'emergency', label: 'Emergency', description: 'Need it NOW!', color: 'bg-red-500', icon: '🔴' },
];

// Time Slots
export const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

// Admin Stats
export const adminStats = {
  totalUsers: 15234,
  totalWorkers: 892,
  totalBookings: 45678,
  monthlyRevenue: 2456789,
  activeBookings: 234,
  pendingApprovals: 45,
  avgRating: 4.7,
  complaintRate: 2.3,
};

// Languages
export const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
];

// Sample Workers
export const sampleWorkers = [
  {
    id: 'w1',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '+91 9876543210',
    rating: 4.8,
    totalJobs: 234,
    specialization: 'Plumber',
    experience: '8 years',
    isVerified: true,
    isAvailable: true,
    location: { lat: 28.6139, lng: 77.209 },
    distance: 1.2,
    eta: '15 mins',
  },
  {
    id: 'w2',
    name: 'Mohammed Iqbal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    phone: '+91 9876543211',
    rating: 4.9,
    totalJobs: 567,
    specialization: 'Electrician',
    experience: '12 years',
    isVerified: true,
    isAvailable: true,
    location: { lat: 28.6145, lng: 77.2100 },
    distance: 2.5,
    eta: '25 mins',
  },
  {
    id: 'w3',
    name: 'Suresh Patel',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '+91 9876543212',
    rating: 4.7,
    totalJobs: 189,
    specialization: 'AC Service',
    experience: '5 years',
    isVerified: true,
    isAvailable: false,
    location: { lat: 28.6120, lng: 77.2050 },
    distance: 3.0,
    eta: '35 mins',
  },
];

// Sample Bookings
export const sampleBookings = [
  {
    id: 'BK001',
    bookingNumber: 'FXK-2024-001234',
    service: { name: 'Tap Repair', category: 'Plumber', icon: '🔧' },
    status: 'completed',
    date: '2024-01-15',
    time: '10:00 AM',
    amount: 299,
    worker: sampleWorkers[0],
    address: { full: '123, MG Road, Koramangala, Bangalore - 560034' },
    rating: 5,
    otp: '1234',
  },
  {
    id: 'BK002',
    bookingNumber: 'FXK-2024-001235',
    service: { name: 'Fan Installation', category: 'Electrician', icon: '⚡' },
    status: 'in_progress',
    date: '2024-01-20',
    time: '2:00 PM',
    amount: 149,
    worker: sampleWorkers[1],
    address: { full: '456, HSR Layout, Bangalore - 560102' },
    otp: '5678',
  },
  {
    id: 'BK003',
    bookingNumber: 'FXK-2024-001236',
    service: { name: 'AC Service', category: 'AC Service', icon: '❄️' },
    status: 'pending',
    date: '2024-01-25',
    time: '11:00 AM',
    amount: 499,
    worker: null,
    address: { full: '789, Indiranagar, Bangalore - 560038' },
    otp: null,
  },
  {
    id: 'BK004',
    bookingNumber: 'FXK-2024-001237',
    service: { name: 'Kitchen Deep Clean', category: 'Home Cleaning', icon: '🧹' },
    status: 'cancelled',
    date: '2024-01-10',
    time: '9:00 AM',
    amount: 599,
    worker: null,
    address: { full: '321, Whitefield, Bangalore - 560066' },
    otp: null,
    cancelReason: 'Change of plans',
  },
];

// FAQs
export const faqs = [
  {
    id: 1,
    question: 'How do I book a service?',
    answer: 'Simply browse our services, select what you need, choose a time slot, and confirm your booking. Our professional will arrive at your doorstep.',
    category: 'booking',
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including UPI, Credit/Debit cards, Net Banking, and Wallets. Cash on delivery is also available for select services.',
    category: 'payment',
  },
  {
    id: 3,
    question: 'How can I track my service professional?',
    answer: 'Once a professional is assigned, you can track their real-time location on the map. You\'ll also receive updates via SMS and notifications.',
    category: 'tracking',
  },
  {
    id: 4,
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy, we\'ll redo the work for free or provide a full refund.',
    category: 'support',
  },
  {
    id: 5,
    question: 'Are your professionals verified?',
    answer: 'Yes, all our professionals undergo thorough background verification, skill assessment, and training before they join our platform.',
    category: 'safety',
  },
  {
    id: 6,
    question: 'Can I reschedule my booking?',
    answer: 'Yes, you can reschedule your booking up to 2 hours before the scheduled time without any charges. Go to My Bookings and click Reschedule.',
    category: 'booking',
  },
  {
    id: 7,
    question: 'How do I cancel a booking?',
    answer: 'You can cancel your booking from the My Bookings section. Cancellations made before worker assignment are free. Partial charges may apply after assignment.',
    category: 'booking',
  },
  {
    id: 8,
    question: 'What is the service warranty?',
    answer: 'We provide up to 30 days warranty on parts and workmanship for applicable services. Warranty details are mentioned on each service page.',
    category: 'support',
  },
];

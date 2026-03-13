/**
 * AI Routes
 * Handles OpenAI integration, Google Vision API, AI features
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const OpenAI = require('openai');
const vision = require('@google-cloud/vision');

const db = admin.firestore();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Google Vision
const visionClient = new vision.ImageAnnotatorClient();

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply auth middleware
router.use(verifyAuth);

// ============================================
// AI ASSISTANT (ChatGPT Integration)
// ============================================

/**
 * POST /ai/chat
 * AI Assistant Chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], context = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user info for personalization
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Get services for context
    const servicesSnapshot = await db.collection('services').limit(20).get();
    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      category: doc.data().category,
      price: doc.data().price,
    }));

    // System prompt for FixKart AI Assistant
    const systemPrompt = `You are FixKart AI Assistant, a helpful and friendly assistant for FixKart - India's leading home services platform.

About FixKart:
- We provide home services like AC repair, plumbing, electrical work, cleaning, beauty services, and more
- We operate in 100+ cities across India
- All our professionals are verified and trained
- We offer 30-day warranty on repairs
- Services are available 7 days a week

Your capabilities:
1. Help users find and book services
2. Answer questions about services, pricing, and availability
3. Assist with booking modifications and cancellations
4. Provide troubleshooting tips for common household issues
5. Explain our policies and processes

Available Services (sample):
${services.map(s => `- ${s.name} (${s.category}): ₹${s.price}`).join('\n')}

User Context:
- Name: ${userData.displayName || 'Customer'}
- Location: ${userData.defaultAddress?.city || context.city || 'India'}

Guidelines:
- Be helpful, concise, and friendly
- If a user wants to book, guide them to the service
- For complex issues, suggest contacting support
- Always be professional and courteous
- Respond in the same language as the user's message
- Keep responses brief but informative`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Detect intent for smart actions
    const intent = await detectIntent(message, aiResponse);

    // Store conversation for analytics
    await db.collection('aiConversations').add({
      userId: req.user.uid,
      message,
      response: aiResponse,
      intent,
      context,
      tokens: completion.usage.total_tokens,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      response: aiResponse,
      intent,
      suggestedActions: generateSuggestedActions(intent),
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * POST /ai/smart-search
 * AI-powered service search
 */
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Use OpenAI to understand the query
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a search intent analyzer for a home services platform. 
Extract the following from the user query:
1. Main service category (AC, plumbing, electrical, cleaning, beauty, appliance, painting, carpentry, pest_control)
2. Specific service type if mentioned
3. Urgency (normal, urgent, emergency)
4. Any specific requirements

Respond in JSON format:
{
  "category": "string",
  "serviceType": "string or null",
  "urgency": "normal|urgent|emergency",
  "requirements": ["array of requirements"],
  "keywords": ["search keywords"]
}`,
        },
        { role: 'user', content: query },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    let searchParams;
    try {
      searchParams = JSON.parse(completion.choices[0].message.content);
    } catch {
      searchParams = {
        keywords: [query],
        category: null,
        urgency: 'normal',
      };
    }

    // Search services based on AI-extracted parameters
    let servicesQuery = db.collection('services').where('status', '==', 'active');

    if (searchParams.category) {
      servicesQuery = servicesQuery.where('categorySlug', '==', searchParams.category);
    }

    const servicesSnapshot = await servicesQuery.limit(10).get();

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Rank services based on relevance
    const rankedServices = services.map(service => {
      let score = 0;
      const keywords = searchParams.keywords || [];
      
      keywords.forEach(keyword => {
        if (service.name.toLowerCase().includes(keyword.toLowerCase())) score += 3;
        if (service.description?.toLowerCase().includes(keyword.toLowerCase())) score += 1;
        if (service.tags?.some(t => t.toLowerCase().includes(keyword.toLowerCase()))) score += 2;
      });

      return { ...service, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.status(200).json({
      success: true,
      services: rankedServices,
      searchParams,
      suggestion: searchParams.category 
        ? `Showing ${searchParams.category} services` 
        : 'Showing relevant services',
    });
  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

/**
 * POST /ai/analyze-image
 * Analyze image for service recommendation
 */
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageUrl, imageBase64 } = req.body;

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    let request;
    if (imageUrl) {
      request = { image: { source: { imageUri: imageUrl } } };
    } else {
      request = { image: { content: imageBase64 } };
    }

    // Analyze image with Google Vision
    const [labelResult] = await visionClient.labelDetection(request);
    const [objectResult] = await visionClient.objectLocalization(request);
    const [webResult] = await visionClient.webDetection(request);

    const labels = labelResult.labelAnnotations || [];
    const objects = objectResult.localizedObjectAnnotations || [];
    const webEntities = webResult.webDetection?.webEntities || [];

    // Extract relevant information
    const detectedItems = [
      ...labels.map(l => l.description.toLowerCase()),
      ...objects.map(o => o.name.toLowerCase()),
      ...webEntities.map(e => e.description?.toLowerCase() || ''),
    ];

    // Map detected items to services
    const serviceMapping = {
      'air conditioner': { category: 'AC', services: ['AC Repair', 'AC Service', 'AC Installation'] },
      'ac': { category: 'AC', services: ['AC Repair', 'AC Service'] },
      'refrigerator': { category: 'Appliance', services: ['Refrigerator Repair'] },
      'fridge': { category: 'Appliance', services: ['Refrigerator Repair'] },
      'washing machine': { category: 'Appliance', services: ['Washing Machine Repair'] },
      'pipe': { category: 'Plumbing', services: ['Pipe Repair', 'Plumbing Service'] },
      'water': { category: 'Plumbing', services: ['Water Leakage', 'Plumbing Service'] },
      'leak': { category: 'Plumbing', services: ['Water Leakage', 'Pipe Repair'] },
      'electric': { category: 'Electrical', services: ['Electrical Repair', 'Wiring'] },
      'wire': { category: 'Electrical', services: ['Wiring', 'Electrical Repair'] },
      'socket': { category: 'Electrical', services: ['Socket Repair', 'Switch Installation'] },
      'fan': { category: 'Electrical', services: ['Fan Repair', 'Fan Installation'] },
      'wall': { category: 'Painting', services: ['Wall Painting', 'Home Painting'] },
      'paint': { category: 'Painting', services: ['Interior Painting', 'Exterior Painting'] },
      'pest': { category: 'Pest Control', services: ['Pest Control', 'Cockroach Control'] },
      'cockroach': { category: 'Pest Control', services: ['Cockroach Control'] },
      'termite': { category: 'Pest Control', services: ['Termite Control'] },
    };

    const recommendedServices = [];
    const matchedCategories = new Set();

    detectedItems.forEach(item => {
      Object.keys(serviceMapping).forEach(key => {
        if (item.includes(key)) {
          const mapping = serviceMapping[key];
          matchedCategories.add(mapping.category);
          mapping.services.forEach(s => {
            if (!recommendedServices.includes(s)) {
              recommendedServices.push(s);
            }
          });
        }
      });
    });

    // Get actual services from database
    let servicesPromise;
    if (matchedCategories.size > 0) {
      servicesPromise = db.collection('services')
        .where('category', 'in', Array.from(matchedCategories))
        .limit(6)
        .get();
    } else {
      servicesPromise = db.collection('services')
        .where('isPopular', '==', true)
        .limit(6)
        .get();
    }

    const servicesSnapshot = await servicesPromise;
    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Use OpenAI to generate description
    const aiDescription = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that analyzes home problems. Based on the detected items, provide a brief (1-2 sentences) description of the likely issue and what service might be needed.',
        },
        {
          role: 'user',
          content: `Detected items: ${detectedItems.slice(0, 10).join(', ')}`,
        },
      ],
      max_tokens: 100,
    });

    res.status(200).json({
      success: true,
      analysis: {
        detectedLabels: labels.slice(0, 5).map(l => l.description),
        detectedObjects: objects.slice(0, 5).map(o => o.name),
        confidence: labels[0]?.score || 0,
      },
      description: aiDescription.choices[0].message.content,
      recommendedServices,
      services,
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

/**
 * POST /ai/estimate
 * Get AI-powered service estimate
 */
router.post('/estimate', async (req, res) => {
  try {
    const { serviceId, description, images = [], location } = req.body;

    if (!serviceId || !description) {
      return res.status(400).json({ error: 'Service and description are required' });
    }

    // Get service details
    const serviceDoc = await db.collection('services').doc(serviceId).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const serviceData = serviceDoc.data();

    // Generate estimate using AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert technician estimator for home services.
Service: ${serviceData.name}
Base Price: ₹${serviceData.price}
Category: ${serviceData.category}

Based on the problem description, estimate:
1. Time required (in minutes)
2. Price range (low and high estimate)
3. Possible additional materials/parts needed
4. Complexity level (simple, moderate, complex)

Respond in JSON format:
{
  "timeEstimate": number,
  "priceRange": { "low": number, "high": number },
  "additionalMaterials": ["list of possible materials"],
  "complexity": "simple|moderate|complex",
  "notes": "any additional notes"
}`,
        },
        {
          role: 'user',
          content: `Problem description: ${description}\nLocation: ${location || 'Not specified'}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    let estimate;
    try {
      estimate = JSON.parse(completion.choices[0].message.content);
    } catch {
      estimate = {
        timeEstimate: serviceData.duration || 60,
        priceRange: {
          low: serviceData.price,
          high: serviceData.price * 1.5,
        },
        complexity: 'moderate',
        notes: 'Unable to provide detailed estimate. Final price may vary.',
      };
    }

    // Store estimate for analytics
    await db.collection('aiEstimates').add({
      userId: req.user.uid,
      serviceId,
      description,
      estimate,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      service: {
        id: serviceId,
        name: serviceData.name,
        basePrice: serviceData.price,
      },
      estimate,
    });
  } catch (error) {
    console.error('Estimate error:', error);
    res.status(500).json({ error: 'Failed to generate estimate' });
  }
});

/**
 * POST /ai/troubleshoot
 * AI-powered DIY troubleshooting
 */
router.post('/troubleshoot', async (req, res) => {
  try {
    const { issue, category } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'Issue description is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert home repair technician helping users troubleshoot issues.
Category: ${category || 'General Home Issues'}

Provide:
1. Possible causes of the issue
2. Simple DIY steps to diagnose
3. Safe DIY fixes if applicable
4. When to call a professional

Be clear about safety warnings. If the issue involves electricity, gas, or could be dangerous, always recommend calling a professional.

Respond in JSON format:
{
  "possibleCauses": ["list of possible causes"],
  "diagnosticSteps": ["list of steps to diagnose"],
  "diyFixes": ["list of safe DIY fixes"],
  "safetyWarnings": ["any safety warnings"],
  "callProfessionalIf": ["conditions when to call professional"],
  "recommendProfessional": boolean
}`,
        },
        { role: 'user', content: issue },
      ],
      max_tokens: 600,
      temperature: 0.6,
    });

    let troubleshootingGuide;
    try {
      troubleshootingGuide = JSON.parse(completion.choices[0].message.content);
    } catch {
      troubleshootingGuide = {
        possibleCauses: ['Unable to determine specific causes'],
        recommendProfessional: true,
        callProfessionalIf: ['For accurate diagnosis and safe repair'],
      };
    }

    // If professional is recommended, suggest services
    let recommendedServices = [];
    if (troubleshootingGuide.recommendProfessional && category) {
      const servicesSnapshot = await db.collection('services')
        .where('categorySlug', '==', category.toLowerCase())
        .limit(3)
        .get();

      recommendedServices = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
      }));
    }

    res.status(200).json({
      success: true,
      troubleshooting: troubleshootingGuide,
      recommendedServices,
    });
  } catch (error) {
    console.error('Troubleshoot error:', error);
    res.status(500).json({ error: 'Failed to generate troubleshooting guide' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Detect user intent from message
 */
async function detectIntent(message, response) {
  const intents = {
    booking: ['book', 'schedule', 'appointment', 'service', 'need', 'want', 'fix'],
    pricing: ['price', 'cost', 'charge', 'rate', 'fee', 'expensive', 'cheap'],
    cancellation: ['cancel', 'refund', 'stop', 'remove'],
    support: ['help', 'support', 'contact', 'speak', 'call', 'complaint'],
    tracking: ['track', 'where', 'status', 'coming', 'arriving'],
    information: ['what', 'how', 'why', 'when', 'where', 'which'],
  };

  const lowerMessage = message.toLowerCase();

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }

  return 'general';
}

/**
 * Generate suggested actions based on intent
 */
function generateSuggestedActions(intent) {
  const actions = {
    booking: [
      { label: 'Browse Services', action: 'navigate', path: '/services' },
      { label: 'View Popular Services', action: 'navigate', path: '/services?filter=popular' },
    ],
    pricing: [
      { label: 'View Pricing', action: 'navigate', path: '/services' },
      { label: 'Check Offers', action: 'navigate', path: '/offers' },
    ],
    cancellation: [
      { label: 'View Bookings', action: 'navigate', path: '/dashboard/bookings' },
      { label: 'Contact Support', action: 'navigate', path: '/support' },
    ],
    support: [
      { label: 'Contact Support', action: 'navigate', path: '/support' },
      { label: 'View FAQ', action: 'navigate', path: '/faq' },
    ],
    tracking: [
      { label: 'Track Booking', action: 'navigate', path: '/dashboard/bookings' },
    ],
    information: [
      { label: 'Browse Services', action: 'navigate', path: '/services' },
      { label: 'About Us', action: 'navigate', path: '/about' },
    ],
    general: [
      { label: 'Browse Services', action: 'navigate', path: '/services' },
    ],
  };

  return actions[intent] || actions.general;
}

module.exports = router;

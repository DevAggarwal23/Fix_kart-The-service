/**
 * OpenAI Service - Real AI Integration for FixKart
 * Handles problem analysis, category detection, urgency, and price estimation
 */
import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Service categories for context
const SERVICE_CATEGORIES = {
  plumber: { name: 'Plumber', keywords: ['tap', 'leak', 'pipe', 'water', 'drainage', 'toilet', 'sink', 'faucet', 'plumbing'], basePrice: 199 },
  electrician: { name: 'Electrician', keywords: ['fan', 'switch', 'wire', 'electric', 'light', 'socket', 'mcb', 'fuse', 'power'], basePrice: 149 },
  'ac-service': { name: 'AC Service', keywords: ['ac', 'air conditioner', 'cooling', 'hvac', 'ac repair', 'ac service', 'ac gas'], basePrice: 499 },
  cleaner: { name: 'Home Cleaning', keywords: ['clean', 'dust', 'wash', 'mop', 'sanitize', 'deep clean', 'bathroom', 'kitchen'], basePrice: 399 },
  carpenter: { name: 'Carpenter', keywords: ['door', 'furniture', 'wood', 'cabinet', 'wardrobe', 'bed', 'table', 'chair'], basePrice: 299 },
  'pest-control': { name: 'Pest Control', keywords: ['pest', 'cockroach', 'termite', 'bug', 'ant', 'insect', 'rat', 'mosquito'], basePrice: 799 },
  appliance: { name: 'Appliance Repair', keywords: ['washing machine', 'refrigerator', 'microwave', 'geyser', 'tv', 'appliance'], basePrice: 399 },
  painter: { name: 'Painter', keywords: ['paint', 'wall', 'color', 'texture', 'waterproof', 'whitewash'], basePrice: 15 },
};

/**
 * Analyze problem using OpenAI GPT-4o-mini
 * @param {string} problemText - User's problem description
 * @param {string|null} imageBase64 - Optional base64 encoded image
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeWithOpenAI = async (problemText, imageBase64 = null) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // If no API key, use fallback local analysis
  if (!apiKey || apiKey === 'your_openai_api_key') {
    console.log('Using local AI analysis (no OpenAI key)');
    return analyzeLocally(problemText);
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `You are FixKart's AI assistant for home services in India. Analyze the user's home service problem and respond with a JSON object containing:
        
{
  "category": "one of: plumber, electrician, ac-service, cleaner, carpenter, pest-control, appliance, painter",
  "problemTitle": "short title of the issue (max 5 words)",
  "problemDescription": "clear description of what the user needs",
  "urgency": "low, normal, high, or emergency",
  "estimatedPriceMin": number in INR,
  "estimatedPriceMax": number in INR,
  "estimatedDuration": "time in hours like '1-2 hours'",
  "suggestions": ["array of 2-3 helpful tips or recommendations"],
  "requiredTools": ["list of tools worker might need"],
  "questions": ["1-2 clarifying questions if problem is unclear"]
}

Consider Indian market rates. Be helpful and precise. If the problem is unclear, ask clarifying questions.`
      },
      {
        role: 'user',
        content: imageBase64 
          ? [
              { type: 'text', text: problemText || 'Please analyze this image and identify the home service issue.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          : problemText
      }
    ];

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: imageBase64 ? 'gpt-4o' : 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = JSON.parse(response.data.choices[0].message.content);
    
    return {
      success: true,
      ...aiResponse,
      priceRange: `₹${aiResponse.estimatedPriceMin} - ₹${aiResponse.estimatedPriceMax}`,
      confidence: 0.9
    };

  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    // Fallback to local analysis
    return analyzeLocally(problemText);
  }
};

/**
 * Local fallback analysis when OpenAI is unavailable
 */
export const analyzeLocally = (text) => {
  const lowerText = text.toLowerCase();
  
  // Find matching category
  let matchedCategory = null;
  let maxMatches = 0;
  
  for (const [categoryId, categoryData] of Object.entries(SERVICE_CATEGORIES)) {
    const matches = categoryData.keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      matchedCategory = { id: categoryId, ...categoryData };
    }
  }

  // Determine urgency based on keywords
  let urgency = 'normal';
  if (lowerText.includes('urgent') || lowerText.includes('emergency') || lowerText.includes('immediately') || lowerText.includes('asap')) {
    urgency = 'emergency';
  } else if (lowerText.includes('flooding') || lowerText.includes('sparking') || lowerText.includes('not working') || lowerText.includes('broken')) {
    urgency = 'high';
  } else if (lowerText.includes('minor') || lowerText.includes('small') || lowerText.includes('when available')) {
    urgency = 'low';
  }

  // Calculate price estimate
  const basePrice = matchedCategory?.basePrice || 299;
  const urgencyMultiplier = urgency === 'emergency' ? 1.5 : urgency === 'high' ? 1.25 : 1;
  const minPrice = Math.round(basePrice * urgencyMultiplier);
  const maxPrice = Math.round(basePrice * 2.5 * urgencyMultiplier);

  return {
    success: true,
    category: matchedCategory?.id || null,
    problemTitle: matchedCategory ? `${matchedCategory.name} Issue` : 'General Service Request',
    problemDescription: text,
    urgency,
    estimatedPriceMin: minPrice,
    estimatedPriceMax: maxPrice,
    priceRange: `₹${minPrice} - ₹${maxPrice}`,
    estimatedDuration: '1-2 hours',
    suggestions: [
      matchedCategory ? `Our verified ${matchedCategory.name.toLowerCase()}s are available nearby` : 'Please describe your problem in more detail',
      urgency === 'emergency' ? 'Emergency service available with quick response' : 'Schedule at your convenience',
      'All our professionals are background-verified'
    ],
    requiredTools: [],
    questions: matchedCategory ? [] : ['What type of service do you need?', 'Can you describe the issue in more detail?'],
    confidence: matchedCategory ? 0.7 : 0.3,
    isLocalAnalysis: true
  };
};

/**
 * Get AI chat response for conversational interaction
 */
export const getAIChatResponse = async (messages, currentContext = {}) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key') {
    // Simple rule-based response
    return generateLocalChatResponse(messages[messages.length - 1]?.content || '');
  }

  try {
    const systemMessage = {
      role: 'system',
      content: `You are FixKart's friendly AI assistant. Help users with home service problems. Be concise, helpful, and guide them to book services. Available categories: Plumber, Electrician, AC Service, Cleaning, Carpenter, Pest Control, Appliance Repair, Painter. Always suggest booking a professional for complex issues.`
    };

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        max_tokens: 300,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      message: response.data.choices[0].message.content
    };

  } catch (error) {
    console.error('Chat API Error:', error);
    return generateLocalChatResponse(messages[messages.length - 1]?.content || '');
  }
};

/**
 * Generate local chat response without API
 */
const generateLocalChatResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = {
    greeting: "Hello! 👋 I'm FixKart's AI assistant. I can help you find the right professional for your home service needs. What issue are you facing today?",
    plumbing: "I understand you have a plumbing issue! 🔧 Our verified plumbers can help with tap repairs, pipe leakages, toilet issues, and more. Would you like me to find nearby plumbers for you?",
    electrical: "For electrical issues, safety comes first! ⚡ Our certified electricians can help with fan installation, wiring, switch repairs, and more. Shall I show you available electricians?",
    ac: "AC troubles? ❄️ Our AC technicians specialize in servicing, gas refilling, and repairs for all brands. Want to book an AC service?",
    cleaning: "Time for a clean home! 🧹 Our professional cleaners offer deep cleaning, bathroom/kitchen cleaning, and more. Would you like to schedule a cleaning?",
    default: "I'd love to help! Could you tell me more about the issue? For example:\n• Is something leaking or broken?\n• Is this electrical or plumbing related?\n• How urgent is the situation?"
  };

  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return { success: true, message: responses.greeting };
  }
  if (lowerMessage.includes('tap') || lowerMessage.includes('leak') || lowerMessage.includes('pipe') || lowerMessage.includes('plumb')) {
    return { success: true, message: responses.plumbing };
  }
  if (lowerMessage.includes('fan') || lowerMessage.includes('electric') || lowerMessage.includes('switch') || lowerMessage.includes('wire')) {
    return { success: true, message: responses.electrical };
  }
  if (lowerMessage.includes('ac') || lowerMessage.includes('air condition') || lowerMessage.includes('cool')) {
    return { success: true, message: responses.ac };
  }
  if (lowerMessage.includes('clean') || lowerMessage.includes('wash') || lowerMessage.includes('mop')) {
    return { success: true, message: responses.cleaning };
  }
  
  return { success: true, message: responses.default };
};

/**
 * Analyze image for service detection
 */
export const analyzeImage = async (imageFile) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      const result = await analyzeWithOpenAI('Analyze this image and identify any home service issues visible.', base64);
      resolve(result);
    };
    reader.readAsDataURL(imageFile);
  });
};

export default {
  analyzeWithOpenAI,
  analyzeLocally,
  getAIChatResponse,
  analyzeImage
};

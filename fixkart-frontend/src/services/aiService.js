/**
 * AI Service - Chat & Smart Features
 */
import api, { endpoints } from './api';

export const aiService = {
  // Send chat message
  async chat(message, conversationId = null) {
    return api.post(endpoints.ai.chat, {
      message,
      conversationId,
    });
  },

  // Smart search with natural language
  async smartSearch(query) {
    return api.post(endpoints.ai.search, { query });
  },

  // Analyze image for service recommendation
  async analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return api.post(endpoints.ai.analyzeImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get AI price estimate
  async getEstimate(serviceId, description, images = []) {
    const formData = new FormData();
    formData.append('serviceId', serviceId);
    formData.append('description', description);
    images.forEach((img, idx) => {
      formData.append(`images[${idx}]`, img);
    });
    
    return api.post(endpoints.ai.estimate, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // DIY troubleshooting guide
  async getTroubleshootingGuide(issue, category = null) {
    return api.post(endpoints.ai.troubleshoot, {
      issue,
      category,
    });
  },

  // Quick suggestions based on context
  getQuickSuggestions() {
    return [
      "My AC is not cooling properly",
      "Need electrician for fan installation",
      "Bathroom tap is leaking",
      "Looking for deep cleaning service",
      "What's the cost of AC service?",
      "Book plumber for today",
    ];
  },

  // Parse natural language to booking intent
  parseBookingIntent(message) {
    const intent = {
      service: null,
      date: null,
      time: null,
      urgency: 'normal',
    };

    // Check for urgency
    if (/urgent|emergency|asap|immediately|now/i.test(message)) {
      intent.urgency = 'urgent';
    }

    // Check for date
    if (/today/i.test(message)) {
      intent.date = 'today';
    } else if (/tomorrow/i.test(message)) {
      intent.date = 'tomorrow';
    }

    // Check for common services
    const servicePatterns = [
      { pattern: /ac|air\s?condition/i, service: 'ac-service' },
      { pattern: /plumb|tap|leak|pipe/i, service: 'plumbing' },
      { pattern: /electric|fan|switch|wiring/i, service: 'electrical' },
      { pattern: /clean|cleaning/i, service: 'cleaning' },
      { pattern: /paint/i, service: 'painting' },
      { pattern: /carpenter|furniture|wood/i, service: 'carpentry' },
      { pattern: /pest|cockroach|termite/i, service: 'pest-control' },
      { pattern: /salon|haircut|facial|spa/i, service: 'salon' },
    ];

    for (const { pattern, service } of servicePatterns) {
      if (pattern.test(message)) {
        intent.service = service;
        break;
      }
    }

    return intent;
  },
};

export default aiService;

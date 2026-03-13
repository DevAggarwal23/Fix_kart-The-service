import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiSend, FiMic, FiImage, FiCamera,
  FiAlertCircle, FiClock, FiDollarSign,
  FiTool, FiArrowRight, FiZap
} from 'react-icons/fi';
import { Sparkles, BrainCircuit, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { serviceCategories } from '../../data/dummyData';
import { analyzeWithOpenAI, analyzeImage } from '../../services/openaiService';

// AI Thinking Animation
const AIThinkingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <div className="flex items-center gap-1.5">
      <motion.div className="w-2 h-2 rounded-full bg-ai-400"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} />
      <motion.div className="w-2 h-2 rounded-full bg-ai-500"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
      <motion.div className="w-2 h-2 rounded-full bg-ai-600"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
    </div>
    <span className="text-xs text-ai-400 ml-2 font-medium">AI is thinking...</span>
  </div>
);

// Quick action chips
const quickChips = [
  { text: 'Tap is leaking 💧' },
  { text: 'Fan not working ⚡' },
  { text: 'AC service needed ❄️' },
  { text: 'Deep cleaning 🧹' },
  { text: 'Pest control 🐛' },
  { text: 'Paint my room 🎨' },
];

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hey there! 👋 I'm FixKart AI — your smart home repair assistant. Tell me what's broken, snap a photo, or use voice — I'll find the perfect fix!",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const { closeAIAssistant } = useAuthStore();
  const { setProblemDescription, setSelectedCategory, setAIAnalysis, setPriceEstimate } = useBookingStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript).join('');
        setInputText(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) { recognitionRef.current?.stop(); }
    else { recognitionRef.current?.start(); setIsListening(true); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setMessages(prev => [...prev, {
        id: Date.now(), type: 'user',
        text: '📷 Uploaded an image for analysis',
        image: reader.result, timestamp: new Date(),
      }]);
      setIsTyping(true);
      try {
        const analysis = await analyzeImage(file);
        const aiResponse = createAIResponse(analysis);
        aiResponse.text = `I can see the issue in your image. ${aiResponse.text}`;
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Image analysis error:', error);
        setMessages(prev => [...prev, {
          id: Date.now(), type: 'ai',
          text: "I can see the issue in your image. Could you describe what's happening in more detail?",
          timestamp: new Date(),
        }]);
      } finally { setIsTyping(false); }
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const userMessage = { id: Date.now(), type: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const problem = inputText;
    setInputText('');
    setIsTyping(true);
    try {
      const analysis = await analyzeWithOpenAI(problem);
      setMessages(prev => [...prev, createAIResponse(analysis)]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, createAIResponse(analyzeProblem(problem))]);
    } finally { setIsTyping(false); }
  };

  const analyzeProblem = (text) => {
    const t = text.toLowerCase();
    if (/tap|leak|pipe|water/.test(t)) return { category: 'plumber', problem: 'Plumbing Issue', urgency: 'normal', priceRange: '₹199 - ₹499' };
    if (/fan|switch|wire|electric|light/.test(t)) return { category: 'electrician', problem: 'Electrical Issue', urgency: 'normal', priceRange: '₹149 - ₹399' };
    if (/\bac\b|air conditioner|cooling/.test(t)) return { category: 'ac-service', problem: 'AC Problem', urgency: 'high', priceRange: '₹499 - ₹1499' };
    if (/clean|dust|wash/.test(t)) return { category: 'cleaner', problem: 'Cleaning Required', urgency: 'low', priceRange: '₹399 - ₹1499' };
    if (/door|furniture|wood|cabinet/.test(t)) return { category: 'carpenter', problem: 'Carpentry Work', urgency: 'low', priceRange: '₹299 - ₹799' };
    if (/pest|cockroach|termite|bug/.test(t)) return { category: 'pest-control', problem: 'Pest Control', urgency: 'normal', priceRange: '₹799 - ₹1499' };
    return { category: null, problem: 'General Issue', urgency: 'normal', priceRange: '₹199 - ₹999' };
  };

  const createAIResponse = (analysis) => {
    const category = serviceCategories.find(c => c.id === analysis.category);
    const norm = {
      category: analysis.category,
      problem: analysis.problemTitle || analysis.problem || 'Service Issue',
      urgency: analysis.urgency || 'normal',
      priceRange: analysis.priceRange || `₹${analysis.estimatedPriceMin || 199} - ₹${analysis.estimatedPriceMax || 999}`,
      estimatedDuration: analysis.estimatedDuration,
      suggestions: analysis.suggestions || []
    };
    if (category) {
      return {
        id: Date.now(), type: 'ai', timestamp: new Date(),
        text: `Got it! This looks like a **${norm.problem}**. I'd recommend our ${category.name} services.${
          norm.urgency === 'high' || norm.urgency === 'emergency' ? '\n\n⚠️ This is urgent — let me prioritize!' : ''
        }`,
        analysis: norm,
        suggestions: [`View ${category.name} services`, 'Get instant booking', 'Compare worker prices'],
      };
    }
    if (analysis.questions?.length) {
      return { id: Date.now(), type: 'ai', timestamp: new Date(), text: `I'd like to help better! ${analysis.questions.join('\n• ')}` };
    }
    return { id: Date.now(), type: 'ai', timestamp: new Date(),
      text: "I'd love to help! Could you share more detail?\n\n• What exactly is the problem?\n• Where is it located?\n• How urgent is it?" };
  };

  const handleSuggestionClick = (suggestion, analysis) => {
    if (!analysis) return;
    const category = serviceCategories.find(c => c.id === analysis.category);
    if (category) {
      setProblemDescription(messages.find(m => m.type === 'user')?.text || '');
      setSelectedCategory(category);
      setAIAnalysis(analysis);
      setPriceEstimate(analysis.priceRange);
      closeAIAssistant();
      navigate(`/services/${category.slug}`);
    }
  };

  const handleProceedToBooking = (analysis) => {
    const category = serviceCategories.find(c => c.id === analysis?.category);
    if (category) {
      setProblemDescription(messages.find(m => m.type === 'user')?.text || '');
      setSelectedCategory(category);
      setAIAnalysis(analysis);
      closeAIAssistant();
      navigate('/book');
    }
  };

  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        onClick={closeAIAssistant}
      >
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-lg max-h-[95vh] sm:max-h-[85vh] flex flex-col overflow-hidden
                     sm:rounded-3xl shadow-2xl shadow-ai-500/20
                     bg-white dark:bg-gray-900 
                     border border-gray-200/50 dark:border-ai-500/20"
        >
          {/* Gradient border glow */}
          <div className="absolute inset-0 sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -inset-[1px] bg-gradient-to-br from-ai-500/20 via-transparent to-purple-500/20 sm:rounded-3xl" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 
                          bg-gradient-to-r from-ai-600 via-ai-500 to-purple-600 text-white">
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            <div className="relative flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center
                           border border-white/30 shadow-lg shadow-ai-700/30"
              >
                <BrainCircuit className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2">
                  FixKart AI <Sparkles className="w-4 h-4 text-yellow-300" />
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Powered by GPT-4 • Online
                </div>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
              onClick={closeAIAssistant}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors">
              <FiX className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto p-4 space-y-4 
                          bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {messages.map((message, index) => (
              <motion.div key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index < 2 ? index * 0.15 : 0, type: 'spring', damping: 20 }}
                className={`flex gap-2.5 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {message.type === 'ai' ? (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ai-500 to-purple-600 
                                    flex items-center justify-center shadow-md shadow-ai-500/30">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 
                                    flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%]`}>
                  <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${message.type === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm shadow-md shadow-primary-500/20'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-md border border-gray-100 dark:border-gray-700/50'
                    }`}>
                    {message.image && (
                      <img src={message.image} alt="Uploaded" className="w-full max-w-[200px] rounded-xl mb-2 border border-white/20" />
                    )}
                    <p className="whitespace-pre-line">{message.text}</p>

                    {/* Analysis Card */}
                    {message.analysis && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="mt-3 p-3 rounded-xl space-y-2.5
                                   bg-gradient-to-br from-ai-50 to-purple-50 dark:from-ai-900/30 dark:to-purple-900/20
                                   border border-ai-200/50 dark:border-ai-500/20">
                        <div className="flex items-center gap-2 text-sm font-semibold text-ai-700 dark:text-ai-300">
                          <FiTool className="w-4 h-4" /><span>{message.analysis.problem}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 dark:bg-gray-800/60">
                            <FiClock className="w-3 h-3" />
                            {message.analysis.urgency === 'high' ? '🔴 Urgent' : message.analysis.urgency === 'low' ? '🟢 Low' : '🟡 Normal'}
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 dark:bg-gray-800/60">
                            <FiDollarSign className="w-3 h-3" />{message.analysis.priceRange}
                          </span>
                        </div>
                        {(message.analysis.urgency === 'high' || message.analysis.urgency === 'emergency') && (
                          <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2 }}
                            className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 
                                       bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/30">
                            <FiAlertCircle className="w-4 h-4" />This issue needs immediate attention!
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <motion.button key={idx}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            onClick={() => handleSuggestionClick(suggestion, message.analysis)}
                            whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                            className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between group transition-all
                                       bg-gray-50 dark:bg-gray-700/50 hover:bg-ai-50 dark:hover:bg-ai-900/20
                                       border border-gray-200/50 dark:border-gray-600/30 hover:border-ai-300 dark:hover:border-ai-500/30
                                       text-gray-700 dark:text-gray-300">
                            <span>{suggestion}</span>
                            <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-ai-500" />
                          </motion.button>
                        ))}
                        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleProceedToBooking(message.analysis)}
                          className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm
                                     bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700
                                     text-white shadow-md shadow-secondary-500/20 flex items-center justify-center gap-2 transition-all">
                          <FiZap className="w-4 h-4" />Book Now — Quick Fix<FiArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 px-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ai-500 to-purple-600 
                                  flex items-center justify-center shadow-md shadow-ai-500/30 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-md border border-gray-100 dark:border-gray-700/50">
                    <AIThinkingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          {messages.length <= 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="px-4 pb-2">
              <p className="text-xs text-gray-400 mb-2 font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip) => (
                  <motion.button key={chip.text}
                    whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setInputText(chip.text)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium
                               bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750
                               text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700
                               hover:border-ai-300 dark:hover:border-ai-500/40
                               hover:from-ai-50 hover:to-purple-50 dark:hover:from-ai-900/20 dark:hover:to-purple-900/20
                               transition-all shadow-sm">
                    {chip.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="relative z-10 p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-gray-400 hover:text-ai-500 hover:bg-ai-50 dark:hover:bg-ai-900/20 transition-all">
                <FiCamera className="w-5 h-5" />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening ? 'bg-red-100 dark:bg-red-900/30 text-red-500 shadow-md shadow-red-500/20'
                    : 'text-gray-400 hover:text-ai-500 hover:bg-ai-50 dark:hover:bg-ai-900/20'}`}>
                {isListening ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                    <FiMic className="w-5 h-5" />
                  </motion.div>
                ) : <FiMic className="w-5 h-5" />}
              </motion.button>

              <input type="text" value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Describe your problem..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm
                           bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200
                           placeholder-gray-400 dark:placeholder-gray-500
                           border border-gray-200 dark:border-gray-700
                           focus:border-ai-400 dark:focus:border-ai-500
                           focus:ring-2 focus:ring-ai-400/20 dark:focus:ring-ai-500/20
                           outline-none transition-all" />

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                onClick={sendMessage} disabled={!inputText.trim()}
                className="p-2.5 rounded-xl text-white shadow-lg
                           bg-gradient-to-r from-ai-500 to-ai-600 hover:from-ai-600 hover:to-ai-700
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                           shadow-ai-500/30 transition-all">
                <FiSend className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Sparkles className="w-3 h-3 text-ai-400" />
              <span className="text-[10px] text-gray-400">Powered by FixKart AI • GPT-4</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;

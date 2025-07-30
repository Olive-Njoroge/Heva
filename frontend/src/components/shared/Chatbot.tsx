import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage } from '../../types';
import { Button } from '../ui/Button';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your HEVA assistant. I can help you with credit scoring questions, application guidance, and industry-specific advice. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: [
        'How is my credit score calculated?',
        'What documents do I need?',
        'Industry-specific guidance',
        'Application status'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Industry-specific responses
    if (lowerMessage.includes('fashion') || lowerMessage.includes('clothing') || lowerMessage.includes('design')) {
      return {
        id: Date.now().toString(),
        text: 'For fashion professionals, we consider seasonal revenue patterns, social media following, pre-order cycles, and portfolio diversity. Your Instagram engagement and seasonal collection performance significantly impact your credit assessment.',
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Tell me about seasonal patterns', 'Social media impact', 'Portfolio requirements']
      };
    }
    
    if (lowerMessage.includes('film') || lowerMessage.includes('movie') || lowerMessage.includes('production')) {
      return {
        id: Date.now().toString(),
        text: 'Film professionals benefit from our project-based income evaluation. We assess grant history, festival acceptances, distribution deals, and production track records. Irregular income from film releases is properly weighted in our scoring model.',
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Grant funding impact', 'Festival acceptance value', 'Production history']
      };
    }
    
    if (lowerMessage.includes('music') || lowerMessage.includes('musician') || lowerMessage.includes('artist')) {
      return {
        id: Date.now().toString(),
        text: 'For musicians, we evaluate streaming revenue, touring income, music licensing deals, and royalty patterns. Your Spotify monthly listeners, concert attendance, and licensing agreements all contribute to your credit profile.',
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Streaming revenue weight', 'Touring impact', 'Licensing deals']
      };
    }

    // General responses
    if (lowerMessage.includes('credit score') || lowerMessage.includes('score')) {
      return {
        id: Date.now().toString(),
        text: 'Your credit score is calculated using industry-specific factors: Financial History (35%), Creative Portfolio Performance (25%), Industry Stability (20%), Business Growth (15%), and Risk Factors (5%). Each industry has customized weightings.',
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['View detailed breakdown', 'Industry comparisons', 'Improvement tips']
      };
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('paperwork')) {
      return {
        id: Date.now().toString(),
        text: 'Required documents vary by industry but typically include: Financial statements (last 12 months), Portfolio samples, Client testimonials, and Business registration. Fashion designers need seasonal reports, while filmmakers need production budgets.',
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Industry-specific docs', 'Upload requirements', 'Verification process']
      };
    }
    
    if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
      return {
        id: Date.now().toString(),
        text: 'The application process has 4 steps: Business Information, Financial Data, Portfolio & Projects, and Review & Submit. Each step is tailored to your creative industry with relevant questions and requirements.',
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Start application', 'Check status', 'Required time']
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: 'I can help you with credit scoring questions, application guidance, document requirements, and industry-specific advice. What would you like to know more about?',
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: [
        'Credit score calculation',
        'Application process',
        'Document requirements',
        'Industry guidance'
      ]
    };
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">HEVA Assistant</h3>
                  <p className="text-xs opacity-90">Creative Industry Expert</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    {message.quickReplies && (
                      <div className="mt-2 space-y-1">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="block w-full text-left text-xs p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about credit scoring, applications..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="submit" size="sm" disabled={!inputValue.trim()}>
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
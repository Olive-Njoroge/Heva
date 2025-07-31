import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareX, Send, Bot, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  type: 'incoming' | 'outgoing';
  timestamp: Date;
}

interface ChatbotProps {
  apiEndpoint?: string; // Your backend endpoint
  className?: string;
}

export default function Chatbot({ 
  apiEndpoint = '/api/chat', // Default endpoint - replace with your backend URL
  className = '' 
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(true); // Start open for demo
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hi there👋\nHow can I help you today?',
      type: 'incoming',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '25px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [inputValue]);

  const generateResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      
      // Call your backend API instead of directly calling Gemini
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          // Add any other data your backend needs
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assuming your backend returns { response: "AI response text" }
      const aiResponse = data.response || data.message || "No response received.";
      
      // Update the thinking message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === 'thinking' 
            ? { ...msg, message: aiResponse, id: Date.now().toString() }
            : msg
        )
      );
      
    } catch (error) {
      console.error('Error:', error);
      
      // Update thinking message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === 'thinking' 
            ? { 
                ...msg, 
                message: "Sorry, I encountered an error processing your request. Please try again later.",
                id: Date.now().toString() 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      type: 'outgoing',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Add thinking message after a short delay
    setTimeout(() => {
      const thinkingMessage: ChatMessage = {
        id: 'thinking',
        message: 'Thinking...',
        type: 'incoming',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, thinkingMessage]);
      generateResponse(message);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-0 right-0 z-50 ${className}`}>
      {/* Chatbot Toggler Button */}
      <button
        onClick={toggleChatbot}
        className="fixed right-4 bottom-5 h-14 w-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full border-none cursor-pointer flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{ 
          boxShadow: '-2px 9px 21px rgba(0, 0, 0, 0.3)',
        }}
      >
        <MessageCircle size={24} className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 absolute' : 'opacity-100'}`} />
        <MessageCircle size={24} className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`} />
      </button>

      {/* Chatbot Window */}
      <div
        className={`fixed right-10 bottom-20 w-[480px] max-w-[calc(100vw-20px)] bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen 
            ? 'transform scale-100 opacity-100 pointer-events-auto' 
            : 'transform scale-50 opacity-0 pointer-events-none'
        }`}
        style={{ 
          boxShadow: '-2px 9px 21px rgba(0, 0, 0, 0.3)',
          maxHeight: '600px'
        }}
      >
        {/* Header */}
        <header className="bg-purple-600 px-6 py-4 text-center relative">
          <h2 className="text-white text-xl font-semibold">AI Assistant</h2>
          <button
            onClick={closeChatbot}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:bg-purple-700 rounded p-1 transition-colors md:hidden"
          >
            <MessageSquareX size={20} />
          </button>
        </header>

        {/* Chat Messages */}
        <div
          ref={chatboxRef}
          className="h-96 overflow-y-auto p-4 space-y-4"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}
        >
          {messages.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${chat.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[75%] ${chat.type === 'outgoing' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {chat.type === 'incoming' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center mb-1">
                    <Bot size={16} />
                  </div>
                )}
                
                <div
                  className={`px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    chat.type === 'outgoing'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {chat.message}
                  </div>
                  {chat.id === 'thinking' && isLoading && (
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end space-x-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a message..."
              className="flex-1 resize-none border-none outline-none text-sm py-3 px-0 min-h-[25px] max-h-[100px] leading-5"
              style={{ height: '25px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`flex-shrink-0 text-purple-600 cursor-pointer p-2 rounded-lg transition-all ${
                inputValue.trim() && !isLoading
                  ? 'hover:bg-purple-50 opacity-100' 
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 490px) {
          .chatbot-mobile {
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            max-width: none !important;
          }
          .chatbot-mobile .chatbox {
            height: calc(100vh - 120px) !important;
          }
        }
      `}</style>
    </div>
  );
}
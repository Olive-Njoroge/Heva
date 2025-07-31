import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareX, Send, Bot, MessageCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { chatService, ChatMessage, ChatResponse } from '../services/chatService';

interface ChatMessageType {
  id: string;
  message: string;
  type: 'incoming' | 'outgoing';
  timestamp: Date;
  isError?: boolean;
}

interface ChatbotProps {
  userId?: string;
  className?: string;
  initialOpen?: boolean;
}

export default function Chatbot({ 
  userId = 'anonymous',
  className = '',
  initialOpen = false
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      message: 'Hi there👋\nHow can I help you today?',
      type: 'incoming',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
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

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      await chatService.checkStatus();
      setIsOnline(true);
      setConnectionError(null);
    } catch (error) {
      setIsOnline(false);
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      console.error('API status check failed:', error);
    }
  };

  const generateResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      setConnectionError(null);

      const chatData: ChatMessage = {
        message: userMessage,
        userId,
        conversationId
      };

      const response: ChatResponse = await chatService.sendMessage(chatData);

      if (response.success && response.response) {
        // Update conversation ID if provided
        if (response.conversationId) {
          setConversationId(response.conversationId);
        }

        // Update the thinking message with actual response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === 'thinking' 
              ? { 
                  ...msg, 
                  message: response.response!,
                  id: Date.now().toString(),
                  timestamp: new Date(response.timestamp || Date.now())
                }
              : msg
          )
        );

        setIsOnline(true);
      } else {
        throw new Error(response.error || 'No response received from server');
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Sorry, I encountered an error processing your request. Please try again later.';
      
      // Update thinking message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === 'thinking' 
            ? { 
                ...msg, 
                message: errorMessage,
                id: Date.now().toString(),
                isError: true
              }
            : msg
        )
      );

      // Set connection status
      if (errorMessage.includes('timeout') || errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setIsOnline(false);
        setConnectionError('Connection issues detected');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Check if we're online
    if (!isOnline) {
      // Try to reconnect first
      await checkApiStatus();
      if (!isOnline) {
        alert('Unable to connect to the chat service. Please check your internet connection and try again.');
        return;
      }
    }

    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      message,
      type: 'outgoing',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Add thinking message after a short delay
    setTimeout(() => {
      const thinkingMessage: ChatMessageType = {
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
    // Check status when opening
    if (!isOpen) {
      checkApiStatus();
    }
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const retryConnection = () => {
    checkApiStatus();
  };

  return (
    <div className={`fixed bottom-0 right-0 z-50 ${className}`}>
      {/* Chatbot Toggler Button */}
      <button
        onClick={toggleChatbot}
        className={`fixed right-4 bottom-5 h-14 w-14 ${
          isOnline ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
        } text-white rounded-full border-none cursor-pointer flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
        style={{ 
          boxShadow: '-2px 9px 21px rgba(0, 0, 0, 0.3)',
        }}
        title={isOnline ? 'Open chat' : 'Connection issues detected'}
      >
        <MessageCircle size={24} className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 absolute' : 'opacity-100'}`} />
        <MessageCircle size={24} className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`} />
        
        {/* Connection status indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
          isOnline ? 'bg-green-400' : 'bg-red-400'
        } border-2 border-white`}>
          {isOnline ? <Wifi size={8} className="text-white m-0.5" /> : <WifiOff size={8} className="text-white m-0.5" />}
        </div>
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
        <header className={`${isOnline ? 'bg-purple-600' : 'bg-red-600'} px-6 py-4 text-center relative`}>
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-white text-xl font-semibold">AI Assistant</h2>
            {isOnline ? (
              <Wifi size={16} className="text-white" />
            ) : (
              <WifiOff size={16} className="text-white" />
            )}
          </div>
          
          {connectionError && (
            <p className="text-white/80 text-xs mt-1">{connectionError}</p>
          )}
          
          <button
            onClick={closeChatbot}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:bg-black/20 rounded p-1 transition-colors md:hidden"
          >
            <MessageSquareX size={20} />
          </button>
        </header>

        {/* Connection Error Banner */}
        {!isOnline && (
          <div className="bg-red-50 border-l-4 border-red-400 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-400 mr-2" />
                <p className="text-sm text-red-700">Connection lost</p>
              </div>
              <button
                onClick={retryConnection}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

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
                  <div className={`flex-shrink-0 w-8 h-8 ${chat.isError ? 'bg-red-600' : 'bg-purple-600'} text-white rounded flex items-center justify-center mb-1`}>
                    {chat.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                  </div>
                )}
                
                <div
                  className={`px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    chat.type === 'outgoing'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : chat.isError
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-sm'
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
              placeholder={isOnline ? "Enter a message..." : "Reconnecting..."}
              className="flex-1 resize-none border-none outline-none text-sm py-3 px-0 min-h-[25px] max-h-[100px] leading-5"
              style={{ height: '25px' }}
              disabled={isLoading || !isOnline}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isOnline}
              className={`flex-shrink-0 cursor-pointer p-2 rounded-lg transition-all ${
                inputValue.trim() && !isLoading && isOnline
                  ? 'text-purple-600 hover:bg-purple-50 opacity-100' 
                  : 'text-gray-400 opacity-50 cursor-not-allowed'
              }`}
              title={!isOnline ? 'Cannot send message while offline' : 'Send message'}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
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
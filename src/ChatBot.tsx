import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Send, X, Loader, AlertCircle, Wine, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import DOMPurify from 'dompurify';

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
}

interface ChatBotProps {
  onClose: () => void;
}

const API_ENDPOINT = 'https://api.mindstudio.ai/developer/v2/apps/run';
const API_KEY = 'sk524a79fde4e773176fe3371d40e9e4e7e23e25f0577babcb0e5a2ec9fee3b3172bb9719f835af28f886ef9bf9a02327786308d63704449ca43d9c88a9fb91a03';

const ChatBot = forwardRef<{ focusInput: () => void }, ChatBotProps>(({ onClose }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!isLoading && messages.length > 0 && !messages[messages.length - 1].isUser) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          appId: "5d1e66d0-9c29-4771-9eeb-cbbafe30b22a",
          variables: {
            topic: input,
            context: context
          },
          workflow: "pocket-somm.flow"
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data && data.success && data.result) {
        const botResponse = typeof data.result === 'string' ? data.result : data.result.response || JSON.stringify(data.result);
        setMessages([...newMessages, { text: botResponse, isUser: false }]);
        setContext(context + `\nHuman: ${input}\nAI: ${botResponse}`);
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setMessages([...newMessages, { text: 'Sorry, there was an error processing your request. Please try again later.', isUser: false, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setContext('');
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-chardonnay-100 text-wine-800'}`}>
      <div className="flex justify-between items-center p-3 md:p-4 bg-wine-600 text-white">
        <h2 className="text-lg md:text-xl font-bold flex items-center">
          <Wine size={20} className="mr-2" />
          Pocket Somm
        </h2>
        <div className="flex items-center">
          <button 
            onClick={clearChat} 
            className="text-white hover:text-gray-200 mr-2 p-2 rounded-full bg-wine-700 hover:bg-wine-800 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 p-1 rounded transition-colors"
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-3 md:p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 md:mb-4 ${
              message.isUser ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.isUser
                  ? 'bg-wine-600 text-white'
                  : message.isError
                  ? 'bg-red-100 text-red-700'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-chardonnay-200 text-wine-800'
              }`}
            >
              {message.isError && (
                <AlertCircle size={14} className="inline-block mr-1" />
              )}
              {message.isUser ? (
                message.text
              ) : (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.text) }} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={`p-3 md:p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-chardonnay-200'}`}>
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about wine, beer, spirits, or service..."
            className={`flex-grow mr-2 p-2 border rounded ${
              theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-wine-800 border-chardonnay-300'
            }`}
            disabled={isLoading}
            ref={inputRef}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-wine-600 text-white p-2 rounded hover:bg-wine-700 transition-colors"
          >
            {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatBot;
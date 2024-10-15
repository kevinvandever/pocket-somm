import React, { useState, useRef } from 'react';
import ChatBot from './ChatBot';
import { Sun, Moon, Wine } from 'lucide-react';
import { ThemeProvider, useTheme } from './ThemeContext';

function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const chatBotRef = useRef<{ focusInput: () => void } | null>(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setTimeout(() => chatBotRef.current?.focusInput(), 0);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative p-4 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-chardonnay-100 text-wine-800'}`}>
      <h1 className={`text-3xl md:text-4xl font-bold text-center mb-2 flex items-center justify-center ${theme === 'dark' ? 'text-wine-300' : 'text-wine-700'}`}>
        Pocket Somm <Wine size={28} className="ml-2" />
      </h1>
      <h2 className={`text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6 ${theme === 'dark' ? 'text-wine-400' : 'text-wine-600'}`}>
        Master Sommelier at Your Finger Tips
      </h2>
      
      <p className="text-center max-w-xs md:max-w-2xl mb-6 md:mb-8 text-sm md:text-base">
        Need a wine to go with dinner...or breakfast? Want to know which stemware to use? Perhaps you'd like to know the difference in soil between two wine regions. Or maybe it's beer, spirits, cocktails, or the alcohol service industry that interests you. Well, you've come to the right place. Let Pocket Somm answer those burning questions from the comfort of your device.
      </p>
      
      <button
        onClick={toggleChat}
        className="bg-wine-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-wine-700 transition-colors text-lg font-semibold flex items-center"
      >
        <Wine size={20} className="mr-2" />
        Uncork Your Curiosity
      </button>
      
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-11/12 max-w-4xl h-5/6 rounded-lg shadow-lg overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-gray-700' : 'bg-chardonnay-100'}`}>
            <ChatBot onClose={toggleChat} ref={chatBotRef} />
          </div>
        </div>
      )}
      
      <button
        onClick={toggleTheme}
        className={`fixed top-2 right-2 md:top-4 md:right-4 p-2 rounded-full shadow-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-chardonnay-200 text-wine-800 hover:bg-chardonnay-300'}`}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
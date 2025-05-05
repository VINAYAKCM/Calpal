import React, { useState, useRef, useEffect } from 'react';

function ChatBot({ userStats }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending request to Ollama...'); // Debug log
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: `You are a friendly nutrition and fitness assistant. You have access to the following user information, but only use it when relevant to the specific question asked:

User Stats:
- BMI: ${userStats.bmi} (${userStats.category})
- Current Weight: ${userStats.weight}kg
- Height: ${userStats.height}cm
- Age: ${userStats.age}
- Gender: ${userStats.gender}
- Daily Calorie Target: ${userStats.dailyTarget} kcal

User Question: "${inputMessage}"

Guidelines:
1. Only provide information that directly answers the user's question
2. If the question is a greeting or general, respond naturally without mentioning their stats
3. Only give health/fitness advice when specifically asked
4. Keep responses friendly but concise
5. Use their stats only when the question is related to diet, exercise, or health goals

Remember: Don't give a full health assessment unless specifically requested.`,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ollama response:', data); // Debug log
      
      if (!data.response) {
        throw new Error('No response from Ollama');
      }

      const botMessage = {
        type: 'bot',
        content: data.response
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = {
        type: 'bot',
        content: `I apologize, but I'm having trouble connecting to the AI service. Please ensure Ollama is running and try again. Error: ${error.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border-2 border-white bg-[#212D27] flex items-center justify-center text-white hover:bg-opacity-80 transition-colors"
      >
        {isOpen ? '×' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[32rem] bg-[#212D27] rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#1A2420] text-white p-4">
            <h3 className="font-medium">Nutrition Assistant</h3>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-4">
                Hi! I'm your nutrition assistant. Ask me about:
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Personalized meal suggestions</li>
                  <li>• Exercise recommendations</li>
                  <li>• Diet plans for your goals</li>
                  <li>• Nutrition advice</li>
                </ul>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-[#1A2420] text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-white/10 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Thinking</div>
                    <div className="flex space-x-1">
                      <div className="animate-bounce delay-100">.</div>
                      <div className="animate-bounce delay-200">.</div>
                      <div className="animate-bounce delay-300">.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about nutrition or exercise..."
                className="flex-1 p-2 rounded-md bg-[#1A2420] text-white border border-white/20 focus:outline-none focus:border-white/40 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-white text-[#212D27] rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}

export default ChatBot; 
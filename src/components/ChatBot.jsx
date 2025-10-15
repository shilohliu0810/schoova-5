import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const ChatBot = ({ onScheduleTask }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm Schoova, your AI scheduling assistant. 👋 What task would you like me to help you schedule?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState('TASK_NAME');
  const [taskData, setTaskData] = useState({
    name: '',
    timeCommitment: '',
    dueDate: '',
    description: ''
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (sender, text) => {
    const newMessage = {
      id: messages.length + 1,
      sender,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    addMessage('user', inputValue);
    const userInput = inputValue.trim();
    setInputValue('');

    // Process based on conversation state
    setTimeout(() => {
      processUserInput(userInput);
    }, 500);
  };

  const processUserInput = (input) => {
    switch (conversationState) {
      case 'TASK_NAME':
        setTaskData(prev => ({ ...prev, name: input }));
        addMessage('bot', `Great! "${input}" sounds important. How many hours do you think you'll need to complete this task? (e.g., 2, 3.5, 4)`);
        setConversationState('TIME_COMMITMENT');
        break;

      case 'TIME_COMMITMENT':
        const hours = parseFloat(input);
        if (isNaN(hours) || hours <= 0 || hours > 20) {
          addMessage('bot', "Hmm, that doesn't look like a valid number of hours. Please enter a number between 0.5 and 20 hours.");
          return;
        }
        setTaskData(prev => ({ ...prev, timeCommitment: hours }));
        addMessage('bot', `Got it, ${hours} hour${hours !== 1 ? 's' : ''}. When is this task due? Please provide a date (e.g., 2025-10-20, tomorrow, next Friday)`);
        setConversationState('DUE_DATE');
        break;

      case 'DUE_DATE':
        const date = parseDateInput(input);
        if (!date) {
          addMessage('bot', "I couldn't understand that date. Could you try again? Use a format like YYYY-MM-DD (e.g., 2025-10-20) or say 'tomorrow' or 'next week'.");
          return;
        }
        setTaskData(prev => ({ ...prev, dueDate: date }));
        addMessage('bot', `Perfect! Due date set to ${formatDate(date)}. Would you like to break this task into subtasks? (e.g., "outline, draft, revise" or just say "no" to skip)`);
        setConversationState('SUBTASKS');
        break;

      case 'SUBTASKS':
        const lowerInput = input.toLowerCase();
        if (lowerInput === 'no' || lowerInput === 'skip' || lowerInput === 'none') {
          setTaskData(prev => ({ ...prev, description: '' }));
        } else {
          setTaskData(prev => ({ ...prev, description: input }));
        }
        
        // Generate schedule
        const finalTask = {
          ...taskData,
          description: lowerInput === 'no' || lowerInput === 'skip' || lowerInput === 'none' ? '' : input
        };
        
        addMessage('bot', `✨ Awesome! Let me analyze your schedule and find the best time slots for "${finalTask.name}". I'll highlight them on your calendar in just a moment...`);
        
        setTimeout(() => {
          onScheduleTask(finalTask);
          addMessage('bot', "🎯 Done! Check out the orange highlighted blocks on your calendar below. You can accept or reject each suggestion. Want to schedule another task? Just type the task name!");
          setConversationState('TASK_NAME');
          setTaskData({ name: '', timeCommitment: '', dueDate: '', description: '' });
        }, 1000);
        break;

      default:
        break;
    }
  };

  const parseDateInput = (input) => {
    const lowerInput = input.toLowerCase().trim();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Handle relative dates
    if (lowerInput === 'today') {
      return today.toISOString().split('T')[0];
    }
    
    if (lowerInput === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    if (lowerInput.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split('T')[0];
    }

    // Handle day names (e.g., "next monday")
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < dayNames.length; i++) {
      if (lowerInput.includes(dayNames[i])) {
        const targetDay = i;
        const currentDay = today.getDay();
        let daysUntil = targetDay - currentDay;
        if (daysUntil <= 0) daysUntil += 7; // Next occurrence
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + daysUntil);
        return targetDate.toISOString().split('T')[0];
      }
    }

    // Try parsing as ISO date (YYYY-MM-DD)
    const isoMatch = input.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const date = new Date(input);
      if (!isNaN(date.getTime()) && date >= today) {
        return input;
      }
    }

    // Try parsing MM/DD or MM/DD/YYYY
    const slashMatch = input.match(/(\d{1,2})\/(\d{1,2})(\/(\d{2,4}))?/);
    if (slashMatch) {
      const month = parseInt(slashMatch[1]) - 1;
      const day = parseInt(slashMatch[2]);
      const year = slashMatch[4] ? parseInt(slashMatch[4]) : today.getFullYear();
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && date >= today) {
        return date.toISOString().split('T')[0];
      }
    }

    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 flex flex-col" style={{ height: '500px' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
        <Bot className="text-white" size={24} />
        <div>
          <h2 className="text-xl font-bold text-white">Schoova AI Assistant</h2>
          <p className="text-xs text-orange-100">Chat with me to schedule your tasks</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'bot' ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              {message.sender === 'bot' ? (
                <Bot size={18} className="text-white" />
              ) : (
                <User size={18} className="text-white" />
              )}
            </div>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'bot'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'bot' ? 'text-gray-500' : 'text-blue-100'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            autoFocus
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition duration-200 flex items-center justify-center"
            disabled={!inputValue.trim()}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Be natural! I understand dates like "tomorrow", "next Monday", or "2025-10-20"
        </p>
      </form>
    </div>
  );
};

export default ChatBot;

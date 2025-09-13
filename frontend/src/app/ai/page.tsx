'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  Code, 
  Calculator, 
  Lightbulb,
  MessageCircle,
  Zap,
  Brain,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export default function AITutorPage() {
  const { success, error: showError, info } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showSubjects, setShowSubjects] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const subjects: Subject[] = [
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Python, JavaScript, React, and more'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'from-purple-500 to-pink-500',
      description: 'Algebra, Calculus, Statistics'
    },
    {
      id: 'general',
      name: 'General Learning',
      icon: BookOpen,
      color: 'from-green-500 to-teal-500',
      description: 'Any topic you want to learn'
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      description: 'Step-by-step guidance'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, subject?: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock AI responses based on subject and message content
    const responses = {
      programming: [
        "Great question! Let me help you understand this programming concept. Here's how you can approach it:\n\n```javascript\nfunction example() {\n  console.log('Hello, World!');\n}\n```\n\nThis demonstrates the basic syntax. Would you like me to explain any specific part?",
        "I see you're working on a coding problem! Let me break this down step by step:\n\n1. First, let's identify the problem\n2. Then we'll plan our approach\n3. Finally, we'll implement the solution\n\nWhat specific part would you like me to focus on?",
        "That's an excellent programming question! Here's a practical example that should help clarify things:\n\n```python\ndef solve_problem(data):\n    result = process_data(data)\n    return result\n```\n\nThe key principle here is to break complex problems into smaller, manageable functions."
      ],
      mathematics: [
        "Excellent math question! Let me work through this with you step by step:\n\n**Step 1:** Identify what we know\n**Step 2:** Apply the appropriate formula\n**Step 3:** Solve systematically\n\nFor example: f(x) = 2x + 3\n\nWould you like me to explain any particular step in more detail?",
        "I love helping with math! This type of problem is best solved using:\n\n• **Method 1:** Direct calculation\n• **Method 2:** Using properties and theorems\n• **Method 3:** Graphical interpretation\n\nWhich approach would you prefer to explore?",
        "Great mathematical thinking! Here's how we can approach this:\n\n∫ 2x dx = x² + C\n\nThe fundamental theorem of calculus tells us that integration and differentiation are inverse operations. Let me know if you'd like to dive deeper into any concept!"
      ],
      general: [
        "That's a fascinating topic! I'd be happy to help you learn about this. Let me break it down into digestible concepts:\n\n🎯 **Key Points:**\n• Understanding the fundamentals\n• Connecting to real-world applications\n• Building on previous knowledge\n\nWhat specific aspect interests you most?",
        "Wonderful question! Learning is all about making connections. Here's how I like to think about this topic:\n\n**Foundation → Application → Mastery**\n\nEach step builds on the previous one. Which level would you like to start with?",
        "I'm excited to explore this with you! This topic connects to many other areas of knowledge:\n\n🌟 **Related concepts:**\n- Historical context\n- Modern applications  \n- Future implications\n\nWhere shall we begin our exploration?"
      ]
    };

    const subjectResponses = responses[subject as keyof typeof responses] || responses.general;
    const randomResponse = subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
    
    return randomResponse;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      subject: selectedSubject?.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage, selectedSubject?.id);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        subject: selectedSubject?.name
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      showError(
        'AI Tutor Error',
        'Sorry, I encountered an issue processing your question. Please try again.'
      );
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

  const formatMessage = (content: string) => {
    // Simple formatting for code blocks and bold text
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('```')) {
          return null; // Skip code fence markers
        }
        
        if (line.trim().startsWith('```') || line.includes('```')) {
          return (
            <pre key={index} className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2">
              <code className="text-sm font-mono">
                {line.replace(/```\w*/, '').replace(/```/, '')}
              </code>
            </pre>
          );
        }
        
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={index} className="font-bold my-1">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 my-1">
              {line.substring(2)}
            </li>
          );
        }
        
        return line.trim() ? (
          <p key={index} className="my-1">
            {line}
          </p>
        ) : (
          <br key={index} />
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Tutor</h1>
            <Sparkles className="h-6 w-6 text-accent-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your personal AI learning companion. Ask questions, get explanations, and accelerate your learning journey.
          </p>
        </motion.div>

        {/* Subject Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-brand-600" />
                <span className="font-medium text-gray-700">Subject:</span>
                {selectedSubject ? (
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${selectedSubject.color}`}>
                      <selectedSubject.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-900 font-medium">{selectedSubject.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select a subject to get started</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubjects(!showSubjects)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <span className="text-sm font-medium">Change</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showSubjects ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>

            <AnimatePresence>
              {showSubjects && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"
                >
                  {subjects.map((subject) => (
                    <motion.button
                      key={subject.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setShowSubjects(false);
                        success(
                          `${subject.name} selected!`, 
                          `I'm ready to help you learn ${subject.name.toLowerCase()}. Ask me anything!`
                        );
                      }}
                      className="p-3 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color} w-fit mb-2`}>
                        <subject.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{subject.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{subject.description}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg h-96 md:h-[500px] flex flex-col"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">
                    Start a conversation!
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Ask me anything about {selectedSubject?.name.toLowerCase() || 'your chosen subject'}.
                    I'm here to help you learn and understand.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-sm md:max-w-md lg:max-w-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    } rounded-2xl px-4 py-3`}>
                      <div className="text-sm leading-relaxed">
                        {message.sender === 'ai' ? formatMessage(message.content) : message.content}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>

                    {message.sender === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedSubject ? 
                    `Ask me about ${selectedSubject.name.toLowerCase()}...` : 
                    'Select a subject and start asking questions...'
                  }
                  disabled={!selectedSubject || isLoading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !selectedSubject || isLoading}
                className="p-3 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-2xl hover:from-brand-700 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Zap className="h-5 w-5 animate-pulse" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-800">Pro Tip</span>
            </div>
            <p className="text-sm text-gray-600">Be specific with your questions for better, more targeted answers.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-800">Code Help</span>
            </div>
            <p className="text-sm text-gray-600">I can help debug code, explain concepts, and suggest improvements.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gray-800">Learning</span>
            </div>
            <p className="text-sm text-gray-600">Ask follow-up questions to deepen your understanding of any topic.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
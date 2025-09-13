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
  RotateCcw,
  FileText,
  PenTool,
  Target,
  Clock,
  TrendingUp,
  Award,
  Play,
  Pause,
  Volume2,
  Image,
  Mic,
  Camera,
  Share,
  Download,
  Bookmark,
  Star,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Upload,
  Paperclip,
  Search,
  Filter,
  MoreVertical,
  Layers
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  subject?: string;
  type?: 'text' | 'code' | 'math' | 'image' | 'quiz' | 'explanation';
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    topic?: string;
    codeLanguage?: string;
    confidence?: number;
  };
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  features: string[];
}

interface SmartFeature {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  action: () => void;
}

export default function SmartTutorPage() {
  const { success, error: showError, info } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showSubjects, setShowSubjects] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'history' | 'analytics'>('chat');
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    topicsExplored: 0,
    quizzesCompleted: 0,
    sessionTime: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects: Subject[] = [
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      color: 'from-blue-500 to-purple-600',
      description: 'Code help, debugging, algorithms',
      features: ['Code review', 'Debugging', 'Algorithm explanation', 'Best practices']
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'from-green-500 to-teal-600',
      description: 'Algebra, calculus, statistics',
      features: ['Step-by-step solutions', 'Graph plotting', 'Formula explanations', 'Practice problems']
    },
    {
      id: 'science',
      name: 'Science',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      description: 'Physics, chemistry, biology',
      features: ['Concept explanations', 'Lab simulations', 'Formula derivations', 'Visual diagrams']
    },
    {
      id: 'language',
      name: 'Language Arts',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      description: 'Writing, grammar, literature',
      features: ['Essay feedback', 'Grammar check', 'Literature analysis', 'Writing tips']
    },
    {
      id: 'business',
      name: 'Business',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-600',
      description: 'Economics, marketing, finance',
      features: ['Case studies', 'Financial analysis', 'Market research', 'Business plans']
    }
  ];

  const smartFeatures: SmartFeature[] = [
    {
      id: 'quiz',
      name: 'Generate Quiz',
      icon: Target,
      description: 'Create custom quizzes on any topic',
      color: 'bg-blue-500',
      action: () => window.open('/ai/quiz', '_blank')
    },
    {
      id: 'explain',
      name: 'Concept Explanation',
      icon: Lightbulb,
      description: 'Get detailed explanations of complex topics',
      color: 'bg-yellow-500',
      action: () => handleFeatureRequest('explain')
    },
    {
      id: 'solve',
      name: 'Problem Solver',
      icon: Calculator,
      description: 'Step-by-step problem solving',
      color: 'bg-green-500',
      action: () => handleFeatureRequest('solve')
    },
    {
      id: 'code',
      name: 'Code Assistant',
      icon: Code,
      description: 'Code review, debugging, and optimization',
      color: 'bg-purple-500',
      action: () => handleFeatureRequest('code')
    },
    {
      id: 'summary',
      name: 'Summarize Content',
      icon: FileText,
      description: 'Summarize articles, documents, or videos',
      color: 'bg-pink-500',
      action: () => handleFeatureRequest('summary')
    },
    {
      id: 'practice',
      name: 'Practice Problems',
      icon: PenTool,
      description: 'Generate practice exercises',
      color: 'bg-indigo-500',
      action: () => handleFeatureRequest('practice')
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Start session timer
    const timer = setInterval(() => {
      setSessionStats(prev => ({ ...prev, sessionTime: prev.sessionTime + 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFeatureRequest = (featureType: string) => {
    const prompts = {
      explain: "Please explain a concept in detail for me:",
      solve: "I need help solving this problem step-by-step:",
      code: "Please review this code and suggest improvements:",
      summary: "Please summarize this content for me:",
      practice: "Generate practice problems for me on the topic:"
    };

    setInputMessage(prompts[featureType as keyof typeof prompts] || '');
    inputRef.current?.focus();
  };

  const generateSmartResponse = (question: string, subject: Subject): string => {
    const lowerQuestion = question.toLowerCase();

    // Check for specific programming requests
    if (subject.id === 'programming') {
      if (lowerQuestion.includes('greeting') || lowerQuestion.includes('hello') || lowerQuestion.includes('greet')) {
        return `Here's a simple Python program to create greetings:

\`\`\`python
# Simple greeting program
def greet_user(name):
    """Function to greet a user"""
    return f"Hello, {name}! Welcome to our platform!"

def main():
    # Get user's name
    user_name = input("What's your name? ")

    # Generate greeting
    greeting = greet_user(user_name)
    print(greeting)

    # Different types of greetings
    greetings = [
        f"Hi {user_name}! Great to see you!",
        f"Welcome {user_name}! Hope you're having a good day!",
        f"Hey {user_name}! Ready to learn something new?"
    ]

    print("\\nHere are some other greeting options:")
    for i, greeting in enumerate(greetings, 1):
        print(f"{i}. {greeting}")

if __name__ == "__main__":
    main()
\`\`\`

This program demonstrates:
- **Functions**: How to create reusable greeting functions
- **User Input**: Getting names from users
- **String Formatting**: Using f-strings for dynamic messages
- **Lists**: Storing multiple greeting options
- **Loops**: Iterating through greeting options

Would you like me to show you how to make it more advanced with different languages or time-based greetings?`;
      }

      if (lowerQuestion.includes('code') && !lowerQuestion.includes('greeting')) {
        return `I'd be happy to help you with code! Could you be more specific about what you'd like to create?

Here are some common programming tasks I can help with:

**🔧 Common Requests:**
- Create functions for specific tasks
- Debug existing code
- Explain programming concepts
- Build small projects
- Code reviews and optimization

**Example Code Snippets:**

\`\`\`python
# Calculator function
def calculator(a, b, operation):
    operations = {
        '+': a + b,
        '-': a - b,
        '*': a * b,
        '/': a / b if b != 0 else "Cannot divide by zero"
    }
    return operations.get(operation, "Invalid operation")

# Usage
result = calculator(10, 5, '+')  # Returns 15
\`\`\`

\`\`\`javascript
// Array manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]
const filtered = numbers.filter(n => n > 3);  // [4, 5]
\`\`\`

What specific code would you like me to help you create?`;
      }

      if (lowerQuestion.includes('python') || lowerQuestion.includes('example')) {
        return `Here's a comprehensive Python example for you:

\`\`\`python
# Multi-purpose Python program
import datetime
import random

class SimpleProgram:
    def __init__(self):
        self.name = "Python Helper"
        self.version = "1.0"

    def greet_user(self):
        """Greet the user based on time of day"""
        current_hour = datetime.datetime.now().hour

        if current_hour < 12:
            greeting = "Good morning!"
        elif current_hour < 17:
            greeting = "Good afternoon!"
        else:
            greeting = "Good evening!"

        return f"{greeting} Welcome to {self.name} v{self.version}"

    def generate_random_tip(self):
        """Generate a random programming tip"""
        tips = [
            "Use meaningful variable names for better code readability",
            "Comment your code to help others understand your logic",
            "Break large functions into smaller, reusable functions",
            "Use version control (Git) to track your code changes",
            "Test your code regularly to catch bugs early"
        ]
        return random.choice(tips)

    def basic_calculator(self, num1, num2, operation):
        """Simple calculator function"""
        try:
            if operation == '+':
                return num1 + num2
            elif operation == '-':
                return num1 - num2
            elif operation == '*':
                return num1 * num2
            elif operation == '/':
                return num1 / num2 if num2 != 0 else "Cannot divide by zero"
            else:
                return "Invalid operation"
        except Exception as e:
            return f"Error: {e}"

# Usage example
if __name__ == "__main__":
    app = SimpleProgram()
    print(app.greet_user())
    print(f"\\nProgramming Tip: {app.generate_random_tip()}")
    print(f"\\nCalculation: 10 + 5 = {app.basic_calculator(10, 5, '+')}")
\`\`\`

This example shows:
- **Classes and Objects**: Object-oriented programming basics
- **Methods**: Functions inside classes
- **Date/Time handling**: Using datetime module
- **Error handling**: Try-except blocks
- **List operations**: Working with arrays of data
- **String formatting**: Creating dynamic messages

Would you like me to explain any specific part or create a different type of program?`;
      }
    }

    // Generic fallback responses
    const responses = {
      programming: [
        "I'd love to help you with programming! Could you please be more specific about what you'd like to create or learn? For example:\n\n• Need help with a specific programming language?\n• Want to build a particular type of program?\n• Looking for code examples?\n• Need debugging assistance?\n\nJust let me know exactly what you're working on!",
        "Great! I'm here to help with your programming needs. What specific coding challenge are you facing? I can help with:\n\n• Writing functions and classes\n• Debugging code issues\n• Explaining programming concepts\n• Code reviews and best practices\n• Building small projects\n\nWhat would you like to work on?"
      ],
      mathematics: [
        "I'd be happy to help you with math! What specific mathematical problem or concept would you like me to explain? I can help with:\n\n• Step-by-step problem solving\n• Explaining mathematical concepts\n• Algebraic equations\n• Calculus problems\n• Statistics and probability\n\nPlease share your specific question!",
        "Let me help you with mathematics! What particular math topic or problem are you working on? I can provide:\n\n• Detailed solutions with explanations\n• Visual representations of concepts\n• Practice problems\n• Formula explanations\n• Real-world applications\n\nWhat math challenge can I help you solve?"
      ],
      science: [
        "I'm excited to help with your science question! What specific scientific concept or phenomenon would you like me to explain? I can cover:\n\n• Physics principles and laws\n• Chemical reactions and processes\n• Biological systems and functions\n• Scientific methodology\n• Real-world applications\n\nWhat scientific topic interests you?",
        "Great science question incoming! What particular aspect of science would you like to explore? I can help explain:\n\n• Complex scientific concepts in simple terms\n• How scientific principles work in everyday life\n• Experimental design and methodology\n• Latest scientific discoveries\n• Career paths in science\n\nWhat would you like to learn about?"
      ],
      language: [
        "I'm here to help with your language arts needs! What specific aspect of language, writing, or literature would you like assistance with? I can help with:\n\n• Essay writing and structure\n• Grammar and punctuation rules\n• Literary analysis and interpretation\n• Creative writing techniques\n• Reading comprehension strategies\n\nWhat language challenge can I help you tackle?",
        "Excellent! I love helping with language and literature. What particular writing or language topic are you working on? I can assist with:\n\n• Improving writing style and clarity\n• Analyzing literary works\n• Grammar and syntax explanations\n• Research and citation help\n• Public speaking and presentation skills\n\nWhat would you like to focus on?"
      ],
      business: [
        "Great to help with your business question! What specific business topic or challenge would you like to explore? I can help with:\n\n• Business plan development\n• Market analysis and research\n• Financial planning and budgeting\n• Marketing strategies\n• Leadership and management concepts\n\nWhat business area interests you most?",
        "Perfect! I'm ready to help with your business needs. What particular business concept or problem are you working on? I can provide insights on:\n\n• Entrepreneurship and startup advice\n• Business strategy and operations\n• Financial management\n• Marketing and sales techniques\n• Industry analysis and trends\n\nWhat business topic shall we dive into?"
      ]
    };

    const subjectResponses = responses[subject.id as keyof typeof responses] || responses.programming;
    return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
  };

  const detectMessageType = (message: string): Message['type'] => {
    if (message.includes('code') || message.includes('program') || message.includes('function')) return 'code';
    if (message.includes('math') || message.includes('equation') || message.includes('calculate')) return 'math';
    if (message.includes('quiz') || message.includes('test') || message.includes('questions')) return 'quiz';
    return 'text';
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      info(`File "${file.name}" uploaded successfully! I can help analyze this content.`);
      setShowFileUpload(false);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      info('Voice recording started. Speak your question...');
    } else {
      info('Voice recording stopped. Processing your question...');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedSubject) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      subject: selectedSubject.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Update stats
    setSessionStats(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
      topicsExplored: prev.topicsExplored + (Math.random() > 0.7 ? 1 : 0)
    }));

    // Simulate tutor response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateSmartResponse(inputMessage, selectedSubject),
        sender: 'ai',
        timestamp: new Date(),
        subject: selectedSubject.name,
        type: detectMessageType(inputMessage),
        metadata: {
          confidence: Math.round(85 + Math.random() * 15),
          difficulty: 'intermediate',
          topic: selectedSubject.name
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Learning Assistant</h1>
            <div className="flex items-center gap-1">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Advanced Learning Technology</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your intelligent learning companion. Get instant help, explanations, and personalized tutoring across all subjects.
          </p>
        </motion.div>

        {/* Subject Selection */}
        {!selectedSubject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Choose Your Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const IconComponent = subject.icon;
                return (
                  <motion.button
                    key={subject.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSubject(subject);
                      success(`${subject.name} tutor activated! Ask me anything.`);
                    }}
                    className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{subject.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{subject.description}</p>
                    <div className="space-y-1">
                      {subject.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main Interface */}
        {selectedSubject && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Tools & Features */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
                {/* Current Subject */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Active Subject</h3>
                    <button
                      onClick={() => setSelectedSubject(null)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedSubject.color} text-white`}>
                    <div className="flex items-center gap-2">
                      <selectedSubject.icon className="h-5 w-5" />
                      <span className="font-medium">{selectedSubject.name}</span>
                    </div>
                  </div>
                </div>

                {/* Session Stats */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Session Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Questions Asked</span>
                      <span className="font-medium">{sessionStats.questionsAsked}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Topics Explored</span>
                      <span className="font-medium">{sessionStats.topicsExplored}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Session Time</span>
                      <span className="font-medium">{formatTime(sessionStats.sessionTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Smart Features */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Smart Tools</h3>
                  <div className="space-y-2">
                    {smartFeatures.slice(0, 4).map((feature) => (
                      <button
                        key={feature.id}
                        onClick={feature.action}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg ${feature.color} flex items-center justify-center`}>
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{feature.name}</div>
                          <div className="text-xs text-gray-500">{feature.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedSubject.name} Smart Tutor</h3>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Online & Ready</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowFileUpload(!showFileUpload)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        title="Upload file"
                      >
                        <Paperclip className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={handleVoiceInput}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isRecording ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-500 mb-2">Start Learning!</h3>
                      <p className="text-gray-400 max-w-sm mx-auto">
                        Ask me anything about {selectedSubject.name.toLowerCase()}. I'm here to help you understand and learn.
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className={`max-w-xl ${message.sender === 'user' ? 'order-1' : ''}`}>
                        <div className={`p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-50 text-gray-900'
                        }`}>
                          <div className="prose prose-sm max-w-none">
                            {message.content.split('\n').map((line, index) => {
                              if (line.startsWith('```')) {
                                return null;
                              }
                              if (line.includes('**')) {
                                const parts = line.split('**');
                                return (
                                  <p key={index} className="mb-2">
                                    {parts.map((part, i) =>
                                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                    )}
                                  </p>
                                );
                              }
                              if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                                return <li key={index} className="ml-4">{line.substring(2)}</li>;
                              }
                              return line.trim() && <p key={index} className="mb-2">{line}</p>;
                            })}
                          </div>

                          {message.sender === 'ai' && message.metadata && (
                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 text-gray-500">
                                <span>Confidence: {message.metadata.confidence}%</span>
                                <span>•</span>
                                <span>{message.metadata.difficulty}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <ThumbsUp className="h-3 w-3" />
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <ThumbsDown className="h-3 w-3" />
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Processing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* File Upload Area */}
                <AnimatePresence>
                  {showFileUpload && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 p-4 bg-gray-50"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 cursor-pointer transition-colors duration-200"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload a file for analysis</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, images up to 10MB</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Ask me anything about ${selectedSubject.name.toLowerCase()}...`}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 focus:bg-white pr-12"
                      />
                      {isRecording && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
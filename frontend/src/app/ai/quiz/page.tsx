'use client';

import { useState } from 'react';
import { SparklesIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

export default function AIQuizPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    setIsGenerating(true);
    
    // Simulate API call with demo data
    setTimeout(() => {
      const demoQuiz: Quiz = {
        title: `${topic} Quiz - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`,
        description: `Test your knowledge of ${topic} with this AI-generated quiz.`,
        questions: [
          {
            id: 1,
            question: `What is a fundamental concept in ${topic}?`,
            options: [
              'Variables and data types',
              'Advanced algorithms',
              'Machine learning',
              'Quantum computing'
            ],
            correct_answer: 0,
            explanation: 'Variables and data types are fundamental building blocks in programming.'
          },
          {
            id: 2,
            question: `Which of the following is best practice when learning ${topic}?`,
            options: [
              'Skip the basics',
              'Practice regularly',
              'Only read theory',
              'Avoid hands-on coding'
            ],
            correct_answer: 1,
            explanation: 'Regular practice is essential for mastering any programming language or technology.'
          },
          {
            id: 3,
            question: `What makes ${topic} popular among developers?`,
            options: [
              'Complex syntax',
              'Limited applications',
              'Easy to learn and versatile',
              'Only for experts'
            ],
            correct_answer: 2,
            explanation: 'Most modern technologies are designed to be accessible and versatile for various applications.'
          },
          {
            id: 4,
            question: `When starting with ${topic}, what should be your first step?`,
            options: [
              'Build complex applications',
              'Learn syntax and basics',
              'Start with advanced topics',
              'Skip documentation'
            ],
            correct_answer: 1,
            explanation: 'Understanding syntax and basic concepts provides a solid foundation for learning.'
          },
          {
            id: 5,
            question: `What resource is most helpful when learning ${topic}?`,
            options: [
              'Only video tutorials',
              'Only books',
              'Combination of tutorials, practice, and documentation',
              'Only forums'
            ],
            correct_answer: 2,
            explanation: 'A combination of different learning resources provides the most comprehensive understanding.'
          }
        ]
      };
      
      setQuiz(demoQuiz);
      setIsGenerating(false);
      setUserAnswers({});
      setShowResults(false);
    }, 2000);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const getScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    return (correct / quiz.questions.length) * 100;
  };

  const resetQuiz = () => {
    setQuiz(null);
    setUserAnswers({});
    setShowResults(false);
    setTopic('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Quiz Generator</h1>
          <p className="text-xl text-gray-600">
            Generate personalized quizzes on any topic using our AI-powered system
          </p>
        </div>

        {!quiz ? (
          /* Quiz Generation Form */
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Quiz</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Python Programming, Mathematics, History..."
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <button
                onClick={generateQuiz}
                disabled={!topic.trim() || isGenerating}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Display */
          <div className="space-y-8">
            {/* Quiz Header */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
                <button
                  onClick={resetQuiz}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Generate New Quiz
                </button>
              </div>
              <p className="text-gray-600">{quiz.description}</p>
              
              {showResults && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Quiz Results</h3>
                  <p className="text-blue-800">
                    You scored {getScore().toFixed(0)}% ({quiz.questions.filter(q => userAnswers[q.id] === q.correct_answer).length}/{quiz.questions.length} correct)
                  </p>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswers[question.id] === optionIndex;
                      const isCorrect = optionIndex === question.correct_answer;
                      const shouldShowResults = showResults;
                      
                      return (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(question.id, optionIndex)}
                          disabled={shouldShowResults}
                          className={`w-full text-left p-4 border-2 rounded-lg transition-all flex items-center ${
                            shouldShowResults
                              ? isCorrect
                                ? 'border-green-500 bg-green-50'
                                : isSelected
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                              : isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="flex-grow">{option}</span>
                          {shouldShowResults && (
                            <span className="ml-2">
                              {isCorrect ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              ) : isSelected ? (
                                <XCircleIcon className="h-5 w-5 text-red-500" />
                              ) : null}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {showResults && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            {!showResults && (
              <div className="text-center">
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(userAnswers).length < quiz.questions.length}
                  className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  GraduationCap,
  Clock,
  Users,
  Star,
  IndianRupee,
  Play,
  CheckCircle,
  BookOpen,
  User,
  ArrowLeft,
  Award,
  Globe,
  Monitor,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface Course {
  id: number;
  title: string;
  description: string;
  short_description: string;
  thumbnail: string;
  price: string;
  discount_price: string;
  difficulty: string;
  duration_weeks: number;
  lessons_count: number;
  rating: string;
  total_ratings: number;
  tutor: {
    name: string;
    title: string;
    bio: string;
  };
  category: {
    name: string;
  };
  is_featured: boolean;
  curriculum: Array<{
    week: number;
    title: string;
    lessons: Array<{
      id: number;
      title: string;
      duration: string;
      is_free: boolean;
    }>;
  }>;
  requirements: string[];
  what_you_learn: string[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;
  const { success, error: showError, info } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/courses/${courseId}/`);
      const data = await response.json();
      
      if (response.ok) {
        setCourse(data);
      } else {
        // Demo course data based on courseId to match our courses listing
        const mockCourses = {
          1: {
            id: 1,
            title: 'Complete Python Programming',
            description: 'Master Python from basics to advanced concepts including web development, data science, and machine learning. This comprehensive course takes you from writing your first line of code to building real-world applications. You\'ll learn through hands-on projects, interactive coding exercises, and practical assignments that prepare you for a successful career in programming.',
            short_description: 'Learn Python programming from scratch with hands-on projects',
            thumbnail: '',
            price: '4999',
            discount_price: '2999',
            difficulty: 'beginner',
            duration_weeks: 12,
            lessons_count: 48,
            rating: '4.8',
            total_ratings: 1250,
            tutor: {
              name: 'Dr. Sarah Chen',
              title: 'Python Expert & Senior Software Engineer',
              bio: 'Dr. Sarah Chen has over 10 years of experience in software development and has been teaching Python for 8+ years. She has helped over 15,000 students master Python programming and has worked at top tech companies including Google and Microsoft.'
            },
            category: {
              name: 'Programming'
            },
            is_featured: true,
          },
          2: {
            id: 2,
            title: 'React & Next.js Masterclass',
            description: 'Build modern, scalable web applications with React, Next.js, and TypeScript. Learn component patterns, state management, server-side rendering, and deployment strategies. This course covers everything from React fundamentals to advanced Next.js features including API routes, middleware, and performance optimization.',
            short_description: 'Build professional web apps with React and Next.js',
            thumbnail: '',
            price: '5999',
            discount_price: '3999',
            difficulty: 'intermediate',
            duration_weeks: 10,
            lessons_count: 42,
            rating: '4.9',
            total_ratings: 890,
            tutor: {
              name: 'Alex Kumar',
              title: 'Full Stack Developer & React Specialist',
              bio: 'Alex is a senior full-stack developer with 12+ years of experience building web applications. He has worked with React since its early days and has been teaching modern web development for over 6 years.'
            },
            category: {
              name: 'Web Development'
            },
            is_featured: true,
          },
          3: {
            id: 3,
            title: 'Machine Learning Fundamentals',
            description: 'Dive into machine learning algorithms, data preprocessing, model training, and evaluation with Python and scikit-learn. This comprehensive course covers supervised and unsupervised learning, deep learning basics, and practical applications in real-world scenarios.',
            short_description: 'Learn ML algorithms and data science techniques',
            thumbnail: '',
            price: '7999',
            discount_price: '4999',
            difficulty: 'advanced',
            duration_weeks: 16,
            lessons_count: 56,
            rating: '4.7',
            total_ratings: 645,
            tutor: {
              name: 'Prof. Maria Rodriguez',
              title: 'AI Researcher & Data Science Professor',
              bio: 'Professor Rodriguez is a renowned AI researcher with 15+ years in machine learning. She has published over 50 research papers and has been teaching data science and ML at top universities worldwide.'
            },
            category: {
              name: 'Data Science'
            },
            is_featured: false,
          },
          4: {
            id: 4,
            title: 'UI/UX Design Bootcamp',
            description: 'Create beautiful and user-friendly interfaces using modern design principles, prototyping tools, and user research methods. Learn design thinking, wireframing, visual design, and usability testing to create exceptional user experiences.',
            short_description: 'Master UI/UX design with modern tools and techniques',
            thumbnail: '',
            price: '3999',
            discount_price: '2499',
            difficulty: 'beginner',
            duration_weeks: 8,
            lessons_count: 32,
            rating: '4.6',
            total_ratings: 432,
            tutor: {
              name: 'Emma Thompson',
              title: 'Senior UX Designer & Design Consultant',
              bio: 'Emma has 9+ years of experience in UI/UX design, working with startups and Fortune 500 companies. She has designed award-winning digital products and mentored over 5,000 designers worldwide.'
            },
            category: {
              name: 'Design'
            },
            is_featured: false,
          }
        };

        const selectedCourse = mockCourses[courseId as keyof typeof mockCourses] || mockCourses[1];
        setCourse({
          ...selectedCourse,
          curriculum: courseId === '1' ? [
            {
              week: 1,
              title: 'Python Fundamentals',
              lessons: [
                { id: 1, title: 'Introduction to Python', duration: '15 min', is_free: true },
                { id: 2, title: 'Setting up your development environment', duration: '20 min', is_free: true },
                { id: 3, title: 'Variables and Data Types', duration: '25 min', is_free: false },
                { id: 4, title: 'Numbers and Strings', duration: '30 min', is_free: false }
              ]
            },
            {
              week: 2,
              title: 'Control Structures',
              lessons: [
                { id: 5, title: 'Conditional Statements', duration: '30 min', is_free: false },
                { id: 6, title: 'Loops and Iterations', duration: '35 min', is_free: false },
                { id: 7, title: 'Functions and Modules', duration: '40 min', is_free: false },
                { id: 8, title: 'Error Handling', duration: '25 min', is_free: false }
              ]
            },
            {
              week: 3,
              title: 'Data Structures',
              lessons: [
                { id: 9, title: 'Lists and Tuples', duration: '30 min', is_free: false },
                { id: 10, title: 'Dictionaries and Sets', duration: '35 min', is_free: false },
                { id: 11, title: 'Working with Files', duration: '25 min', is_free: false },
                { id: 12, title: 'List Comprehensions', duration: '30 min', is_free: false }
              ]
            },
            {
              week: 4,
              title: 'Object-Oriented Programming',
              lessons: [
                { id: 13, title: 'Classes and Objects', duration: '45 min', is_free: false },
                { id: 14, title: 'Inheritance and Polymorphism', duration: '40 min', is_free: false },
                { id: 15, title: 'Advanced OOP Concepts', duration: '35 min', is_free: false },
                { id: 16, title: 'Project: Building a Class System', duration: '60 min', is_free: false }
              ]
            }
          ] : [
            {
              week: 1,
              title: 'Course Introduction',
              lessons: [
                { id: 1, title: 'Welcome to the Course', duration: '10 min', is_free: true },
                { id: 2, title: 'Course Overview and Structure', duration: '15 min', is_free: true },
                { id: 3, title: 'Setting up your Environment', duration: '20 min', is_free: false }
              ]
            },
            {
              week: 2,
              title: 'Core Concepts',
              lessons: [
                { id: 4, title: 'Understanding the Fundamentals', duration: '45 min', is_free: false },
                { id: 5, title: 'Practical Applications', duration: '50 min', is_free: false },
                { id: 6, title: 'Hands-on Project', duration: '60 min', is_free: false }
              ]
            }
          ],
          requirements: courseId === '1' ? [
            'No prior programming experience required',
            'A computer with internet connection',
            'Willingness to learn and practice coding daily',
            'Basic computer literacy'
          ] : [
            'Basic understanding of the subject area',
            'A computer with internet connection', 
            'Commitment to complete assignments',
            'Willingness to participate in discussions'
          ],
          what_you_learn: courseId === '1' ? [
            'Python syntax and programming fundamentals',
            'Data structures and algorithms in Python',
            'Object-oriented programming concepts',
            'File handling and data processing',
            'Web scraping and API integration',
            'Building real-world Python projects',
            'Best practices and code optimization',
            'Testing and debugging techniques'
          ] : selectedCourse.category.name === 'Web Development' ? [
            'Modern React development patterns',
            'Next.js app routing and features',
            'TypeScript for type-safe development',
            'State management with Context and Redux',
            'Server-side rendering and static generation',
            'API integration and data fetching',
            'Performance optimization techniques',
            'Deployment and production best practices'
          ] : selectedCourse.category.name === 'Data Science' ? [
            'Machine learning algorithms and concepts',
            'Data preprocessing and feature engineering',
            'Model training and evaluation techniques',
            'Statistical analysis and hypothesis testing',
            'Data visualization with Python libraries',
            'Deep learning fundamentals',
            'Real-world ML project implementation',
            'Model deployment and production'
          ] : [
            'User-centered design principles',
            'Design thinking methodology',
            'Wireframing and prototyping',
            'Visual design and typography',
            'Usability testing and user research',
            'Design systems and component libraries',
            'Accessibility and inclusive design',
            'Portfolio development and presentation'
          ]
        });
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollment = async () => {
    setIsEnrolling(true);
    info('Processing enrollment...', 'Please wait while we enroll you in this course');
    
    // Simulate enrollment process
    setTimeout(() => {
      success(
        'Enrollment successful!', 
        `Welcome to "${course?.title}"! You now have access to all course materials.`
      );
      setIsEnrolling(false);
      // In real app, redirect to course content or update UI to show enrolled state
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading course details...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link href="/courses">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-xl hover:from-brand-700 hover:to-accent-700 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to courses
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/courses">
            <motion.div
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to courses
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                {course.is_featured && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </motion.span>
                )}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}
                >
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700"
                >
                  {course.category.name}
                </motion.span>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                {course.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                {course.short_description}
              </motion.p>

              {/* Course Meta */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand-50">
                    <Clock className="h-4 w-4 text-brand-600" />
                  </div>
                  <span><span className="font-semibold">{course.duration_weeks}</span> weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent-50">
                    <BookOpen className="h-4 w-4 text-accent-600" />
                  </div>
                  <span><span className="font-semibold">{course.lessons_count}</span> lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-50">
                    <Users className="h-4 w-4 text-teal-600" />
                  </div>
                  <span><span className="font-semibold">{course.total_ratings.toLocaleString()}</span> students</span>
                </div>
              </motion.div>

              {/* Rating */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(parseFloat(course.rating))
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">{course.rating}</span>
                </div>
                <span className="text-gray-600">({course.total_ratings.toLocaleString()} reviews)</span>
              </motion.div>

              {/* Tutor Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border-t border-gray-100 pt-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-600" />
                  Your Instructor
                </h3>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {course.tutor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{course.tutor.name}</h4>
                    <p className="text-brand-600 font-medium mb-2">{course.tutor.title}</p>
                    <p className="text-gray-600 leading-relaxed">{course.tutor.bio}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Course Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-brand-600" />
                About this course
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{course.description}</p>
            </motion.div>

            {/* What you'll learn */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.what_you_learn.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Course Curriculum */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-brand-600" />
                Course curriculum
              </h2>
              <div className="space-y-4">
                {course.curriculum.map((week, weekIndex) => (
                  <motion.div 
                    key={week.week}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + weekIndex * 0.1 }}
                    className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-brand-50 to-accent-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                          {week.week}
                        </div>
                        Week {week.week}: {week.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {week.lessons.length} lessons • {week.lessons.reduce((acc, lesson) => {
                          const duration = parseInt(lesson.duration.split(' ')[0]);
                          return acc + duration;
                        }, 0)} min total
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {week.lessons.map((lesson, lessonIndex) => (
                        <motion.div 
                          key={lesson.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + weekIndex * 0.1 + lessonIndex * 0.05 }}
                          className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${lesson.is_free ? 'bg-green-100' : 'bg-brand-50'} group-hover:scale-110 transition-transform`}>
                              <Play className={`h-4 w-4 ${lesson.is_free ? 'text-green-600' : 'text-brand-600'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                                {lesson.title}
                              </p>
                              <p className="text-sm text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.is_free && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Free Preview
                              </span>
                            )}
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-8"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-brand-500 via-accent-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <GraduationCap className="h-16 w-16 text-white relative z-10" />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center mb-2 gap-1">
                  <IndianRupee className="h-6 w-6 text-green-600" />
                  {course.discount_price && parseFloat(course.discount_price) < parseFloat(course.price) ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">
                        {parseFloat(course.discount_price).toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{parseFloat(course.price).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-green-600">
                      ₹{parseFloat(course.price).toLocaleString()}
                    </span>
                  )}
                </div>
                {course.discount_price && parseFloat(course.discount_price) < parseFloat(course.price) && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-700 font-semibold">
                      Save ₹{(parseFloat(course.price) - parseFloat(course.discount_price)).toLocaleString()}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Enroll Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnrollment}
                disabled={isEnrolling}
                className="w-full bg-gradient-to-r from-brand-600 to-accent-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-brand-700 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isEnrolling ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Enrolling...
                  </>
                ) : (
                  <>
                    Enroll Now
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                <CheckCircle className="h-4 w-4 text-green-500" />
                30-day money-back guarantee
              </div>

              {/* Course includes */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-600" />
                  This course includes:
                </h4>
                <ul className="space-y-3">
                  {[
                    { icon: Monitor, text: `${course.lessons_count} video lessons`, color: 'text-blue-600' },
                    { icon: Globe, text: 'Lifetime access', color: 'text-green-600' },
                    { icon: Award, text: 'Certificate of completion', color: 'text-purple-600' },
                    { icon: User, text: 'AI tutor support', color: 'text-brand-600' },
                    { icon: Users, text: 'Live Q&A sessions', color: 'text-accent-600' },
                    { icon: Smartphone, text: 'Mobile & TV access', color: 'text-teal-600' }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-50">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      {item.text}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              {course.requirements.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="border-t border-gray-100 pt-6 mt-6"
                >
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Requirements:
                  </h4>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
                        {req}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
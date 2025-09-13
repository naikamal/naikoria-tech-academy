'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Star,
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  Award,
  Play,
  ChevronRight
} from 'lucide-react';

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
  };
  category: {
    name: string;
  };
  is_featured: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchCourses = async () => {
    try {
      // Mock data for demo
      const mockCourses = [
        {
          id: 1,
          title: 'Complete Python Programming',
          description: 'Master Python from basics to advanced concepts including web development, data science, and machine learning.',
          short_description: 'Learn Python programming from scratch with hands-on projects',
          thumbnail: '',
          price: '₹4999',
          discount_price: '₹2999',
          difficulty: 'beginner',
          duration_weeks: 12,
          lessons_count: 48,
          rating: '4.8',
          total_ratings: 1250,
          tutor: { name: 'Dr. Sarah Chen', title: 'Python Expert' },
          category: { name: 'Programming' },
          is_featured: true
        },
        {
          id: 2,
          title: 'React & Next.js Masterclass',
          description: 'Build modern web applications with React, Next.js, and TypeScript. Learn component patterns, state management, and deployment.',
          short_description: 'Build professional web apps with React and Next.js',
          thumbnail: '',
          price: '₹5999',
          discount_price: '₹3999',
          difficulty: 'intermediate',
          duration_weeks: 10,
          lessons_count: 42,
          rating: '4.9',
          total_ratings: 890,
          tutor: { name: 'Alex Kumar', title: 'Full Stack Developer' },
          category: { name: 'Web Development' },
          is_featured: true
        },
        {
          id: 3,
          title: 'Machine Learning Fundamentals',
          description: 'Dive into machine learning algorithms, data preprocessing, model training, and evaluation with Python and scikit-learn.',
          short_description: 'Learn ML algorithms and data science techniques',
          thumbnail: '',
          price: '₹7999',
          discount_price: '₹4999',
          difficulty: 'advanced',
          duration_weeks: 16,
          lessons_count: 56,
          rating: '4.7',
          total_ratings: 645,
          tutor: { name: 'Prof. Maria Rodriguez', title: 'AI Researcher' },
          category: { name: 'Data Science' },
          is_featured: false
        },
        {
          id: 4,
          title: 'UI/UX Design Bootcamp',
          description: 'Create beautiful and user-friendly interfaces. Learn design principles, prototyping, and user research methods.',
          short_description: 'Master UI/UX design with modern tools and techniques',
          thumbnail: '',
          price: '₹3999',
          discount_price: '₹2499',
          difficulty: 'beginner',
          duration_weeks: 8,
          lessons_count: 32,
          rating: '4.6',
          total_ratings: 432,
          tutor: { name: 'Emma Thompson', title: 'UX Designer' },
          category: { name: 'Design' },
          is_featured: false
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category.name === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  };

  const categories = ['all', 'Programming', 'Web Development', 'Data Science', 'Design'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover world-class courses designed to accelerate your learning journey with AI-powered assistance.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> courses
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/20">
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-brand-500 via-accent-500 to-teal-500 flex items-center justify-center">
                  {course.is_featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <GraduationCap className="h-16 w-16 text-white opacity-80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Category & Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
                      {course.category.name}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.short_description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons_count} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration_weeks} weeks</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(parseFloat(course.rating)) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.total_ratings})</span>
                  </div>

                  {/* Tutor */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      by <span className="font-medium text-gray-900">{course.tutor.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">{course.tutor.title}</p>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{course.discount_price}</span>
                      <span className="text-sm text-gray-500 line-through">{course.price}</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-xl hover:from-brand-700 hover:to-accent-700 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                      >
                        View Course
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-xl hover:from-brand-700 hover:to-accent-700 transition-all duration-200 font-medium"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to start learning?</h2>
            <p className="text-brand-100 mb-6">Join thousands of students and accelerate your career with our expert-led courses.</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-brand-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link href="/ai">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium"
                >
                  Try AI Tutor
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
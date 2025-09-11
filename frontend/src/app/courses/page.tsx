'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  CurrencyRupeeIcon,
  TagIcon
} from '@heroicons/react/24/outline';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/courses/');
      const data = await response.json();
      
      if (response.ok) {
        setCourses(data.results || data);
      } else {
        setError('Failed to load courses');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      // Fallback demo data
      setCourses([
        {
          id: 1,
          title: 'Introduction to Python Programming',
          description: 'Learn Python from scratch with hands-on projects and real-world applications.',
          short_description: 'Master Python basics and start your programming journey',
          thumbnail: '',
          price: '4000.00',
          discount_price: '2999.00',
          difficulty: 'Beginner',
          duration_weeks: 8,
          lessons_count: 24,
          rating: '4.8',
          total_ratings: 1247,
          tutor: {
            name: 'John Davis',
            title: 'Senior Python Developer'
          },
          category: {
            name: 'Programming'
          },
          is_featured: true
        },
        {
          id: 2,
          title: 'Web Development with React',
          description: 'Build modern web applications using React, Redux, and TypeScript.',
          short_description: 'Create dynamic web apps with React',
          thumbnail: '',
          price: '5500.00',
          discount_price: '4299.00',
          difficulty: 'Intermediate',
          duration_weeks: 10,
          lessons_count: 32,
          rating: '4.9',
          total_ratings: 892,
          tutor: {
            name: 'Dr. Sarah Wilson',
            title: 'Full Stack Developer'
          },
          category: {
            name: 'Web Development'
          },
          is_featured: true
        },
        {
          id: 3,
          title: 'Mathematics for Computer Science',
          description: 'Essential mathematical concepts for programming and algorithms.',
          short_description: 'Mathematical foundations for CS',
          thumbnail: '',
          price: '3500.00',
          discount_price: '2799.00',
          difficulty: 'Intermediate',
          duration_weeks: 6,
          lessons_count: 18,
          rating: '4.7',
          total_ratings: 634,
          tutor: {
            name: 'Prof. Ahmed Khan',
            title: 'Mathematics Professor'
          },
          category: {
            name: 'Mathematics'
          },
          is_featured: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         course.difficulty.toLowerCase() === filter ||
                         course.category.name.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Explore Our Courses
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Discover courses taught by expert instructors with AI-powered learning
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Courses</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="programming">Programming</option>
              <option value="mathematics">Mathematics</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <p><strong>Demo Mode:</strong> Showing sample courses. {error}</p>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <AcademicCapIcon className="h-16 w-16 text-white" />
              </div>
              
              <div className="p-6">
                {/* Featured Badge */}
                {course.is_featured && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Course Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                {/* Course Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.short_description || course.description}
                </p>

                {/* Course Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration_weeks} weeks
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {course.lessons_count} lessons
                  </div>
                </div>

                {/* Difficulty and Category */}
                <div className="flex gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {course.category.name}
                  </span>
                </div>

                {/* Tutor */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>{course.tutor.name}</strong>
                  </p>
                  <p className="text-xs text-gray-500">{course.tutor.title}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(parseFloat(course.rating))
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.rating} ({course.total_ratings} reviews)
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
                    {course.discount_price && parseFloat(course.discount_price) < parseFloat(course.price) ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-green-600">
                          {parseFloat(course.discount_price).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {parseFloat(course.price).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-green-600">
                        {parseFloat(course.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/courses/${course.id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
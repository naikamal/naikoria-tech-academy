'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  CurrencyRupeeIcon,
  PlayIcon,
  CheckCircleIcon,
  BookOpenIcon,
  UserIcon
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
        setError('Course not found');
        // Demo course data
        setCourse({
          id: Number(courseId),
          title: 'Introduction to Python Programming',
          description: 'Learn Python from scratch with hands-on projects and real-world applications. This comprehensive course covers everything from basic syntax to advanced concepts like object-oriented programming, web development, and data analysis.',
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
            title: 'Senior Python Developer',
            bio: 'John has 8+ years of experience in Python development and has taught over 10,000 students worldwide.'
          },
          category: {
            name: 'Programming'
          },
          is_featured: true,
          curriculum: [
            {
              week: 1,
              title: 'Python Fundamentals',
              lessons: [
                { id: 1, title: 'Introduction to Python', duration: '15 min', is_free: true },
                { id: 2, title: 'Setting up your development environment', duration: '20 min', is_free: true },
                { id: 3, title: 'Variables and Data Types', duration: '25 min', is_free: false }
              ]
            },
            {
              week: 2,
              title: 'Control Structures',
              lessons: [
                { id: 4, title: 'Conditional Statements', duration: '30 min', is_free: false },
                { id: 5, title: 'Loops and Iterations', duration: '35 min', is_free: false },
                { id: 6, title: 'Functions and Modules', duration: '40 min', is_free: false }
              ]
            },
            {
              week: 3,
              title: 'Data Structures',
              lessons: [
                { id: 7, title: 'Lists and Tuples', duration: '30 min', is_free: false },
                { id: 8, title: 'Dictionaries and Sets', duration: '35 min', is_free: false },
                { id: 9, title: 'Working with Files', duration: '25 min', is_free: false }
              ]
            }
          ],
          requirements: [
            'No prior programming experience required',
            'A computer with internet connection',
            'Willingness to learn and practice'
          ],
          what_you_learn: [
            'Python syntax and programming fundamentals',
            'Data structures and algorithms',
            'Object-oriented programming concepts',
            'File handling and data processing',
            'Web scraping and API integration',
            'Building real-world projects'
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
    // Simulate enrollment process
    setTimeout(() => {
      alert('Enrollment successful! Redirecting to course content...');
      setIsEnrolling(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link href="/courses" className="text-indigo-600 hover:text-indigo-500">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            ← Back to courses
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex items-center mb-4">
                {course.is_featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-3">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Featured
                  </span>
                )}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.short_description}</p>

              {/* Course Meta */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {course.duration_weeks} weeks
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-1" />
                  {course.lessons_count} lessons
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {course.total_ratings} students
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(parseFloat(course.rating))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-medium text-gray-900">
                  {course.rating}
                </span>
                <span className="ml-1 text-gray-600">
                  ({course.total_ratings} reviews)
                </span>
              </div>

              {/* Tutor Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Instructor</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{course.tutor.name}</h4>
                    <p className="text-sm text-gray-600">{course.tutor.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{course.tutor.bio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            {/* What you'll learn */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.what_you_learn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course curriculum</h2>
              <div className="space-y-6">
                {course.curriculum.map((week) => (
                  <div key={week.week} className="border rounded-lg">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <h3 className="text-lg font-medium text-gray-900">
                        Week {week.week}: {week.title}
                      </h3>
                    </div>
                    <div className="divide-y">
                      {week.lessons.map((lesson) => (
                        <div key={lesson.id} className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <PlayIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                              <p className="text-xs text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          {lesson.is_free && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Free
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <AcademicCapIcon className="h-16 w-16 text-white" />
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                  {course.discount_price && parseFloat(course.discount_price) < parseFloat(course.price) ? (
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-green-600">
                        {parseFloat(course.discount_price).toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {parseFloat(course.price).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-green-600">
                      {parseFloat(course.price).toLocaleString()}
                    </span>
                  )}
                </div>
                {course.discount_price && parseFloat(course.discount_price) < parseFloat(course.price) && (
                  <p className="text-sm text-green-600 font-medium">
                    Save PKR {(parseFloat(course.price) - parseFloat(course.discount_price)).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Enroll Button */}
              <button
                onClick={handleEnrollment}
                disabled={isEnrolling}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>

              <p className="text-xs text-gray-500 text-center mb-6">
                30-day money-back guarantee
              </p>

              {/* Course includes */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">This course includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {course.lessons_count} video lessons
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    AI tutor support
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    Live Q&A sessions
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              {course.requirements.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Requirements:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {course.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
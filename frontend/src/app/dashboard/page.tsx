'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
  PlayIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_verified: boolean;
  is_premium: boolean;
}

interface DashboardStats {
  enrolled_courses: number;
  completed_lessons: number;
  total_study_hours: number;
  achievements: number;
  upcoming_sessions: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    enrolled_courses: 0,
    completed_lessons: 0,
    total_study_hours: 0,
    achievements: 0,
    upcoming_sessions: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // For demo purposes, using mock data
      setStats({
        enrolled_courses: 3,
        completed_lessons: 47,
        total_study_hours: 128,
        achievements: 12,
        upcoming_sessions: 2
      });

      setRecentActivity([
        {
          id: 1,
          type: 'lesson_completed',
          title: 'Completed "Variables and Data Types"',
          course: 'Python Programming',
          time: '2 hours ago',
          icon: BookOpenIcon
        },
        {
          id: 2,
          type: 'quiz_completed',
          title: 'Quiz: Python Basics',
          course: 'Python Programming',
          score: 95,
          time: '1 day ago',
          icon: TrophyIcon
        },
        {
          id: 3,
          type: 'session_joined',
          title: 'Live Session: Advanced Functions',
          course: 'Python Programming',
          time: '2 days ago',
          icon: UserGroupIcon
        }
      ]);

      setUpcomingSessions([
        {
          id: 1,
          title: 'Object-Oriented Programming',
          course: 'Python Programming',
          tutor: 'John Davis',
          time: 'Today, 3:00 PM',
          duration: '1 hour',
          participants: 24
        },
        {
          id: 2,
          title: 'React Components Deep Dive',
          course: 'Web Development',
          tutor: 'Dr. Sarah Wilson',
          time: 'Tomorrow, 2:00 PM',
          duration: '1.5 hours',
          participants: 18
        }
      ]);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      name: 'Enrolled Courses',
      value: stats.enrolled_courses,
      icon: AcademicCapIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Completed Lessons',
      value: stats.completed_lessons,
      icon: BookOpenIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Study Hours',
      value: stats.total_study_hours,
      icon: ClockIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Achievements',
      value: stats.achievements,
      icon: TrophyIcon,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.first_name || 'Student'}! 👋
              </h1>
              <p className="text-gray-600">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.user_type}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Live Sessions</h3>
              </div>
              <div className="p-6">
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-600">{session.course}</p>
                          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                            <span>{session.time}</span>
                            <span>• {session.duration}</span>
                            <span>• {session.participants} participants</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700">
                            Join Session
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming sessions</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="bg-indigo-100 rounded-full p-2">
                        <activity.icon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.course}</p>
                        {activity.score && (
                          <p className="text-sm text-green-600 font-medium">Score: {activity.score}%</p>
                        )}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/courses"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <AcademicCapIcon className="h-5 w-5 mr-3 text-indigo-600" />
                  Browse Courses
                </Link>
                <Link
                  href="/ai/quiz"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ChartBarIcon className="h-5 w-5 mr-3 text-purple-600" />
                  Generate Quiz
                </Link>
                <Link
                  href="/sessions"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <UserGroupIcon className="h-5 w-5 mr-3 text-green-600" />
                  Live Sessions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
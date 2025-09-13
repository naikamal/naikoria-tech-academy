'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth, withAuth } from '../../contexts/AuthContext';
import { 
  GraduationCap, 
  BookOpen,
  Clock,
  Trophy,
  Users,
  Play,
  BarChart3,
  Bell,
  Settings,
  User,
  Calendar,
  TrendingUp,
  Award,
  Brain,
  Target,
  Zap,
  ChevronRight,
  Star
} from 'lucide-react';

interface DashboardStats {
  enrolled_courses: number;
  completed_lessons: number;
  total_study_hours: number;
  achievements: number;
  upcoming_sessions: number;
  current_streak: number;
}

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    enrolled_courses: 0,
    completed_lessons: 0,
    total_study_hours: 0,
    achievements: 0,
    upcoming_sessions: 0,
    current_streak: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // For demo purposes, using mock data
      setStats({
        enrolled_courses: 4,
        completed_lessons: 67,
        total_study_hours: 142,
        achievements: 18,
        upcoming_sessions: 3,
        current_streak: 7
      });

      setRecentActivity([
        {
          id: 1,
          type: 'lesson_completed',
          title: 'Completed "Advanced React Hooks"',
          course: 'React Development',
          time: '2 hours ago',
          icon: BookOpen,
          color: 'text-green-600'
        },
        {
          id: 2,
          type: 'quiz_completed',
          title: 'Quiz: JavaScript Fundamentals',
          course: 'JavaScript Mastery',
          score: 95,
          time: '1 day ago',
          icon: Trophy,
          color: 'text-yellow-600'
        },
        {
          id: 3,
          type: 'session_joined',
          title: 'Live Session: AI Integration',
          course: 'AI Development',
          time: '2 days ago',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: 4,
          type: 'achievement',
          title: 'Earned "Quick Learner" Badge',
          course: 'General',
          time: '3 days ago',
          icon: Award,
          color: 'text-purple-600'
        }
      ]);

      setUpcomingSessions([
        {
          id: 1,
          title: 'Advanced Python Techniques',
          instructor: 'Dr. Sarah Chen',
          date: 'Today',
          time: '2:00 PM',
          duration: '2 hours',
          participants: 24,
          status: 'starting_soon'
        },
        {
          id: 2,
          title: 'Machine Learning Fundamentals',
          instructor: 'Prof. Alex Kumar',
          date: 'Tomorrow',
          time: '10:00 AM',
          duration: '1.5 hours',
          participants: 18,
          status: 'upcoming'
        },
        {
          id: 3,
          title: 'Full-Stack Development Q&A',
          instructor: 'Maria Rodriguez',
          date: 'Friday',
          time: '4:00 PM',
          duration: '1 hour',
          participants: 31,
          status: 'upcoming'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolled_courses,
      icon: BookOpen,
      color: 'from-brand-500 to-brand-600',
      change: '+2 this month'
    },
    {
      title: 'Completed Lessons',
      value: stats.completed_lessons,
      icon: GraduationCap,
      color: 'from-teal-500 to-teal-600',
      change: '+12 this week'
    },
    {
      title: 'Study Hours',
      value: stats.total_study_hours,
      icon: Clock,
      color: 'from-accent-500 to-accent-600',
      change: '+8h this week'
    },
    {
      title: 'Current Streak',
      value: stats.current_streak,
      suffix: ' days',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      change: 'Keep it up!'
    }
  ];

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
      <div className="flex">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-lg"
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
              <div className="h-8 w-8 bg-gradient-to-r from-brand-600 to-accent-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Dashboard</span>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.user_type}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
              <div className="space-y-1">
                {[
                  { name: 'Overview', href: '/dashboard', icon: BarChart3, current: true },
                  { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
                  { name: 'Live Sessions', href: '/dashboard/sessions', icon: Users },
                  { name: 'AI Tutor', href: '/ai', icon: Brain },
                  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
                  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
                  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-brand-50 to-accent-50 text-brand-700 border border-brand-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${item.current ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/dashboard/help"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                Help & Support
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="px-8 py-6">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.first_name}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Ready to continue your learning journey?
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <Link href="/profile">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <User className="h-5 w-5 text-gray-600" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}{stat.suffix}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <Link 
                      href="/dashboard/activity" 
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                      >
                        <div className={`p-2 rounded-xl bg-gray-100`}>
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-600">{activity.course} • {activity.time}</p>
                          {activity.score && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs font-medium text-yellow-600">{activity.score}%</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
                    <Link 
                      href="/dashboard/sessions" 
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className={`p-4 rounded-xl border-l-4 ${
                          session.status === 'starting_soon' 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{session.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">by {session.instructor}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {session.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.time}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500">
                                {session.participants} participants
                              </span>
                              {session.status === 'starting_soon' && (
                                <span className="text-xs font-medium text-green-600">Starting Soon</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-medium rounded-xl hover:from-brand-700 hover:to-accent-700 transition-all duration-200"
                  >
                    Schedule New Session
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Ready to learn something new?</h2>
                    <p className="text-brand-100 mt-1">Explore our AI-powered courses and live sessions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/courses">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium"
                      >
                        Browse Courses
                      </motion.button>
                    </Link>
                    <Link href="/ai">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white text-brand-600 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                      >
                        AI Tutor
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Protect the dashboard route with authentication
export default withAuth(DashboardPage);
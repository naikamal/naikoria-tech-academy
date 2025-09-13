'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoCall from '../../components/VideoCall';
import {
  Video,
  Users,
  Clock,
  Calendar,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  MessageCircle,
  Hand,
  Share,
  MoreVertical,
  ChevronRight,
  BookOpen,
  Globe
} from 'lucide-react';

interface LiveSession {
  id: number;
  title: string;
  tutor: {
    name: string;
    avatar: string;
    rating: number;
  };
  subject: string;
  description: string;
  scheduledTime: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'live' | 'ended';
  price: string;
  level: string;
  thumbnail: string;
}

const mockSessions: LiveSession[] = [
  {
    id: 1,
    title: "Advanced React Patterns & Performance Optimization",
    tutor: {
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      rating: 4.9
    },
    subject: "Programming",
    description: "Deep dive into advanced React patterns including render props, higher-order components, and performance optimization techniques.",
    scheduledTime: "2024-01-15T14:00:00Z",
    duration: 90,
    maxParticipants: 25,
    currentParticipants: 18,
    status: "live",
    price: "₨ 2,500",
    level: "Advanced",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Mathematics: Calculus Fundamentals",
    tutor: {
      name: "Dr. Ahmed Khan",
      avatar: "/api/placeholder/40/40",
      rating: 4.8
    },
    subject: "Mathematics",
    description: "Complete introduction to calculus including limits, derivatives, and their real-world applications.",
    scheduledTime: "2024-01-15T16:30:00Z",
    duration: 60,
    maxParticipants: 30,
    currentParticipants: 0,
    status: "upcoming",
    price: "₨ 1,800",
    level: "Intermediate",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "English Literature: Shakespeare Analysis",
    tutor: {
      name: "Emma Thompson",
      avatar: "/api/placeholder/40/40",
      rating: 4.7
    },
    subject: "Literature",
    description: "Analyzing Shakespeare's major works with focus on themes, character development, and historical context.",
    scheduledTime: "2024-01-15T18:00:00Z",
    duration: 75,
    maxParticipants: 20,
    currentParticipants: 12,
    status: "upcoming",
    price: "₨ 2,200",
    level: "Advanced",
    thumbnail: "/api/placeholder/300/200"
  }
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>(mockSessions);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isInSession, setIsInSession] = useState(false);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);

  const filteredSessions = sessions.filter(session => {
    if (selectedFilter === 'all') return true;
    return session.status === selectedFilter;
  });

  const getStatusColor = (status: LiveSession['status']) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const joinSession = (session: LiveSession) => {
    setCurrentSession(session);
    setIsInSession(true);
  };

  // Mock participants data
  const mockParticipants = [
    {
      id: '1',
      name: 'Sarah Chen',
      isHost: true,
      isMuted: false,
      isVideoOff: false,
      isHandRaised: false
    },
    {
      id: '2',
      name: 'Ahmed Khan',
      isHost: false,
      isMuted: true,
      isVideoOff: false,
      isHandRaised: false
    },
    {
      id: '3',
      name: 'Emma Thompson',
      isHost: false,
      isMuted: false,
      isVideoOff: true,
      isHandRaised: true
    }
  ];

  const leaveSession = () => {
    setIsInSession(false);
    setCurrentSession(null);
  };

  if (isInSession && currentSession) {
    return (
      <VideoCall
        sessionId={currentSession.id.toString()}
        sessionTitle={currentSession.title}
        participants={mockParticipants}
        onLeave={leaveSession}
        isHost={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
            <div className="p-2 bg-red-500 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join live interactive sessions with expert tutors. Get real-time help, participate in discussions, and learn with peers.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 inline-flex">
            {[
              { key: 'all', label: 'All Sessions' },
              { key: 'live', label: 'Live Now' },
              { key: 'upcoming', label: 'Upcoming' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {session.status === 'live' && <div className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>}
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/50 text-white px-2 py-1 rounded-lg text-sm">
                    {session.duration}min
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {session.subject}
                  </span>
                  <span className="text-sm text-gray-500">{session.level}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {session.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {session.description}
                </p>

                {/* Tutor Info */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {session.tutor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{session.tutor.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{session.tutor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{session.currentParticipants}/{session.maxParticipants}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Price and Join Button */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{session.price}</span>
                  <button
                    onClick={() => joinSession(session)}
                    disabled={session.currentParticipants >= session.maxParticipants}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                      session.status === 'live'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {session.status === 'live' ? (
                      <>
                        <Video className="h-4 w-4" />
                        Join Live
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        Schedule
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">Check back later for upcoming live sessions.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


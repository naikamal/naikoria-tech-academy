'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Settings,
  MessageCircle,
  Hand,
  Users,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Camera,
  MoreVertical,
  Share,
  Grid3X3,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  avatar?: string;
}

interface VideoCallProps {
  sessionId: string;
  sessionTitle: string;
  participants: Participant[];
  onLeave: () => void;
  isHost?: boolean;
}

export default function VideoCall({
  sessionId,
  sessionTitle,
  participants,
  onLeave,
  isHost = false
}: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker' | 'presentation'>('gallery');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
    isHost?: boolean;
  }>>([
    {
      id: '1',
      sender: 'Host',
      message: 'Welcome everyone to today\'s session!',
      timestamp: new Date(),
      isHost: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize user media
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !isVideoOff,
          audio: !isMuted
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      // Cleanup media streams
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleMute = useCallback(async () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted; // Toggle
      });
    }
  }, [isMuted]);

  const toggleVideo = useCallback(async () => {
    setIsVideoOff(!isVideoOff);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff; // Toggle
      });
    }
  }, [isVideoOff]);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      setIsScreenSharing(true);
      setViewMode('presentation');

      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setIsScreenSharing(false);
        setViewMode('gallery');
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage,
        timestamp: new Date(),
        isHost: isHost
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  }, [newMessage, isHost]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">LIVE</span>
          </div>
          <h1 className="text-white text-lg font-semibold truncate">{sessionTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Selector */}
          <div className="relative">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="bg-gray-700 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gallery">Gallery</option>
              <option value="speaker">Speaker</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>

          {/* Participants Count */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-gray-300 hover:text-white flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">{participants.length}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-gray-300 hover:text-white"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>

          {/* Leave Button */}
          <button
            onClick={onLeave}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <PhoneOff className="h-4 w-4" />
            End
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-gray-900">
          {/* Video Grid */}
          <div className={`h-full p-4 ${
            viewMode === 'gallery'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : viewMode === 'speaker'
              ? 'flex items-center justify-center'
              : 'grid grid-cols-1 lg:grid-cols-4 gap-4'
          }`}>
            {/* Local Video */}
            <div className={`bg-gray-800 rounded-2xl overflow-hidden relative group ${
              viewMode === 'speaker' ? 'w-full max-w-4xl h-full' : 'aspect-video'
            }`}>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                You {isHost && '(Host)'}
              </div>
              {isMuted && (
                <div className="absolute top-2 left-2 bg-red-600 rounded-full p-1">
                  <MicOff className="h-3 w-3 text-white" />
                </div>
              )}
              {isHandRaised && (
                <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                  <Hand className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Other Participants */}
            {participants.slice(0, viewMode === 'gallery' ? 11 : viewMode === 'speaker' ? 3 : 3).map((participant) => (
              <ParticipantVideo
                key={participant.id}
                participant={participant}
                viewMode={viewMode}
              />
            ))}

            {/* Screen Share */}
            {isScreenSharing && viewMode === 'presentation' && (
              <div className="lg:col-span-3 bg-black rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">Screen Share Active</p>
                    <p className="text-sm text-gray-400 mt-2">Your screen is being shared</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-800/95 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl"
            >
              {/* Mute */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isMuted
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Video */}
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isVideoOff
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
                title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={startScreenShare}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isScreenSharing
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
                title="Share screen"
              >
                <Monitor className="h-5 w-5" />
              </button>

              {/* Raise Hand */}
              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isHandRaised
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
                title={isHandRaised ? 'Lower hand' : 'Raise hand'}
              >
                <Hand className="h-5 w-5" />
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  showChat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
                title="Toggle chat"
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              {/* Settings */}
              <button
                className="p-3 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
                  <button
                    onClick={() => setShowParticipants(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {participant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {participant.name}
                        {participant.isHost && <span className="text-yellow-400 ml-2">(Host)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isMuted && <MicOff className="h-3 w-3 text-red-400" />}
                      {participant.isVideoOff && <VideoOff className="h-3 w-3 text-red-400" />}
                      {participant.isHandRaised && <Hand className="h-3 w-3 text-yellow-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Chat</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`${
                    msg.sender === 'You' ? 'ml-auto max-w-xs' : 'max-w-xs'
                  }`}>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.sender === 'You'
                        ? 'bg-blue-600 text-white'
                        : msg.isHost
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-gray-100'
                    }`}>
                      {msg.sender !== 'You' && (
                        <div className={`font-medium text-xs mb-1 ${
                          msg.isHost ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          {msg.sender}
                          {msg.isHost && ' (Host)'}
                        </div>
                      )}
                      <div>{msg.message}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ParticipantVideo({
  participant,
  viewMode
}: {
  participant: Participant;
  viewMode: string;
}) {
  return (
    <div className={`bg-gray-800 rounded-2xl overflow-hidden relative group ${
      viewMode === 'speaker' ? 'w-32 h-24' : 'aspect-video'
    }`}>
      {participant.isVideoOff ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {participant.name}
        {participant.isHost && ' (Host)'}
      </div>

      <div className="absolute top-2 left-2 flex gap-1">
        {participant.isMuted && (
          <div className="bg-red-600 rounded-full p-1">
            <MicOff className="h-3 w-3 text-white" />
          </div>
        )}
        {participant.isHandRaised && (
          <div className="bg-yellow-500 rounded-full p-1">
            <Hand className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
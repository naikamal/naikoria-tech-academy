'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  GraduationCap,
  Home,
  BookOpen,
  Users,
  Sparkles,
  User,
  LogOut
} from 'lucide-react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Live Sessions', href: '/sessions', icon: Users },
    { name: 'AI Tutor', href: '/ai', icon: Sparkles },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200 sticky top-0 z-50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center relative overflow-visible">
              <Link href="/" className="flex items-center group relative">
                {/* Crazy floating logo that moves down on hover */}
                <div className="h-20 w-20 relative z-20 transform transition-all duration-700 ease-out group-hover:translate-y-12 group-hover:translate-x-8 group-hover:rotate-45 group-hover:scale-150">

                  {/* Insane sparkle explosion on hover */}
                  <div className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-5">
                    {/* Crazy sparkle burst */}
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full" style={{top: '5%', left: '95%', animation: 'explode 0.8s ease-out infinite', animationDelay: '0s'}}></div>
                    <div className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full" style={{top: '15%', left: '5%', animation: 'explode 1s ease-out infinite', animationDelay: '0.1s'}}></div>
                    <div className="absolute w-1 h-1 bg-cyan-400 rounded-full" style={{top: '85%', left: '95%', animation: 'explode 0.9s ease-out infinite', animationDelay: '0.2s'}}></div>
                    <div className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full" style={{top: '90%', left: '10%', animation: 'explode 0.7s ease-out infinite', animationDelay: '0.3s'}}></div>
                    <div className="absolute w-1 h-1 bg-emerald-400 rounded-full" style={{top: '50%', left: '0%', animation: 'explode 1.1s ease-out infinite', animationDelay: '0.4s'}}></div>
                    <div className="absolute w-2 h-2 bg-orange-400 rounded-full" style={{top: '25%', left: '100%', animation: 'explode 0.6s ease-out infinite', animationDelay: '0.5s'}}></div>

                    {/* Crazy energy beams shooting out */}
                    <div className="absolute top-1/2 left-0 w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent transform -translate-y-1/2 -translate-x-full" style={{animation: 'beam 1s ease-out infinite'}}></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-16 bg-gradient-to-b from-pink-400 to-transparent transform -translate-x-1/2 -translate-y-full" style={{animation: 'beam 1.2s ease-out infinite'}}></div>
                    <div className="absolute top-1/2 right-0 w-16 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent transform -translate-y-1/2 translate-x-full" style={{animation: 'beam 0.9s ease-out infinite'}}></div>
                    <div className="absolute bottom-0 left-1/2 w-0.5 h-16 bg-gradient-to-t from-purple-400 to-transparent transform -translate-x-1/2 translate-y-full" style={{animation: 'beam 1.1s ease-out infinite'}}></div>
                  </div>

                  {/* Massive crazy halo explosion */}
                  <div className="absolute -inset-8 bg-gradient-radial from-violet-400/40 via-purple-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" style={{animation: 'shockwave 1s ease-out infinite'}}></div>
                  <div className="absolute -inset-6 bg-gradient-radial from-cyan-300/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-0" style={{animation: 'shockwave 1.2s ease-out infinite reverse'}}></div>
                  <div className="absolute -inset-4 bg-gradient-radial from-pink-300/35 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" style={{animation: 'shockwave 0.8s ease-out infinite'}}></div>

                  {/* Logo container with insane effects */}
                  <div className="relative h-full w-full z-30">
                    {/* Multiple explosive glows */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/40 via-purple-200/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 animate-ping z-20"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-yellow-200/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" style={{animation: 'rapidPing 0.5s ease-out infinite'}}></div>

                    {/* Logo with crazy motions */}
                    <div className="relative h-full w-full transform transition-all duration-300 ease-out z-40 group-hover:animate-spin">
                      <Image
                        src="/logo.png"
                        alt="Naikoria Tech Academy"
                        fill
                        className="object-contain filter group-hover:brightness-200 group-hover:contrast-150 group-hover:saturate-200 group-hover:hue-rotate-180 group-hover:drop-shadow-2xl transition-all duration-300 group-hover:animate-bounce"
                        priority
                      />
                    </div>
                  </div>

                  {/* Crazy orbiting particles */}
                  <div className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-15">
                    <div className="absolute w-2 h-2 bg-gold-400 rounded-full" style={{top: '10%', left: '90%', animation: 'crazyOrbit 0.5s linear infinite'}}></div>
                    <div className="absolute w-1.5 h-1.5 bg-silver-400 rounded-full" style={{top: '90%', left: '10%', animation: 'crazyOrbit 0.7s linear infinite reverse'}}></div>
                    <div className="absolute w-1 h-1 bg-rose-400 rounded-full" style={{top: '20%', left: '20%', animation: 'crazyOrbit 0.6s linear infinite'}}></div>
                    <div className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full" style={{top: '80%', left: '80%', animation: 'crazyOrbit 0.8s linear infinite reverse'}}></div>
                  </div>

                  {/* Pulsating border madness */}
                  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-gold-400 via-purple-400 via-pink-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-15" style={{animation: 'borderMadness 0.3s ease-in-out infinite'}}></div>
                </div>

                <div className="ml-4 transform group-hover:translate-x-4 group-hover:-translate-y-2 group-hover:rotate-3 transition-transform duration-600 group-hover:animate-pulse">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent group-hover:from-violet-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-600 relative">
                      Naikoria Tech Academy
                      <span className="absolute -inset-0.5 bg-gradient-to-r from-purple-200/10 to-pink-200/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-600 -z-10"></span>
                    </span>
                    {/* Premium badge that goes crazy */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold text-white rounded-full shadow-lg group-hover:animate-spin">
                        PREMIUM
                      </div>
                    </div>
                  </div>

                  <div className="h-0.5 w-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-800 ease-out mt-1 shadow-lg shadow-purple-400/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>

                  {/* Premium status that dances */}
                  <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center space-x-1 text-xs text-purple-600/70 font-medium group-hover:animate-bounce">
                      <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-spin"></div>
                      <span>Premium Features Unlocked • Advanced Learning</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-brand-300'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.first_name?.[0] || 'U'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:from-brand-700 hover:to-accent-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                
                <div className="px-3 py-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.first_name?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-800">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm font-medium text-gray-500 capitalize">
                        {user.user_type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
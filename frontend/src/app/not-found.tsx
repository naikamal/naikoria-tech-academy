'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10 text-center"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg mb-6">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-bold text-brand-600 mb-4"
            >
              404
            </motion.h1>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Page Not Found
            </h2>
            
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track!
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <Link 
              href="/"
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            
            <Link 
              href="/courses"
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-2xl text-brand-600 bg-white border-2 border-brand-200 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              Browse Courses
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-medium rounded-2xl text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              Need help? Contact our{' '}
              <Link href="/support" className="text-brand-600 hover:text-brand-700 transition-colors">
                support team
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
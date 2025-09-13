'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

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
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg mb-6">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified and is working on a fix.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left"
              >
                <p className="text-sm font-medium text-red-800 mb-2">Development Error:</p>
                <p className="text-xs text-red-700 break-all font-mono">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </motion.button>
            
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-2xl text-brand-600 bg-white border-2 border-brand-200 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-300"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </motion.a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              If this problem persists, please{' '}
              <a href="/support" className="text-brand-600 hover:text-brand-700 transition-colors">
                contact support
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, GraduationCap, Users, ArrowRight, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    user_type: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/users/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          user_type: formData.user_type
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login with success message
        router.push('/login?registered=true');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const userTypes = [
    { value: 'student', label: 'Student', icon: User, description: 'Learn with AI-powered assistance', gradient: 'from-teal-500 to-brand-500' },
    { value: 'tutor', label: 'Tutor', icon: GraduationCap, description: 'Teach and inspire students', gradient: 'from-brand-500 to-accent-500' },
    { value: 'admin', label: 'Administrator', icon: Users, description: 'Manage platform operations', gradient: 'from-accent-500 to-teal-500' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Join Naikoria
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6" 
            onSubmit={handleSubmit}
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* User Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as a:
              </label>
              <div className="grid grid-cols-1 gap-3">
                {userTypes.map((type, index) => (
                  <motion.label 
                    key={type.value} 
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <input
                      type="radio"
                      name="user_type"
                      value={type.value}
                      checked={formData.user_type === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                        formData.user_type === type.value
                          ? 'border-brand-500 bg-gradient-to-r from-brand-50 to-accent-50 shadow-sm'
                          : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-r ${type.gradient} ${
                        formData.user_type === type.value ? 'shadow-lg' : 'opacity-70'
                      }`}>
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${
                          formData.user_type === type.value ? 'text-brand-900' : 'text-gray-900'
                        }`}>
                          {type.label}
                        </div>
                        <div className={`text-xs ${
                          formData.user_type === type.value ? 'text-brand-700' : 'text-gray-500'
                        }`}>
                          {type.description}
                        </div>
                      </div>
                      {formData.user_type === type.value && (
                        <div className="ml-2">
                          <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                        </div>
                      )}
                    </motion.div>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="john@example.com"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-brand-600 hover:text-brand-700 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-600 hover:text-brand-700 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
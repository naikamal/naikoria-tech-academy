'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Brain, 
  Users, 
  Sparkles, 
  MessageCircle, 
  Play,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Clock
} from 'lucide-react';

// Animation variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.25, 0.25, 0.75] }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.25, 0.25, 0.75] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    }
  }
};

// Updated features with proper icons and modern description

const features = [
  {
    name: 'AI Personal Tutor',
    description: 'Get 24/7 support from your personal AI tutor powered by advanced language models.',
    icon: Sparkles,
    gradient: 'from-brand-500 to-accent-500',
  },
  {
    name: 'Live Interactive Sessions',
    description: 'Join live classes with real-time collaboration tools, whiteboard, and instant feedback.',
    icon: Users,
    gradient: 'from-teal-500 to-brand-500',
  },
  {
    name: 'Smart Content Creation',
    description: 'AI-generated quizzes, assignments, and personalized learning paths.',
    icon: GraduationCap,
    gradient: 'from-accent-500 to-teal-500',
  },
  {
    name: 'Real-time Communication',
    description: 'Chat with tutors and peers using our advanced messaging system with AI assistance.',
    icon: MessageCircle,
    gradient: 'from-brand-600 to-accent-600',
  },
];

const stats = [
  { name: 'Active Students', value: '2,500+' },
  { name: 'Expert Tutors', value: '150+' },
  { name: 'Courses Available', value: '500+' },
  { name: 'Success Rate', value: '95%' },
];


export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-4 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-400 to-accent-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden sm:mb-8 sm:flex sm:justify-center"
          >
            <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-white/80 backdrop-blur-sm">
              Powered by AI and built by{' '}
              <span className="font-semibold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                Naik Amal Shah
              </span>
              .{' '}
              <Link href="/about" className="font-semibold text-brand-600 hover:text-brand-700">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </motion.div>
          
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Welcome to{' '}
              <span className="text-brand-600">Naikoria Tech Academy</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              The most intelligent online tutoring platform. Learn with AI-powered assistance, 
              join live interactive sessions, and achieve your educational goals with personalized guidance.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                href="/register"
                className="rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-colors duration-200"
              >
                Get started for free
              </Link>
              <Link href="/courses" className="text-sm font-semibold leading-6 text-gray-900 hover:text-brand-600 transition-colors">
                Browse courses <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-accent-400 to-teal-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-brand-600">Learn Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
            Everything you need for modern education
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the future of online learning with our AI-powered platform that adapts to your learning style.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-16 group"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900 group-hover:text-brand-700 transition-colors">
                  <div className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:max-w-none"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by students worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Join thousands of students who are already learning smarter with Naikoria Tech Academy.
              </p>
            </div>
            <motion.dl 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.name} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col bg-white/5 p-8 hover:bg-white/10 transition-colors duration-200"
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-white">{stat.value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
          >
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start your learning journey today
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Get access to AI-powered tutoring, live sessions, and a community of learners. 
                Your education transformation starts here.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  href="/register"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
                >
                  Join now
                </Link>
                <Link href="/demo" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
                  Watch demo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
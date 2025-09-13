import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/Navigation'
import ClientProvider from '../components/providers/ClientProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
})

export const metadata: Metadata = {
  title: {
    default: 'Naikoria Tech Academy',
    template: '%s | Naikoria Tech Academy',
  },
  description: 'Smart Online Tutoring Platform by Naik Amal Shah. Learn with intelligent tutoring, live sessions, and personalized education.',
  keywords: ['online tutoring', 'AI education', 'live classes', 'personalized learning', 'Naikoria'],
  authors: [{ name: 'Naik Amal Shah' }],
  creator: 'Naik Amal Shah',
  metadataBase: new URL('https://naikoria.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Naikoria Tech Academy - Smart Online Tutoring',
    description: 'The most intelligent tutoring platform with AI-powered learning, live sessions, and personalized education.',
    url: 'https://naikoria.com',
    siteName: 'Naikoria Tech Academy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Naikoria Tech Academy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naikoria Tech Academy - Smart Online Tutoring',
    description: 'The most intelligent tutoring platform with AI-powered learning.',
    images: ['/twitter-image.png'],
    creator: '@naikoria',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProvider>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </ClientProvider>
      </body>
    </html>
  )
}
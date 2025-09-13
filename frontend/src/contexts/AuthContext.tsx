'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_verified: boolean;
  is_premium: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

// Routes that should redirect to dashboard if user is already logged in
const AUTH_ROUTES = ['/login', '/register'];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing authentication on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Handle route protection after auth state is loaded
    if (!isLoading) {
      const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
      const isAuthRoute = AUTH_ROUTES.includes(pathname);

      if (isProtectedRoute && !user) {
        // Redirect to login if trying to access protected route without auth
        router.push('/login?redirect=' + encodeURIComponent(pathname));
      } else if (isAuthRoute && user) {
        // Redirect to dashboard if trying to access login/register while authenticated
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        router.push(redirect || '/dashboard');
      }
    }
  }, [isLoading, user, pathname, router]);

  const login = (authToken: string, userData: User) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    
    // Redirect to the intended page or dashboard
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    router.push(redirect || '/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login?redirect=' + encodeURIComponent(pathname));
      }
    }, [isAuthenticated, isLoading, router, pathname]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will be redirected by useEffect
    }

    return <WrappedComponent {...props} />;
  };
}
'use client';

import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
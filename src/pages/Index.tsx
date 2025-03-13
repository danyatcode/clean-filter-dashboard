
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Toaster } from "sonner";

const Index = () => {
  useEffect(() => {
    // Smooth page entrance animation
    document.body.classList.add('animate-fade-in');
    
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your business performance and trends
          </p>
        </div>
      </header>
      
      <main>
        <DashboardLayout />
      </main>
      
      <Toaster position="top-right" closeButton />
    </div>
  );
};

export default Index;

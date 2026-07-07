import React from 'react';
import { Outlet } from 'react-router-dom';
import StatsHeader from '@/pages/stats/components/Header';

const StatsLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-background text-[#e2e2e2] flex flex-col font-sans overflow-x-hidden">
      {/* Top radial glow + hairline, same shell treatment as the marketing pages */}
      <div className="absolute inset-0 hero-gradient pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/45 to-transparent z-10"></div>

      <StatsHeader />
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default StatsLayout;

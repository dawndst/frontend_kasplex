import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AppLayout: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-background text-[#e2e2e2] flex flex-col font-sans overflow-x-hidden">
            {/* Top radial glow + hairline */}
            <div className="absolute inset-0 hero-gradient pointer-events-none z-0"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/45 to-transparent z-10"></div>

            <Header />
            <div className="flex-1 relative z-10">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default AppLayout;

import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AppLayout: React.FC = () => {
    const productRef = useRef<HTMLDivElement>(null);
    const { state } = useLocation();

    const scrollToProduct = () => {
        productRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (state && state.product) {
            scrollToProduct();
        }
    }, [state]);

    return (
        <div className="relative min-h-screen bg-background text-[#e2e2e2] flex flex-col font-sans overflow-x-hidden">
            {/* Top radial glow + hairline */}
            <div className="absolute inset-0 hero-gradient pointer-events-none z-0"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/45 to-transparent z-10"></div>

            <Header onItemClick={() => scrollToProduct()} />
            <div className="flex-1 relative z-10">
                <Outlet context={{ productRef }} />
            </div>
            <Footer />
        </div>
    );
};

export default AppLayout;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Krc20Url, EVMDocsUrl } from '@/utils/constants';
import logo from '@/assets/LOGO1-1.png';

interface HeaderProps {
    isMobile?: boolean;
    onItemClick?: () => void;
}

const ExplorerUrl = 'https://explorer.kasplex.org/';

const Header: React.FC<HeaderProps> = ({ onItemClick }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [docsOpen, setDocsOpen] = useState(false);
    const location = useLocation();
    const pathName = location.pathname;
    const navigate = useNavigate();

    const goUrl = (url: string) => {
        setMobileOpen(false);
        window.open(url, '_blank');
    };

    const goHome = () => {
        setMobileOpen(false);
        navigate('/');
    };

    const goEvm = () => {
        setMobileOpen(false);
        navigate('/evm');
    };

    const goProducts = () => {
        setMobileOpen(false);
        if (pathName !== '/') {
            navigate('/', { state: { product: 'product' } });
        }
        setTimeout(() => {
            onItemClick?.();
        }, 50);
    };

    const linkCls = (active: boolean) =>
        `px-4 py-1.5 rounded-xl font-headline text-sm font-semibold tracking-wide transition-all relative cursor-pointer ${
            active ? 'text-primary' : 'text-outline hover:text-[#e2e2e2]'
        }`;

    const underline = (
        <motion.span
            layoutId="activeTabUnderline"
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
        />
    );

    return (
        <header className="sticky top-0 z-40 bg-[#121414]/80 backdrop-blur-md border-b border-outline-variant/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center cursor-pointer select-none group" onClick={goHome}>
                    <img src={logo} alt="Kasplex" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1.5">
                    <a className={linkCls(pathName === '/')} onClick={goHome}>
                        HOME
                        {pathName === '/' && underline}
                    </a>
                    <a className={linkCls(false)} onClick={goProducts}>
                        PRODUCTS
                    </a>
                    <a className={linkCls(pathName === '/evm')} onClick={goEvm}>
                        EVM
                        {pathName === '/evm' && underline}
                    </a>
                    <div
                        className="relative"
                        onMouseEnter={() => setDocsOpen(true)}
                        onMouseLeave={() => setDocsOpen(false)}
                    >
                        <a className={`${linkCls(false)} flex items-center gap-1`}>
                            DOCS
                            <ChevronDown size={13} className={`transition-transform ${docsOpen ? 'rotate-180' : ''}`} />
                        </a>
                        <AnimatePresence>
                            {docsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                                >
                                    <div className="glass-card rounded-xl overflow-hidden min-w-[140px] shadow-2xl">
                                        <a
                                            href={Krc20Url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2.5 font-headline text-sm font-semibold text-outline hover:text-primary hover:bg-surface-container transition-colors"
                                        >
                                            KRC20
                                        </a>
                                        <a
                                            href={EVMDocsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2.5 font-headline text-sm font-semibold text-outline hover:text-primary hover:bg-surface-container transition-colors"
                                        >
                                            EVM
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>

                {/* Explorer button (desktop) */}
                <div className="hidden md:flex items-center">
                    <button
                        onClick={() => goUrl(ExplorerUrl)}
                        className="px-4 py-2 bg-primary text-background hover:bg-secondary active:scale-[0.97] rounded-xl font-headline font-semibold text-xs tracking-wide transition-all shadow-lg shadow-primary/10 flex items-center gap-1.5 cursor-pointer"
                    >
                        Explorer
                        <ArrowUpRight size={13} />
                    </button>
                </div>

                {/* Mobile hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    <button
                        onClick={() => goUrl(ExplorerUrl)}
                        className="px-3 py-1.5 bg-primary text-background rounded-xl font-headline font-semibold text-xs tracking-wide flex items-center gap-1"
                    >
                        Explorer
                        <ArrowUpRight size={12} />
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg hover:bg-surface-container text-outline hover:text-[#e2e2e2]"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-16 left-0 right-0 bg-[#121414]/95 border-b border-outline-variant/50 backdrop-blur-lg z-50 p-4 space-y-2.5 shadow-2xl"
                    >
                        {[
                            { label: 'Home', onClick: goHome, active: pathName === '/' },
                            { label: 'PRODUCTS', onClick: goProducts, active: false },
                            { label: 'EVM', onClick: goEvm, active: pathName === '/evm' },
                            { label: 'KRC20 DOCS', onClick: () => goUrl(Krc20Url), active: false },
                            { label: 'EVM DOCS', onClick: () => goUrl(EVMDocsUrl), active: false },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className={`w-full text-left px-4 py-2.5 rounded-xl font-headline text-sm font-semibold transition-all ${
                                    item.active
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-outline hover:bg-surface-container hover:text-[#e2e2e2]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Krc20Url, EVMDocsUrl } from '@/utils/constants';
import logo from '@/assets/LOGO1-1.png';

const ExplorerUrl = 'https://explorer.kasplex.org/';

type NavEntry = { label: string; path?: string; href?: string };

const EVM_MENU: NavEntry[] = [
    { label: 'Ecosystem', path: '/evm' },
    { label: 'Faucet', path: '/faucet' },
    { label: 'Explorer', href: ExplorerUrl },
];

const DOCS_MENU: NavEntry[] = [
    { label: 'KRC20', href: Krc20Url },
    { label: 'EVM', href: EVMDocsUrl },
];

const Header: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<'evm' | 'docs' | null>(null);
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

    const goPage = (path: string) => {
        setMobileOpen(false);
        setOpenMenu(null);
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const isEvmActive = pathName === '/evm' || pathName === '/faucet';

    const linkCls = (active: boolean) =>
        `px-4 py-1.5 rounded-xl font-headline text-sm font-semibold tracking-wide transition-all relative cursor-pointer ${
            active ? 'text-primary' : 'text-outline hover:text-[#e2e2e2]'
        }`;

    const underline = (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
    );

    const Dropdown: React.FC<{ id: 'evm' | 'docs'; label: string; active: boolean; items: NavEntry[] }> = ({ id, label, active, items }) => (
        <div
            className="relative"
            onMouseEnter={() => setOpenMenu(id)}
            onMouseLeave={() => setOpenMenu((cur) => (cur === id ? null : cur))}
        >
            <a className={`${linkCls(active)} flex items-center gap-1`}>
                {label}
                <ChevronDown size={13} className={`transition-transform ${openMenu === id ? 'rotate-180' : ''}`} />
                {active && underline}
            </a>
            <AnimatePresence>
                {openMenu === id && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    >
                        <div className="glass-card rounded-xl overflow-hidden min-w-[160px] shadow-2xl">
                            {items.map((item) =>
                                item.href ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between gap-2 px-4 py-2.5 font-headline text-sm font-semibold text-outline hover:text-primary hover:bg-surface-container transition-colors"
                                    >
                                        {item.label}
                                        <ArrowUpRight size={13} />
                                    </a>
                                ) : (
                                    <a
                                        key={item.label}
                                        onClick={() => goPage(item.path!)}
                                        className={`block px-4 py-2.5 font-headline text-sm font-semibold cursor-pointer transition-colors ${
                                            pathName === item.path
                                                ? 'text-primary bg-surface-container'
                                                : 'text-outline hover:text-primary hover:bg-surface-container'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <header className="sticky top-0 z-40 bg-[#121414]/80 backdrop-blur-md border-b border-outline-variant/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[1fr_auto_1fr] items-center">

                {/* Logo */}
                <div className="flex items-center cursor-pointer select-none group justify-self-start" onClick={goHome}>
                    <img src={logo} alt="Kasplex" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
                </div>

                {/* Desktop nav — centered */}
                <nav className="hidden md:flex items-center gap-1.5 justify-self-center">
                    <a className={linkCls(pathName === '/')} onClick={goHome}>
                        HOME
                        {pathName === '/' && underline}
                    </a>
                    <Dropdown id="evm" label="EVM" active={isEvmActive} items={EVM_MENU} />
                    <Dropdown id="docs" label="DOCS" active={false} items={DOCS_MENU} />
                </nav>

                {/* Right spacer keeps nav centered on desktop */}
                <div className="hidden md:block justify-self-end" aria-hidden="true"></div>

                {/* Mobile hamburger */}
                <div className="flex md:hidden items-center justify-self-end col-start-3">
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
                            { label: 'Home', onClick: goHome, active: pathName === '/', external: false },
                            { label: 'Ecosystem', onClick: () => goPage('/evm'), active: pathName === '/evm', external: false },
                            { label: 'Faucet', onClick: () => goPage('/faucet'), active: pathName === '/faucet', external: false },
                            { label: 'Explorer', onClick: () => goUrl(ExplorerUrl), active: false, external: true },
                            { label: 'KRC20 DOCS', onClick: () => goUrl(Krc20Url), active: false, external: true },
                            { label: 'EVM DOCS', onClick: () => goUrl(EVMDocsUrl), active: false, external: true },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className={`w-full text-left px-4 py-2.5 rounded-xl font-headline text-sm font-semibold transition-all flex items-center justify-between ${
                                    item.active
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-outline hover:bg-surface-container hover:text-[#e2e2e2]'
                                }`}
                            >
                                {item.label}
                                {item.external && <ArrowUpRight size={14} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

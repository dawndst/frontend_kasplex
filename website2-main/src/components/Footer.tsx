import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import KaspaImg from '@/assets/Kasplex.ico';
import Twitter from '@/assets/twitter.png';
import Telegram from '@/assets/telegram.png';
import logo from '@/assets/LOGO1-1.png';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const goUrl = (url: string) => {
        window.open(url, '_blank');
    };

    const goPage = (page: string) => {
        navigate(page);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <footer className="bg-surface-container-lowest border-t border-outline-variant/30 py-12 relative z-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Branding */}
                    <div className="md:col-span-2 space-y-4">
                        <img src={logo} alt="Kasplex" className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                        <p className="text-xs text-outline max-w-sm leading-relaxed">
                            Kasplex is open-source and community-driven. Join us to shape Kaspa's future.
                        </p>
                    </div>

                    {/* Go to the source */}
                    <div className="space-y-3">
                        <h5 className="font-headline font-semibold text-xs text-[#e2e2e2] uppercase tracking-wider">Go to the source</h5>
                        <div
                            className="glass-card rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors group"
                            onClick={() => goUrl('https://github.com/kasplex')}
                        >
                            <div className="flex items-center gap-2.5">
                                <img src={KaspaImg} alt="" className="w-6 h-6 rounded-full" />
                                <span className="font-mono text-[11px] text-outline group-hover:text-[#e2e2e2] transition-colors">Kasplex Github</span>
                            </div>
                            <a
                                href="https://github.com/kasplex"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono text-[11px] text-primary flex items-center gap-1 hover:text-primary-fixed transition-colors"
                            >
                                Learn More
                                <ArrowUpRight size={11} />
                            </a>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="space-y-3">
                        <h5 className="font-headline font-semibold text-xs text-[#e2e2e2] uppercase tracking-wider">Join The Community</h5>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://x.com/kasplex"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full overflow-hidden bg-surface-container border border-outline-variant/40 hover:border-primary/50 transition-all group"
                            >
                                <img src={Twitter} alt="Twitter / X" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </a>
                            <a
                                href="https://t.me/kasplex_official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full overflow-hidden bg-surface-container border border-outline-variant/40 hover:border-primary/50 transition-all group"
                            >
                                <img src={Telegram} alt="Telegram" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-outline-variant/20 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-[11px] text-outline">
                    <span>Copyright © {currentYear} kasplex.org | All Rights Reserved.</span>
                    <span className="flex items-center gap-2">
                        <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => goPage('/privacypolicy')}>Privacy &amp; Terms</a>
                        <span className="text-outline-variant">|</span>
                        <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => goPage('/mediaKit')}>Media Kit</a>
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

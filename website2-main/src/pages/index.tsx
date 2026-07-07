import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, ArrowUp } from 'lucide-react';
import type { LayoutContext } from '@/types/type';
import { Krc20Url } from '@/utils/constants';

import productImg1 from '@/assets/mission-0.png';
import productImg2 from '@/assets/mission-2.png';
import productImg3 from '@/assets/mission-1.png';
import BannerImgBox from '@/assets/banner-img-box.png';
import BaseBlock from '@/assets/based-block.png';

const L2DocsUrl = 'http://docs-kasplex.gitbook.io/l2-network';

interface ProductCard {
    img: string;
    title: string;
    status: 'live' | 'dev';
    statusLabel: string;
    subTitle: string;
    desc: string;
    chips?: string[];
    descLine?: string;
    link?: string;
}

const products: ProductCard[] = [
    {
        img: productImg1,
        title: 'KRC20 Protocol',
        status: 'live',
        statusLabel: 'Live Now',
        subTitle: 'KRC20 Token Standard',
        desc: 'The native token standard for Kaspa enables seamless token creation and transfers with minimal gas costs.',
        chips: ['Tokens Deployed: 2,350+', 'Total Tx: 120M+'],
        link: 'http://docs-kasplex.gitbook.io/krc20',
    },
    {
        img: productImg2,
        title: 'Kasplex zkEVM',
        status: 'live',
        statusLabel: 'Live Now',
        subTitle: 'Kasplex zkEVM',
        desc: 'The first Based-Rollup Layer 2 for Kaspa, offering full EVM compatibility with Layer 1 security and decentralization.',
        descLine: 'ZK proofs · L1 Sequencing&DA',
        link: L2DocsUrl,
    },
    {
        img: productImg3,
        title: 'Kasplex newVM',
        status: 'dev',
        statusLabel: 'Under Development',
        subTitle: 'Kasplex newVM',
        desc: 'A lightweight, high-performance VM optimized for scripting automation, loT and gaming on Kaspa.',
        descLine: 'Easy To Learn · Low-Resource Execution',
    },
];

const DiagramLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <p className={`font-mono text-[10px] sm:text-[11px] text-outline uppercase tracking-wider leading-relaxed ${className}`}>{children}</p>
);

const Index: React.FC = () => {
    const { productRef } = useOutletContext<LayoutContext>();

    const goLink = (href?: string) => {
        if (!href) return;
        window.open(href, '_blank');
    };

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

            {/* ------------------ Hero ------------------ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-[#e2e2e2] leading-[1.1] tracking-tight">
                        Building <br className="hidden sm:inline" />
                        The Future Of <span className="text-primary glow-cyan bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Kaspa</span>
                    </h1>

                    <p className="text-sm sm:text-base text-outline leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Empowering Kaspa's Next-Gen Ecosystem.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start">
                        <button
                            onClick={() => goLink(Krc20Url)}
                            className="px-6 py-3 bg-primary text-background hover:bg-secondary font-headline font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-primary/15 active:scale-[0.98] cursor-pointer"
                        >
                            Discover KRC20
                            <ArrowUpRight size={14} />
                        </button>
                        <button
                            onClick={() => goLink(L2DocsUrl)}
                            className="px-6 py-3 bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-outline text-[#e2e2e2] font-headline font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                        >
                            Build On Kasplex L2
                        </button>
                    </div>
                </div>

                {/* Hero visual — original banner artwork */}
                <div className="lg:col-span-5 relative flex justify-center">
                    <div className="w-full max-w-[420px] relative group">
                        <img
                            src={BannerImgBox}
                            alt="Kasplex"
                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            {/* ------------------ Product Matrix ------------------ */}
            <div className="space-y-6 scroll-mt-24" ref={productRef}>
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="font-headline font-bold text-3xl text-[#e2e2e2]">
                        Product <span className="text-primary">Matrix</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.title} className="glass-card rounded-2xl p-6 border-outline-variant space-y-3 hover:border-primary/50 transition-colors flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                    <img src={p.img} alt={p.title} className="w-10 h-10 object-contain" />
                                </div>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border ${
                                    p.status === 'live'
                                        ? 'text-primary bg-primary/10 border-primary/20'
                                        : 'text-warning-amber bg-warning-amber/10 border-warning-amber/20'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'live' ? 'bg-primary animate-pulse' : 'bg-warning-amber'}`}></span>
                                    {p.statusLabel}
                                </span>
                            </div>

                            <h3 className="font-headline font-bold text-[#e2e2e2] text-lg">{p.title}</h3>
                            <p className="font-headline font-semibold text-sm text-secondary">{p.subTitle}</p>
                            <p className="text-xs text-outline leading-relaxed flex-1">{p.desc}</p>

                            {p.chips && (
                                <div className="flex flex-wrap gap-2">
                                    {p.chips.map((chip) => (
                                        <span key={chip} className="font-mono text-[10px] text-primary-fixed bg-secondary-container/30 border border-primary/15 px-2 py-1 rounded">
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {p.descLine && (
                                <p className="font-mono text-[10px] text-primary-fixed">{p.descLine}</p>
                            )}

                            {p.link ? (
                                <a
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-headline font-semibold text-xs text-primary hover:text-primary-fixed transition-colors pt-1"
                                >
                                    Learn More
                                    <ArrowUpRight size={13} />
                                </a>
                            ) : (
                                <span className="text-xs pt-1">&nbsp;</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ------------------ Based Rollup Diagram ------------------ */}
            <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h2 className="font-headline font-bold text-3xl text-[#e2e2e2]">
                        Based Rollup Leveraging <span className="text-primary">Kaspa Layer 1</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-outline leading-relaxed">
                        Kasplex's products leverage the Kaspa Network's consensus sequencing to provide programmability and
                        complex logical zones, while maintaining its high throughput and security.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {/* User transactions */}
                    <div className="glass-card rounded-2xl p-5 space-y-3">
                        <DiagramLabel className="text-center">User Transactions</DiagramLabel>
                        <div className="flex justify-center gap-3 sm:gap-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-outline-variant text-[#e2e2e2] font-mono text-[10px] sm:text-xs flex items-center justify-center"
                                >
                                    TX
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Down arrow: RPC nodes */}
                    <div className="flex items-center justify-center gap-4">
                        <DiagramLabel>RPC Nodes</DiagramLabel>
                        <ArrowDown size={22} className="text-primary" />
                        <DiagramLabel>Each transaction is sent and processed on Layer 1 first</DiagramLabel>
                    </div>

                    {/* Kaspa Layer 1 */}
                    <div className="flex items-stretch gap-3">
                        <div className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl border border-primary/30 bg-surface-container/40 min-w-[90px] sm:min-w-[120px]">
                            <DiagramLabel>Kaspa</DiagramLabel>
                            <span className="font-headline font-bold text-sm sm:text-base text-[#e2e2e2]">LAYER 1</span>
                        </div>
                        <div className="glass-card rounded-2xl flex-1 flex items-center justify-center gap-4 sm:gap-10 py-4 px-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <img key={i} src={BaseBlock} alt="block" className="w-10 sm:w-16 h-auto object-contain" />
                            ))}
                        </div>
                    </div>

                    {/* Between-layers arrows */}
                    <div className="flex items-center justify-center gap-4">
                        <DiagramLabel className="text-right">Read and execute<br />sequenced transaction</DiagramLabel>
                        <ArrowDown size={22} className="text-primary" />
                        <ArrowUp size={22} className="text-primary" />
                        <DiagramLabel>1 transaction containing<br />the proof is sent to Layer 1</DiagramLabel>
                    </div>

                    {/* Kasplex Layer 2 */}
                    <div className="flex items-stretch gap-3">
                        <div className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl border border-primary/30 bg-surface-container/40 min-w-[90px] sm:min-w-[120px]">
                            <DiagramLabel>Kasplex</DiagramLabel>
                            <span className="font-headline font-bold text-sm sm:text-base text-[#e2e2e2]">LAYER 2</span>
                        </div>
                        <div className="glass-card rounded-2xl flex-1 flex items-center justify-center gap-4 sm:gap-10 py-5 px-4">
                            {['KRC20', 'zkEVM', 'newVM'].map((vm) => (
                                <span
                                    key={vm}
                                    className="px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-secondary-container/30 border border-primary/25 font-mono text-[11px] sm:text-xs text-primary-fixed"
                                >
                                    {vm}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Index;

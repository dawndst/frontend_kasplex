import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadFile, sleep } from '@/utils/utils';

import logoDarkSvg from '@/assets/download/logo-svg-dark.svg';
import logoLightSvg from '@/assets/download/logo-svg-light.svg';
import logoDarkPng from '@/assets/download/logo-png-dark2x.png';
import logoLightPng from '@/assets/download/logo-png-light.png';

import iconDarkSvg from '@/assets/download/icon-dark.svg';
import iconLightSvg from '@/assets/download/icon-light.svg';
import iconDarkPng from '@/assets/download/icon-dark-png.png';
import iconLightPng from '@/assets/download/icon-light-png3x.png';

interface MediaKitCard {
    title: string;
    variant: 'dark' | 'light';
    svg: string;
    png: string;
    isIcon: boolean;
}

const mediaKitList: MediaKitCard[] = [
    {
        title: 'ON DARK',
        variant: 'dark',
        svg: logoDarkSvg,
        png: logoDarkPng,
        isIcon: false,
    },
    {
        title: 'ON LIGHT',
        variant: 'light',
        svg: logoLightSvg,
        png: logoLightPng,
        isIcon: false,
    },
    {
        title: 'ICONS ON DARK',
        variant: 'dark',
        svg: iconDarkSvg,
        png: iconDarkPng,
        isIcon: true,
    },
    {
        title: 'ICONS ON LIGHT',
        variant: 'light',
        svg: iconLightSvg,
        png: iconLightPng,
        isIcon: true,
    },
];

const MediaKit: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (loading) return;
        try {
            setLoading(true);
            await sleep(300);
            await downloadFile('/download/assets.zip', 'assets.zip');
        } catch (err) {
            console.error('download error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

            {/* ------------------ Banner ------------------ */}
            <div className="text-center space-y-6 pt-6 sm:pt-10">
                <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-[#e2e2e2] leading-[1.1] tracking-tight">
                    Brand <span className="text-primary glow-cyan bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Assets</span>
                </h1>

                <div className="flex justify-center">
                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-background hover:bg-secondary font-headline font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-primary/15 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Download size={14} />
                        )}
                        Download All Assets
                    </button>
                </div>
            </div>

            {/* ------------------ Cards ------------------ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mediaKitList.map((item) => (
                    <div
                        key={item.title}
                        className="glass-card rounded-2xl p-5 sm:p-6 border-outline-variant hover:border-primary/50 transition-colors flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-[10px] sm:text-[11px] text-outline uppercase tracking-widest">
                                {item.title}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => downloadFile(item.svg, 'logo.svg')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant hover:border-primary hover:text-primary text-[#e2e2e2] font-mono text-[11px] transition-colors cursor-pointer"
                                >
                                    <Download size={12} />
                                    SVG
                                </button>
                                <button
                                    onClick={() => downloadFile(item.png, 'logo.png')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant hover:border-primary hover:text-primary text-[#e2e2e2] font-mono text-[11px] transition-colors cursor-pointer"
                                >
                                    <Download size={12} />
                                    PNG
                                </button>
                            </div>
                        </div>

                        <div
                            className={`rounded-xl flex items-center justify-center h-44 sm:h-52 px-6 ${
                                item.variant === 'dark'
                                    ? 'bg-surface-container-lowest border border-outline-variant/60'
                                    : 'bg-[#f5f6f6] border border-white/60'
                            }`}
                        >
                            <img
                                src={item.svg}
                                alt={item.title}
                                className={`object-contain ${item.isIcon ? 'h-14 sm:h-16 w-auto' : 'h-10 sm:h-12 w-auto max-w-[70%]'}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default MediaKit;

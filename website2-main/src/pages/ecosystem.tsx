import React, { useState, useMemo } from "react";
import { Star } from "lucide-react";
import Masonry from "react-masonry-css";
import { TAGS, ecoSystem } from "@/utils/constants";
import Particles from "@/components/Particles";
import type { ListData } from "@/types/type";
import { openUrl } from "@/utils/utils";
import NoData from "@/assets/no-data-kasplex.svg";

const LOGO_FALLBACK =
    "data:image/png;base64,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";

const Ecosystem: React.FC = () => {
    const [currentTab, setCurentTab] = useState("All");
    const [currentTag, setCurrentTag] = useState("");
    const [openName, setOpenName] = useState<string | null>(null);

    const list = useMemo(() => {
        return [...ecoSystem].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
    }, []);

    const breakpointColumnsObj = {
        default: 3,
        1200: 2,
        768: 1,
    };

    const changeTag = (key: string) => {
        if (key === 'All') {
            setCurrentTag("");
        }
        setCurentTab(key);
    };

    const showList = useMemo(() => {
        return list
            .filter(item =>
                currentTab === 'All'
                    ? true
                    : currentTab.includes(item.types.toString())
            )
            .filter(item =>
                currentTag
                    ? item.tag?.includes(currentTag) || item.tag === currentTag
                    : true
            )
            .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
    }, [list, currentTab, currentTag]);

    const setOpenStatus = (name: string) => {
        setOpenName(prev => (prev === name ? null : name));
    };

    return (
        <div className="relative">
            {/* Particles background behind the hero */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[55vh]">
                <Particles
                    particleColors={['#005f62', '#4da9a6']}
                    particleCount={220}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={50}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation={false}
                />
            </div>

            <main className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* ------------------ Hero ------------------ */}
                <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 sm:pt-14">
                    <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-[#e2e2e2] leading-[1.1] tracking-tight">
                        What&rsquo;s on <span className="text-primary glow-cyan bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Kasplex</span>
                    </h1>
                    <p className="text-sm sm:text-base text-outline leading-relaxed">
                        The below listed are projects on the first EVM L2 on Kaspa, they range from DeFi to infrastracture tools. They&rsquo;re shaping the future of Kaspa&rsquo;s programmable layer.<br /> Join our ecosystem to build, collaborate, and shape the next wave of applications together
                    </p>
                </div>

                {/* ------------------ Filter tabs ------------------ */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {TAGS.map(item => (
                        <button
                            key={item.key}
                            onClick={() => changeTag(item.key)}
                            className={`px-4 py-2 rounded-full font-headline font-semibold text-xs tracking-wider uppercase border transition-all cursor-pointer ${
                                currentTab === item.key
                                    ? 'bg-primary/10 text-primary border-primary/30'
                                    : 'bg-surface-container/40 text-outline border-outline-variant hover:text-[#e2e2e2] hover:border-outline'
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* ------------------ Masonry list ------------------ */}
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-5"
                    columnClassName="pl-5 bg-clip-padding"
                >
                    {showList.length > 0 && (
                        showList.map((item: ListData) => {
                            const expanded = openName === item.name;
                            return (
                                <div
                                    key={item.name}
                                    onClick={() => openUrl(item.href)}
                                    className="glass-card rounded-2xl p-5 mb-5 cursor-pointer group hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-[50px] h-[50px] rounded-xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                                            <img
                                                src={item.logo}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    const img = e.currentTarget;
                                                    if (img.src !== LOGO_FALLBACK) {
                                                        img.src = LOGO_FALLBACK;
                                                    }
                                                }}
                                            />
                                        </div>
                                        {item.isStar && (
                                            <span className="inline-flex items-center justify-center rounded-lg bg-secondary-container/30 border border-primary/25 text-primary p-1.5">
                                                <Star size={14} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>

                                    <h6
                                        onClick={() => openUrl(item.href)}
                                        className="font-headline font-bold text-lg text-[#e2e2e2] mt-3 mb-2 group-hover:text-primary transition-colors"
                                    >
                                        <strong>{item.name}</strong>
                                    </h6>

                                    <p
                                        className={`text-xs text-outline leading-relaxed break-words min-h-[58px] ${expanded ? '' : 'line-clamp-3'}`}
                                        dangerouslySetInnerHTML={{ __html: item.desc! }}
                                    ></p>

                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-mono text-[10px] text-primary-fixed bg-secondary-container/30 border border-primary/15 px-2 py-1 rounded">
                                            {item.types[0]}
                                        </span>
                                        {item.desc!.length > 150 && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenStatus(item.name);
                                                }}
                                                className="font-headline font-semibold text-xs text-primary hover:text-primary-fixed transition-colors cursor-pointer"
                                            >
                                                {expanded ? "Less" : "More"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {showList.length == 0 && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <img src={NoData} alt="" className="w-24 h-auto opacity-80" />
                        </div>
                    )}
                </Masonry>
            </main>
        </div>
    );
};

export default Ecosystem;

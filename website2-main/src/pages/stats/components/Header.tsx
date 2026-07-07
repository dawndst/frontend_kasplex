import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import logo from '@/assets/LOGO1-1.png';

const local = window.location.origin;
const topNavItems = [
  {
    key: 'stats',
    label: 'Stats',
    href: `${local}/#/stats`,
    active: true,
  },
  {
    key: 'explorer',
    label: 'Explorer',
    href: 'https://explorer.kasplex.org/',
    active: false,
  },
];

const StatsHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-[#121414]/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-8">
        <div className="flex items-center cursor-pointer select-none group" onClick={() => navigate('/')}>
          <img src={logo} alt="Kasplex" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
        </div>

        <nav className="flex items-center gap-1.5">
          {topNavItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-1.5 rounded-xl font-headline text-sm font-semibold tracking-wide transition-all relative flex items-center gap-1 ${
                item.active ? 'text-primary' : 'text-outline hover:text-[#e2e2e2]'
              }`}
            >
              {item.label}
              {!item.active && <ArrowUpRight size={12} />}
              {item.active && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default StatsHeader;

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { usePortfolio } from '../PortfolioProvider';

export default function Header() {
  const location = useLocation();
  const { portfolio } = usePortfolio();
  
  const navItems = [
    { name: 'PORTFOLIO', path: '/' },
    { name: 'BLOGS', path: '/blog' },
    { name: 'WORK', path: '/work' },
    { name: 'FUN', path: '/fun' },
  ];

  const getCvUrl = (url?: string) => {
    if (!url) return '#';
    // Google Drive direct download link conversion
    if (url.includes('drive.google.com')) {
      const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1];
      if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
    }
    return url;
  };

  const cvDownloadUrl = getCvUrl(portfolio?.cvUrl);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-mono font-bold tracking-tighter flex items-center gap-3">
          <div className="w-3 h-3 bg-black"></div>
          <span className="text-sm tracking-[0.2em]">HERMITS</span>
        </Link>
        
        <nav className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 mr-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-mono text-[9px] font-bold tracking-widest transition-all ${
                  location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'opacity-100 underline underline-offset-4'
                    : 'opacity-40 hover:opacity-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <a
            href={cvDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="Akshat_CV.pdf"
            className="border-2 border-black px-4 py-1.5 text-[9px] font-mono font-bold hover:bg-black hover:text-white transition-all uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-[-2px] active:translate-y-0"
          >
            Download CV
          </a>
        </nav>
      </div>
    </header>
  );
}
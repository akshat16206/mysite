import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const navItems = [
    { name: 'PORTFOLIO', path: '/' },
    { name: 'BLOGS', path: '/blog' },
    { name: 'WORK', path: '/work' },
    { name: 'FUN', path: '/fun' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-mono font-bold tracking-tighter flex items-center gap-2">
          <div className="w-4 h-4 bg-black animate-pulse"></div>
          Hermits
        </Link>
        
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-mono text-[10px] tracking-tight transition-all pb-1 border-b-2 ${
                location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? 'border-black opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/cv"
            className="pixel-btn text-[10px] font-mono font-bold"
          >
            Download CV
          </Link>
        </nav>
      </div>
    </header>
  );
}

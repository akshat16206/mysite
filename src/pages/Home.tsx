import { usePortfolio } from '../PortfolioProvider';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  // Google Drive link conversion
  if (url.includes('drive.google.com')) {
    const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1];
    if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  }
  return url;
};

export default function Home() {
  const { portfolio, socialLinks, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-4xl mb-4">Welcome</h1>
        <p className="opacity-60">Please log in to the admin panel to set up your portfolio data.</p>
      </div>
    );
  }

  const photoUrl = getDirectImageUrl(portfolio.photoUrl);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-grid min-h-screen font-mono">
      <main className="grid lg:grid-cols-3 gap-6 pt-10">
        {/* Identity & Visual Ref Module */}
        <section className="lg:col-span-2 text-black">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group pixel-border bg-white p-12 scan-container relative h-full"
          >
            <div className="scan-line"></div>
            <div className="absolute top-4 right-6 font-mono text-[9px] opacity-20 hidden md:block">
              SERIAL_NO: {portfolio.name.substring(0, 3).toUpperCase()}_{new Date().getFullYear()}
            </div>
            
            <div className="text-[10px] mb-6 opacity-40 font-mono tracking-[0.3em]"></div>
            
            <div className="flex flex-col justify-between h-full">
              <div className="flex-grow">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 leading-[0.8]">
                  {portfolio.name.toUpperCase()}
                </h1>
                <p className="font-mono text-xs leading-relaxed max-w-xl opacity-70 border-l-2 border-black pl-6 my-8">
                  {portfolio.education}.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {socialLinks.map((link) => (
                  <motion.a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ x: 2, y: -2 }}
                    className="border border-black px-3 py-1.5 text-[8px] font-mono font-bold uppercase tracking-widest transition-all bg-white"
                  >
                    {link.platform}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group pixel-border bg-white p-6 overflow-hidden relative aspect-square scan-container brackets h-full"
          >
             <div className="scan-line"></div>
             {photoUrl && (
               <img 
                 src={photoUrl} 
                 alt={portfolio.name} 
                 className="w-full absolute inset-0 object-cover grayscale brightness-110"
                 referrerPolicy="no-referrer"
                 onError={(e) => {
                   (e.target as HTMLImageElement).style.display = 'none';
                 }}
               />
             )}
             <div className="relative z-10 pointer-events-none">
                <div className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] font-mono"></div>
                {!photoUrl && <div className="mt-20 text-center opacity-20 font-mono text-[10px]">IMG_NULL</div>}
             </div>
          </motion.div>
        </section>

        {/* Triple Grid Modules */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="group pixel-border bg-white p-8 scan-container brackets flex flex-col hover:shadow-none transition-all duration-300"
          >
            <div className="scan-line"></div>
            <div className="flex justify-between items-center mb-6">
              <div className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] font-mono">Introduction</div>
              <div className="text-[8px] font-mono opacity-30"></div>
            </div>
            <div className="font-sans text-xs leading-relaxed opacity-80 flex-grow">
              <MarkdownRenderer content={portfolio.description} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group pixel-border bg-white p-8 scan-container brackets flex flex-col hover:shadow-none transition-all duration-300"
          >
            <div className="scan-line"></div>
            <div className="flex justify-between items-center mb-6">
              <div className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] font-mono">Experience</div>
              <div className="text-[8px] font-mono opacity-30"></div>
            </div>
            <div className="font-sans text-[11px] leading-relaxed opacity-70 flex-grow">
              <MarkdownRenderer content={portfolio.experience} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="group pixel-border bg-white p-8 scan-container brackets flex flex-col hover:shadow-none transition-all duration-300"
          >
            <div className="scan-line"></div>
            <div className="flex justify-between items-center mb-6">
              <div className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] font-mono">Skills</div>
              <div className="text-[8px] font-mono opacity-30"></div>
            </div>
            <div className="font-mono text-[10px] leading-relaxed opacity-80 list-square flex-grow">
              <MarkdownRenderer content={portfolio.skills} />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
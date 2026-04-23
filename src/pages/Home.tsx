import { usePortfolio } from '../PortfolioProvider';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-grid min-h-screen">
      <main className="grid lg:grid-cols-3 gap-6 pt-10">
        {/* Identity Module */}
        <section className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="pixel-border bg-white p-10"
          >
            <div className="font-mono text-[10px] mb-4 opacity-40"></div>
            <h1 className="text-7xl font-bold tracking-tighter mb-6 leading-none">
              {portfolio.name.toUpperCase()}
            </h1>
            <p className="font-mono text-sm leading-relaxed max-w-xl opacity-80">
              Machine Music Maths
            </p>
            <p className="font-mono text-sm leading-relaxed max-w-xl opacity-80">
              (!o,o~)
            </p>
            
            <div className="flex gap-3 mt-10">
              {socialLinks.map((link) => (
                <motion.a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.9 }}
                  className="pixel-btn text-[10px] font-mono font-bold"
                >
                  {link.platform.toUpperCase()}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, type: "spring" }}
               className="pixel-border bg-white p-8"
             >
               <div className="font-mono text-[10px] mb-6 opacity-40 uppercase tracking-widest">Description</div>
               <div className="font-sans text-sm leading-relaxed opacity-70">
                 <MarkdownRenderer content={portfolio.description} />
               </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, type: "spring" }}
               className="pixel-border bg-white p-8"
             >
               <div className="font-mono text-[10px] mb-6 opacity-40 uppercase tracking-widest">Skills</div>
               <div className="font-sans text-sm leading-relaxed opacity-70">
                 <MarkdownRenderer content={portfolio.skills} />
               </div>
             </motion.div>
          </div>
        </section>

        {/* Sidebar/Process Module */}
        <section className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="pixel-border bg-black text-white p-8 overflow-hidden relative"
          >
             {portfolio.photoUrl && (
               <img 
                 src={portfolio.photoUrl} 
                 alt={portfolio.name} 
                 className="w-full absolute inset-0 object-cover opacity-30 grayscale contrast-125"
                 referrerPolicy="no-referrer"
               />
             )}
             <div className="relative z-10">
               <div className="font-mono text-[10px] mb-4 opacity-40"></div>
               <div className="h-64 w-full flex items-center justify-center border border-white/20">
                 {!portfolio.photoUrl && <div className="font-mono opacity-20">NO_IMG_ASSET</div>}
               </div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pixel-border bg-white p-8"
          >
            <div className="font-mono text-[10px] mb-6 opacity-40 uppercase tracking-widest">Experience</div>
            <div className="font-sans text-sm leading-relaxed opacity-70">
              <MarkdownRenderer content={portfolio.experience} />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

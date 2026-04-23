import { usePortfolio } from '../PortfolioProvider';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function BlogTopics() {
  const { topics, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 bg-grid min-h-screen">
      <header className="mb-16">
        <div className="font-mono text-[10px] mb-2 opacity-40 uppercase tracking-widest"></div>
        <h1 className="text-7xl font-bold tracking-tighter mb-4">WRITINGS</h1>
        <p className="font-mono text-xs opacity-60 max-w-sm leading-relaxed">Systematic observations on Various Topics</p>
      </header>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
          >
            <Link
              to={`/blog/${topic.id}`}
              className="flex items-center justify-between p-6 pixel-border bg-white hover:bg-black hover:text-white transition-all group"
            >
              <div>
                <h2 className="font-mono text-2xl font-bold group-hover:tracking-tighter transition-all">{topic.name}</h2>
                {topic.description && (
                  <p className="font-mono text-[10px] uppercase font-medium tracking-tight mt-2 opacity-50 group-hover:opacity-100">{topic.description}</p>
                )}
              </div>
              <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-20 opacity-40 italic font-mono text-sm">
          NO_DATA_FOUND: Add categories to initialize.
        </div>
      )}
    </div>
  );
}

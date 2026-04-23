import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { FunProject } from '../types';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export default function FunProjects() {
  const [projects, setProjects] = useState<FunProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, 'funProjects'));
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FunProject)));
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-grid min-h-screen">
      <header className="mb-20">
        <div className="font-mono text-[10px] mb-2 opacity-40 uppercase tracking-widest">HOBBY_MODULE.v4</div>
        <h1 className="text-7xl font-bold tracking-tighter mb-4">FUN PROJECTS</h1>
        <p className="font-mono text-xs opacity-60 max-w-sm leading-relaxed">Personal sandbox</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 400, damping: 10 }}
            className="group pixel-border bg-white p-8 h-[240px] flex flex-col justify-between hover:bg-black hover:text-white transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[8px] bg-black/5 group-hover:bg-white/10 px-2 py-1 uppercase font-bold tracking-tighter">
                  {project.category}
                </span>
              </div>
              <h3 className="font-mono text-xl font-bold leading-none mb-2">
                {project.title}
              </h3>
              <p className="font-mono text-[10px] leading-relaxed opacity-50 group-hover:opacity-100 line-clamp-3">
                {project.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-widest pt-4 border-t border-black/5 group-hover:border-white/10 mt-auto">
                RUN_SANDBOX <ExternalLink size={10} />
            </div>
          </motion.a>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 opacity-40 font-mono text-sm">
          nothing Updated
        </div>
      )}
    </div>
  );
}

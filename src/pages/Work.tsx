import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Project } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
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
    <div className="max-w-6xl mx-auto px-10 py-12">
      <header className="mb-20">
        <span className="section-label">Archive</span>
        <h1 className="font-serif text-8xl tracking-tighter mb-4">Work</h1>
        <p className="font-sans text-sm opacity-60 max-w-sm">A curated selection of projects and technical work.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block border border-[var(--color-brand-primary)] p-8 h-full flex flex-col justify-between hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] transition-all duration-300"
          >
            <div>
              <span className="font-sans text-[10px] font-bold opacity-40 mb-4 block">{String(index + 1).padStart(2, '0')}.</span>
              {project.imageUrl && (
                <div className="mb-6 aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-[var(--color-brand-primary)]/10">
                   <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <h3 className="font-serif text-3xl mb-4 group-hover:italic transition-all">{project.title}</h3>
              <p className="font-sans text-sm opacity-60 leading-relaxed mb-8 group-hover:opacity-100">{project.description}</p>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-[var(--color-brand-primary)]/10 group-hover:border-[var(--color-brand-secondary)]/20">
               <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Case Study</span>
               <ArrowUpRight size={16} />
            </div>
          </motion.a>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 opacity-40 italic">
          No projects found.
        </div>
      )}
    </div>
  );
}

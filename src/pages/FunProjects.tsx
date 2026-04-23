import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { FunProject } from '../types';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1];
    if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  }
  return url;
};

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
      <div className="flex items-center justify-center min-h-[60vh] bg-grid">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-grid min-h-screen font-mono">
      <header className="mb-20">
        <div className="text-[10px] mb-2 opacity-40 uppercase tracking-widest"></div>
        <h1 className="text-7xl font-bold tracking-tighter mb-4">FUN PROJECTS</h1>
        <p className="text-xs opacity-60 max-w-sm leading-relaxed text-black">Personal sandbox</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, index) => {
          const photoUrl = getDirectImageUrl(project.imageUrl);
          return (
            <motion.a
              key={project.id}
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 400, damping: 10 }}
              className="group pixel-border bg-white p-8 hover:bg-black hover:text-white transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] opacity-30 group-hover:opacity-100 italic">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] bg-black/5 group-hover:bg-white/10 px-2 py-1 uppercase font-bold tracking-tighter">
                    {project.category}
                  </span>
                </div>

                {photoUrl && (
                  <div className="mb-4 aspect-square overflow-hidden pixel-border grayscale hover:grayscale-0 transition-all duration-500">
                     <img src={photoUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <h3 className="text-xl font-bold leading-none mb-2 uppercase">
                  {project.title}
                </h3>
                <p className="text-[10px] leading-relaxed opacity-50 group-hover:opacity-100 line-clamp-3">
                  {project.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest pt-4 border-t border-black/5 group-hover:border-white/10 mt-6">
                  RUN_SANDBOX <ExternalLink size={10} />
              </div>
            </motion.a>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 opacity-40 font-mono text-sm">
          No Data Found
        </div>
      )}
    </div>
  );
}
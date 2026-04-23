import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Project } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1];
    if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  }
  return url;
};

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
      <div className="flex items-center justify-center min-h-[60vh] bg-grid">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-grid min-h-screen font-mono">
      <header className="mb-20">
        <div className="text-[10px] mb-2 opacity-40 uppercase tracking-widest"></div>
        <h1 className="text-7xl font-bold tracking-tighter mb-4">WORK</h1>
        <p className="text-xs opacity-60 max-w-sm leading-relaxed text-black">Notable Projects</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const photoUrl = getDirectImageUrl(project.imageUrl);
          return (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="group pixel-border bg-white p-8 hover:bg-black hover:text-white transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold opacity-40 group-hover:opacity-100">{String(index + 1).padStart(2, '0')}.</span>
                  <span className="text-[8px] font-bold border border-black/10 px-2 py-0.5 group-hover:border-white/20">MODULE_ACCESS</span>
                </div>
                
                {photoUrl && (
                  <div className="mb-8 aspect-video overflow-hidden pixel-border border-black/5 group-hover:border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
                     <img 
                       src={photoUrl} 
                       alt={project.title} 
                       className="w-full h-full object-cover" 
                       referrerPolicy="no-referrer"
                       onError={(e) => {
                         (e.target as HTMLImageElement).style.display = 'none';
                       }}
                     />
                  </div>
                )}
                
                <h3 className="text-3xl font-bold mb-4 tracking-tighter uppercase">{project.title}</h3>
                <p className="text-xs opacity-60 leading-relaxed mb-10 group-hover:opacity-100">{project.description}</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-black/10 group-hover:border-white/10">
                 <span className="text-[9px] font-bold uppercase tracking-widest">DEPLOYMENT_LOG</span>
                 <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.a>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 opacity-40 font-mono text-sm uppercase">
          No projects Found
        </div>
      )}
    </div>
  );
}
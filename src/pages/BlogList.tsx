import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { BlogPost, Topic } from '../types';
import { usePortfolio } from '../PortfolioProvider';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export default function BlogList() {
  const { topicId } = useParams<{ topicId: string }>();
  const { topics } = usePortfolio();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const topicName = topics.find(t => t.id === topicId)?.name || 'Topic';

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!topicId) return;
      const q = query(
        collection(db, 'blogs'), 
        where('topicId', '==', topicId),
        orderBy('createdAt', 'desc')
      );
      // Wait, orderBy might fail if index is not created yet, so I'll handle that
      try {
        const snapshot = await getDocs(q);
        setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      } catch (e) {
        console.error("Index might be needed, falling back to client sort", e);
        const q2 = query(collection(db, 'blogs'), where('topicId', '==', topicId));
        const snapshot = await getDocs(q2);
        const fetchedBlogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setBlogs(fetchedBlogs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      }
      setLoading(false);
    };
    fetchBlogs();
  }, [topicId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-10 py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity mb-12 text-[10px] sans-serif uppercase tracking-[0.2em] font-bold">
        <ChevronLeft size={14} /> Back to Topics
      </Link>
      
      <header className="mb-20">
        <span className="section-label">Archive / {topicName}</span>
        <h1 className="font-serif text-8xl tracking-tighter mb-4">{topicName}</h1>
        <p className="font-sans text-sm opacity-60 max-w-sm"></p>
      </header>

      <div className="space-y-0">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/blog/post/${blog.id}`} className="group block py-10 border-b border-[var(--color-brand-primary)]/10">
               <div className="flex justify-between items-baseline">
                 <h2 className="font-serif text-4xl group-hover:italic transition-all duration-300">{blog.title}</h2>
                 <div className="font-sans text-[10px] uppercase font-bold tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                   {blog.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                 </div>
               </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 opacity-40 italic">
          No articles found in this topic yet.
        </div>
      )}
    </div>
  );
}

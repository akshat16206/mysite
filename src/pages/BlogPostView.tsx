import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BlogPost } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ChevronLeft, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function BlogPostView() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      const docRef = doc(db, 'blogs', blogId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as BlogPost;
        setBlog({ id: docSnap.id, ...data } as BlogPost);
        document.title = `${data.title} | Blog`;
      }
      setLoading(false);
    };
    fetchBlog();

    return () => {
      document.title = 'Professional Portfolio & Blog';
    };
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-4xl mb-4">Post Not Found</h1>
        <Link to="/blog" className="underline opacity-60">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-24 bg-grid min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to={`/blog/${blog.topicId}`} 
          className="inline-flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity mb-10 text-[10px] font-mono uppercase tracking-widest font-bold"
        >
          <ChevronLeft size={14} /> Back
        </Link>
        
        <header className="mb-16 pixel-border bg-white p-10">
          <div className="font-mono text-[9px] mb-4 opacity-40 uppercase tracking-[0.3em]">Blog_ID: {blogId?.substring(0, 8)}</div>
          <h1 className="text-6xl font-bold tracking-tighter mb-10 leading-none">
            {blog.title.toUpperCase()}
          </h1>
          <div className="flex items-center justify-between pt-8 border-t border-black/10 font-mono text-[10px] opacity-60">
            <div className="flex gap-6 uppercase font-bold tracking-widest">
              <span className="bg-black text-white px-2 py-1">AUTH: {blog.author}</span>
              <span className="py-1">TS: {blog.createdAt?.toDate().toLocaleDateString('en-GB').replace(/\//g, '.')}</span>
            </div>
            <button 
              onClick={() => {
                const shareUrl = window.location.href;
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    text: `Check out this post: ${blog.title}`,
                    url: shareUrl
                  }).catch(() => {
                    // Fallback to clipboard if share interface is canceled/fails
                    navigator.clipboard.writeText(shareUrl);
                  });
                } else {
                  navigator.clipboard.writeText(shareUrl);
                  const btn = document.activeElement as HTMLButtonElement;
                  const originalChild = btn.innerHTML;
                  btn.innerText = 'COPIED';
                  setTimeout(() => { btn.innerHTML = originalChild; }, 2000);
                }
              }}
              className="opacity-40 hover:opacity-100 transition-opacity p-2 border border-black/10 flex items-center gap-2 group/btn"
              title="Share post"
            >
              <Share2 size={14} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        <section className="bg-white p-10 pixel-border">
          <MarkdownRenderer content={blog.content} />
        </section>
      </motion.div>
    </article>
  );
}
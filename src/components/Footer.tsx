import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('idle');
    }
  };

  return (
    <footer className="bg-white text-black border-t border-black py-12 px-6 bg-grid">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start font-mono">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest"></div>
          <h2 className="text-2xl font-bold tracking-tighter">CONTACT</h2>
          <p className="text-[10px] opacity-60 leading-relaxed max-w-xs">
            For Tecnical reviews, opinions on my work. 
          </p>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="NAME"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border border-black p-3 focus:bg-black focus:text-white outline-none transition-all text-[10px] font-bold"
            />
            <input
              type="email"
              placeholder="EMAIL"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white border border-black p-3 focus:bg-black focus:text-white outline-none transition-all text-[10px] font-bold"
            />
            <textarea
              placeholder="Message"
              required
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="md:col-span-2 bg-white border border-black p-3 focus:bg-black focus:text-white outline-none transition-all text-[10px] font-bold resize-none"
            />
            <button
              type="submit"
              disabled={status !== 'idle'}
              className="md:col-span-2 pixel-btn text-[10px] font-bold py-3"
            >
              {status === 'success' ? 'sent' : status === 'sending' ? 'UPLOADING...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-6 border-t border-black flex justify-between items-center font-mono text-[9px] font-bold opacity-40 uppercase tracking-tight">
        <div>&copy; {new Date().getFullYear()} Hermits — ALL RIGHTS RESERVED</div>
        <div className="flex gap-6">
           <span>LAT: 28.6139° N</span>
           <span>LNG: 77.2090° E</span>
        </div>
      </div>
    </footer>
  );
}

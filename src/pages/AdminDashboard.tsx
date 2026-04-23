import { useState, useEffect } from 'react';
import { auth, db, loginWithGoogle, logout, isAdmin } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, doc, getDoc, setDoc, updateDoc, 
  onSnapshot, query, addDoc, deleteDoc, serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { PortfolioData, Topic, BlogPost, Project, FunProject, SocialLink, Message } from '../types';
import { 
  User as UserIcon, Layout, FileText, Briefcase, 
  Smile, Share2, Mail, Plus, Trash2, Edit2, Save, X, LogOut
} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authenticating, setAuthenticating] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthenticating(false);
    });
  }, []);

  if (authenticating) return <div className="p-20 text-center">Checking session...</div>;

  if (!user || !isAdmin(user)) {
    return (
      <div className="max-w-md mx-auto my-40 p-12 bg-white rounded-[2rem] shadow-2xl text-center border border-black/5">
        <UserIcon size={48} className="mx-auto mb-6 opacity-20" />
        <h1 className="font-serif text-3xl mb-4">Admin Authentication</h1>
        <p className="opacity-60 mb-8 text-sm">Please sign in with your authorized Google account to manage the website.</p>
        <button 
          onClick={loginWithGoogle}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="p-4 mb-8 bg-black text-white rounded-3xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
            {user.photoURL && <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase tracking-widest opacity-60">Authorized</p>
            <p className="text-sm font-bold truncate">{user.displayName || user.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'portfolio', label: 'Portfolio', icon: UserIcon },
            { id: 'topics', label: 'Topics', icon: Layout },
            { id: 'blogs', label: 'Blogs', icon: FileText },
            { id: 'projects', label: 'Work', icon: Briefcase },
            { id: 'fun', label: 'Fun', icon: Smile },
            { id: 'social', label: 'Social', icon: Share2 },
            { id: 'messages', label: 'Messages', icon: Mail },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-black text-white' : 'hover:bg-black/5 text-black/60'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 mt-8 transition-colors"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-grow min-h-[70vh] bg-white rounded-[2.5rem] p-8 border border-black/5">
        {activeTab === 'portfolio' && <PortfolioManager />}
        {activeTab === 'topics' && <TopicsManager />}
        {activeTab === 'blogs' && <BlogsManager />}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'fun' && <FunProjectsManager />}
        {activeTab === 'social' && <SocialManager />}
        {activeTab === 'messages' && <MessagesManager />}
      </main>
    </div>
  );
}

function PortfolioManager() {
  const [data, setData] = useState<PortfolioData>({
    name: '', photoUrl: '', education: '', description: '', experience: '', skills: '', email: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'portfolio')).then(docSnap => {
      if (docSnap.exists()) setData(docSnap.data() as PortfolioData);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await setDoc(doc(db, 'settings', 'portfolio'), data);
    setSaving(false);
    alert('Portfolio updated!');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif">Portfolio Settings</h2>
      <form onSubmit={handleSave} className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest opacity-40">Name</label>
            <input 
              value={data.name} onChange={e => setData({...data, name: e.target.value})}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest opacity-40">Email</label>
            <input 
              value={data.email} onChange={e => setData({...data, email: e.target.value})}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest opacity-40">Photo URL</label>
          <input 
            value={data.photoUrl} onChange={e => setData({...data, photoUrl: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest opacity-40">Education / Title</label>
          <input 
            value={data.education} onChange={e => setData({...data, education: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest opacity-40">About (Markdown)</label>
          <textarea 
            rows={4} value={data.description} onChange={e => setData({...data, description: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest opacity-40">Experience (Markdown)</label>
          <textarea 
            rows={6} value={data.experience} onChange={e => setData({...data, experience: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest opacity-40">Skills (Markdown)</label>
          <textarea 
            rows={4} value={data.skills} onChange={e => setData({...data, skills: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-black/5 font-mono text-sm"
          />
        </div>

        <button 
          disabled={saving}
          className="py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : <><Save size={16}/> Save Portfolio</>}
        </button>
      </form>
    </div>
  );
}

function TopicsManager() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });

  useEffect(() => {
    return onSnapshot(collection(db, 'topics'), (snap) => {
      setTopics(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic)));
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'topics'), newTopic);
    setNewTopic({ name: '', description: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will not delete blogs but they will become orphaned.')) {
      await deleteDoc(doc(db, 'topics', id));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif">Blog Topics</h2>
      
      <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Topic Name" value={newTopic.name} onChange={e => setNewTopic({...newTopic, name: e.target.value})}
          className="p-4 rounded-xl outline-none" required
        />
        <input 
          placeholder="Description" value={newTopic.description} onChange={e => setNewTopic({...newTopic, description: e.target.value})}
          className="p-4 rounded-xl outline-none"
        />
        <button className="md:col-span-2 py-3 bg-black text-white rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2">
          <Plus size={16}/> Add Topic
        </button>
      </form>

      <div className="grid gap-4">
        {topics.map(topic => (
          <div key={topic.id} className="flex items-center justify-between p-6 border border-black/5 rounded-2xl hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold">{topic.name}</p>
              <p className="text-sm opacity-50">{topic.description}</p>
            </div>
            <button onClick={() => handleDelete(topic.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    onSnapshot(collection(db, 'topics'), (snap) => {
      setTopics(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic)));
    });
    return onSnapshot(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')), (snap) => {
      setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    });
  }, []);

  const handleSave = async () => {
    if (!editingBlog?.title || !editingBlog?.content || !editingBlog?.topicId) return;
    
    if (editingBlog.id) {
      const { id, ...data } = editingBlog;
      await updateDoc(doc(db, 'blogs', id), data);
    } else {
      await addDoc(collection(db, 'blogs'), {
        ...editingBlog,
        author: auth.currentUser?.displayName || 'Akshat',
        createdAt: serverTimestamp(),
        published: true
      });
    }
    setEditingBlog(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this blog post?')) {
      await deleteDoc(doc(db, 'blogs', id));
    }
  };

  if (editingBlog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">{editingBlog.id ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => setEditingBlog(null)} className="p-2 hover:bg-black/5 rounded-full"><X size={20}/></button>
        </div>

        <div className="grid gap-4">
          <input 
            placeholder="Blog Title" value={editingBlog.title || ''} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})}
            className="w-full text-2xl font-serif bg-transparent outline-none border-b border-black/10 focus:border-black py-4"
          />
          
          <select 
            value={editingBlog.topicId || ''} onChange={e => setEditingBlog({...editingBlog, topicId: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none"
          >
            <option value="">Select Topic</option>
            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <textarea 
            rows={20} placeholder="Content (Markdown)" value={editingBlog.content || ''} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})}
            className="w-full p-6 bg-gray-50 rounded-2xl outline-none font-mono text-sm leading-relaxed"
          />

          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              className="flex-grow py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              Save Post
            </button>
            <button 
              onClick={() => setEditingBlog(null)}
              className="px-8 py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Blog Posts</h2>
        <button 
          onClick={() => setEditingBlog({ title: '', content: '', topicId: '', author: '' })}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-widest"
        >
          <Plus size={16}/> New Post
        </button>
      </div>

      <div className="grid gap-4">
        {blogs.map(blog => (
          <div key={blog.id} className="flex items-center justify-between p-6 border border-black/5 rounded-2xl hover:bg-gray-50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold">{blog.title}</p>
                <span className="text-[9px] bg-black/5 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                  {topics.find(t => t.id === blog.topicId)?.name}
                </span>
              </div>
              <p className="text-xs opacity-40">
                {blog.createdAt?.toDate().toLocaleDateString()} • {blog.author}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setEditingBlog(blog)}
                className="p-2 text-black/40 hover:text-black hover:bg-black/5 rounded-lg transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(blog.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    return onSnapshot(query(collection(db, 'projects'), orderBy('order', 'asc')), (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
  }, []);

  const handleSave = async () => {
    if (!editing?.title) return;
    if (editing.id) {
      const { id, ...data } = editing;
      await updateDoc(doc(db, 'projects', id), data);
    } else {
      await addDoc(collection(db, 'projects'), {
        ...editing,
        order: projects.length
      });
    }
    setEditing(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Work Projects</h2>
        <button onClick={() => setEditing({ title: '', description: '', link: '', imageUrl: '' })} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-widest">
          <Plus size={16}/> Add Project
        </button>
      </div>

      {editing && (
        <div className="bg-gray-50 p-6 rounded-3xl grid gap-4">
          <input placeholder="Title" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="p-4 rounded-xl"/>
          <textarea placeholder="Description" value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="p-4 rounded-xl"/>
          <input placeholder="Image URL" value={editing.imageUrl || ''} onChange={e => setEditing({...editing, imageUrl: e.target.value})} className="p-4 rounded-xl"/>
          <input placeholder="Link" value={editing.link || ''} onChange={e => setEditing({...editing, link: e.target.value})} className="p-4 rounded-xl"/>
          <div className="flex gap-4">
            <button onClick={handleSave} className="flex-grow py-3 bg-black text-white rounded-xl uppercase font-bold tracking-widest text-xs">Save</button>
            <button onClick={() => setEditing(null)} className="px-8 py-3 bg-white border border-black/10 rounded-xl uppercase font-bold tracking-widest text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between p-6 border border-black/5 rounded-2xl">
            <div>
              <p className="font-bold">{p.title}</p>
              <p className="text-xs opacity-50 truncate max-w-xs">{p.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="p-2 hover:bg-black/5 rounded-lg"><Edit2 size={18}/></button>
              <button onClick={() => deleteDoc(doc(db, 'projects', p.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunProjectsManager() {
  const [projects, setProjects] = useState<FunProject[]>([]);
  const [editing, setEditing] = useState<Partial<FunProject> | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'funProjects'), (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FunProject)));
    });
  }, []);

  const handleSave = async () => {
    if (!editing?.title || !editing?.externalLink) return;
    if (editing.id) {
      const { id, ...data } = editing;
      await updateDoc(doc(db, 'funProjects', id), data);
    } else {
      await addDoc(collection(db, 'funProjects'), editing);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Fun Projects</h2>
        <button onClick={() => setEditing({ title: '', description: '', externalLink: '', category: '' })} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-widest">
          <Plus size={16}/> Add Hobby
        </button>
      </div>

      {editing && (
        <div className="bg-gray-50 p-6 rounded-3xl grid gap-4">
          <input placeholder="Title" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="p-4 rounded-xl"/>
          <input placeholder="Category" value={editing.category || ''} onChange={e => setEditing({...editing, category: e.target.value})} className="p-4 rounded-xl"/>
          <textarea placeholder="Description" value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="p-4 rounded-xl"/>
          <input placeholder="External URL" value={editing.externalLink || ''} onChange={e => setEditing({...editing, externalLink: e.target.value})} className="p-4 rounded-xl"/>
          <div className="flex gap-4">
            <button onClick={handleSave} className="flex-grow py-3 bg-black text-white rounded-xl uppercase font-bold tracking-widest text-xs">Save</button>
            <button onClick={() => setEditing(null)} className="px-8 py-3 bg-white border border-black/10 rounded-xl uppercase font-bold tracking-widest text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="p-6 border border-black/5 rounded-2xl relative group">
            <span className="text-[10px] uppercase font-bold opacity-30">{p.category}</span>
            <p className="font-bold text-lg">{p.title}</p>
            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(p)} className="p-2 hover:bg-black/5 rounded-lg"><Edit2 size={16}/></button>
              <button onClick={() => deleteDoc(doc(db, 'funProjects', p.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '', icon: '' });

  useEffect(() => {
    return onSnapshot(collection(db, 'socialLinks'), (snap) => {
      setLinks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialLink)));
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'socialLinks'), newLink);
    setNewLink({ platform: '', url: '', icon: '' });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif">Social Links</h2>
      <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-3xl flex gap-4">
        <input placeholder="Platform" value={newLink.platform} onChange={e => setNewLink({...newLink, platform: e.target.value})} className="flex-grow p-4 rounded-xl outline-none" required/>
        <input placeholder="URL" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} className="flex-grow p-4 rounded-xl outline-none" required/>
        <button className="px-8 bg-black text-white rounded-xl text-xs uppercase font-bold tracking-widest">Add</button>
      </form>
      <div className="grid gap-4">
        {links.map(link => (
          <div key={link.id} className="flex items-center justify-between p-4 border border-black/5 rounded-xl">
            <div>
              <p className="font-bold">{link.platform}</p>
              <p className="text-xs opacity-40">{link.url}</p>
            </div>
            <button onClick={() => deleteDoc(doc(db, 'socialLinks', link.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    return onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif">Inbox</h2>
      <div className="grid gap-4">
        {messages.map(msg => (
          <div key={msg.id} className="p-6 bg-gray-50 rounded-3xl relative group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold">{msg.name}</p>
                <p className="text-xs opacity-40">{msg.email}</p>
              </div>
              <p className="text-[10px] uppercase font-bold opacity-30">
                {msg.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
            <p className="text-sm border-t border-black/5 pt-4 opacity-70 leading-relaxed">{msg.message}</p>
            <button 
              onClick={() => deleteDoc(doc(db, 'messages', msg.id))}
              className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {messages.length === 0 && <p className="text-center py-20 opacity-40 italic">No messages yet.</p>}
    </div>
  );
}

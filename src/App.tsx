import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { PortfolioProvider } from './PortfolioProvider';

// Pages
import Home from './pages/Home';
import Work from './pages/Work';
import BlogTopics from './pages/BlogTopics';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPostView';
import FunProjects from './pages/FunProjects';
import AdminDashboard from './pages/AdminDashboard';
import CVView from './pages/CVView';

export default function App() {
  return (
    <PortfolioProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/blog" element={<BlogTopics />} />
              <Route path="/blog/:topicId" element={<BlogList />} />
              <Route path="/blog/post/:blogId" element={<BlogPost />} />
              <Route path="/fun" element={<FunProjects />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/cv" element={<CVView />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PortfolioProvider>
  );
}

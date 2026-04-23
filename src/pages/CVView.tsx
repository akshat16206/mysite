import { usePortfolio } from '../PortfolioProvider';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CVView() {
  const { portfolio, loading } = usePortfolio();

  if (loading) return null;
  if (!portfolio) return <div className="p-20 text-center font-mono">EOF_ERROR: No data found.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen text-black font-mono selection:bg-black selection:text-white p-6 md:p-12">
      {/* Print Controls - Hidden during print */}
      <div className="fixed top-24 right-8 flex gap-3 print:hidden z-50">
        <Link 
          to="/" 
          className="pixel-btn text-[10px] font-bold flex items-center gap-2"
        >
          <ArrowLeft size={12} /> back
        </Link>
        <button 
          onClick={handlePrint}
          className="pixel-btn bg-black text-white text-[10px] font-bold flex items-center gap-2"
        >
          <Printer size={12} /> print
        </button>
      </div>

      <div className="max-w-4xl mx-auto pixel-border bg-white p-12 print:p-0 print:border-none">
        <header className="border-b-2 border-black pb-10 mb-12 flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-[10px] opacity-40"></div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">{portfolio.name}</h1>
            <p className="text-xs font-bold tracking-widest opacity-60 uppercase">{portfolio.education}</p>
          </div>
          <div className="text-right text-[10px] font-bold opacity-60">
            <p>Email: {portfolio.email}</p>
          </div>
        </header>

        <main className="space-y-16">
          <section>
             <div className="flex items-center gap-4 mb-8">
               <div className="h-px flex-grow bg-black/10"></div>
             </div>
             <div className="text-sm leading-relaxed opacity-80">
               <MarkdownRenderer content={portfolio.description} />
             </div>
          </section>

          <section>
             <div className="flex items-center gap-4 mb-8">
               <span className="text-[10px] font-bold bg-black text-white px-2 py-1">EXPERIENCE</span>
               <div className="h-px flex-grow bg-black/10"></div>
             </div>
             <div className="text-sm leading-relaxed opacity-80">
               <MarkdownRenderer content={portfolio.experience} />
             </div>
          </section>

          <section>
             <div className="flex items-center gap-4 mb-8">
               <span className="text-[10px] font-bold bg-black text-white px-2 py-1">Technical SKILLS</span>
               <div className="h-px flex-grow bg-black/10"></div>
             </div>
             <div className="text-sm leading-relaxed opacity-80">
               <MarkdownRenderer content={portfolio.skills} />
             </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          header { border-bottom-color: black !important; }
          @page { margin: 1cm; }
        }
      `}} />
    </div>
  );
}

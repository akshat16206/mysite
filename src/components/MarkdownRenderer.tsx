import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h1 className="text-4xl font-mono font-bold mt-12 mb-6 tracking-tighter uppercase border-b-2 border-black pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-mono font-bold mt-10 mb-5 tracking-tight uppercase">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-mono font-bold mt-8 mb-4 opacity-80 uppercase">{children}</h3>,
          p: ({ children }) => <p className="mb-6 leading-relaxed opacity-80 text-sm">{children}</p>,
          ul: ({ children }) => <ul className="list-square pl-6 mb-6 space-y-2 text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-sm">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed opacity-90">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-black pl-6 my-8 opacity-70 font-mono text-sm leading-relaxed">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[11px] border border-black/5 font-bold">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-50 p-6 rounded-none font-mono text-[11px] overflow-x-auto my-8 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold underline decoration-black/20 hover:decoration-black transition-all"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="pixel-border my-12 mx-auto grayscale hover:grayscale-0 transition-all duration-500 max-h-[600px] object-contain bg-white"
              referrerPolicy="no-referrer"
            />
          ),
          table: ({ children }) => (
             <div className="overflow-x-auto my-8 font-mono text-[10px]">
               <table className="min-w-full border-collapse border border-black">
                 {children}
               </table>
             </div>
          ),
          th: ({ children }) => <th className="border border-black p-3 bg-black text-white text-left font-bold uppercase tracking-tighter">{children}</th>,
          td: ({ children }) => <td className="border border-black p-3 bg-white">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

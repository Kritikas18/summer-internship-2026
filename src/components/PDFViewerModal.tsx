import React, { useState, useRef } from 'react';
import { X, Printer, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';
import { Note } from '../types';

interface PDFViewerModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function PDFViewerModal({ note, isOpen, onClose, darkMode = false }: PDFViewerModalProps) {
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printableRef.current?.innerHTML;
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${note.title} - Academic Study Guide</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body { font-family: Georgia, serif; padding: 40px; color: #1a1a1a; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body class="bg-white">
            <div class="max-w-4xl mx-auto">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contentParagraphs = note.content.split('\n\n').filter(p => p.trim().length > 0);
  
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col justify-between" id="pdf-interactive-modal">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0 text-white select-none">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs tracking-wider">
            PDF
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold truncate max-w-xs md:max-w-lg text-slate-100">{note.fileName || `${note.title.toLowerCase().replace(/\s+/g, '_')}.pdf`}</h3>
            <p className="text-[9px] text-slate-400">Published by @{note.creatorName} • verified scholarly draft</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-xs">
          <button 
            onClick={() => setZoom(prev => Math.max(50, prev - 10))} 
            className="p-1 hover:bg-slate-700 rounded-full transition text-slate-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-300 font-bold w-12 text-center">{zoom}%</span>
          <button 
            onClick={() => setZoom(prev => Math.min(200, prev + 10))} 
            className="p-1 hover:bg-slate-700 rounded-full transition text-slate-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700"></div>

          <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300">Certified Authentic Document</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <span>Copy Note Text</span>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-gradient-to-r from-[#9D8DF1] to-[#7A6AD8] hover:scale-[1.02] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            title="Save as PDF or Print"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg transition ml-2 cursor-pointer"
            title="Close Viewer"
            id="close-pdf-modal-btn"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950/40 overflow-y-auto p-4 md:p-10 flex justify-center relative select-text">
        <div 
          ref={printableRef}
          className="bg-white text-slate-900 p-8 md:p-14 rounded-md shadow-2xl w-full max-w-4xl border border-slate-200/50 min-h-[1100px] relative font-serif"
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transformOrigin: 'top center',
            marginBottom: `${(zoom - 100) > 0 ? (zoom - 100) * 8 : 0}px`
          }}
          id="pdf-printable-paper-sheet"
        >
          <div className="border-b-4 border-slate-900 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-sans text-xs font-extrabold">
                  N
                </div>
                <span className="font-sans font-black tracking-wider uppercase text-xs text-slate-800">Notify Academic Network</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-serif text-slate-900 leading-tight">
                {note.title}
              </h1>
              <p className="font-sans text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
                Subject: {note.subject} • Scholarly Draft Publication
              </p>
            </div>

            <div className="text-left md:text-right font-sans shrink-0">
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-bold text-[9px] rounded uppercase tracking-wider mb-1.5 border border-slate-200">
                Official Study Copy
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Institution: <strong className="text-slate-800">{note.institution}</strong></p>
              <p className="text-[10px] text-slate-500 font-medium">Curator: <strong className="text-slate-800">{note.creatorName}</strong></p>
            </div>
          </div>

          <div className="absolute top-44 right-12 border-4 border-dashed border-red-600/30 text-red-600/30 uppercase font-sans font-black text-[10px] tracking-widest px-3 py-1.5 rounded-lg rotate-12 select-none pointer-events-none flex flex-col items-center">
            <span>Notify Certified</span>
            <span className="text-[7px]">ID: {note.id.toUpperCase()}</span>
          </div>

          <div className="text-sm md:text-base text-slate-800 leading-relaxed space-y-6 select-all font-serif">
            {contentParagraphs.map((para, index) => (
              <p key={index} className="indent-6 text-justify">
                {para}
              </p>
            ))}
          </div>

          <div className="border-t border-slate-200 mt-16 pt-6 flex justify-between items-center text-[10px] text-slate-400 font-sans tracking-wide select-none">
            <div>
              <span>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="text-center italic">
              <span>Notify Academic Repository • Document Page 1 of 1</span>
            </div>
            <div className="text-right font-bold uppercase text-slate-500">
              <span>Classified Academic Resource</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border-t border-slate-800 px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-400 select-none font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span>PDF Interactive Mode Active</span>
        </div>
        <div className="hidden sm:block">
          <span>Notify verified workspace encryption: SSL-256</span>
        </div>
        <div>
          <span>Powered by PDF Canvas &copy; 2026</span>
        </div>
      </div>
    </div>
  );
}

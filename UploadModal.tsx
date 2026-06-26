import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, IndianRupee, QrCode, AlertCircle } from 'lucide-react';
import { Note } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (newNote: Note) => void;
  creatorId: string;
  creatorName: string;
}

export default function UploadModal({ onClose, onUploadSuccess, creatorId, creatorName }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [institution, setInstitution] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [fileType, setFileType] = useState<'text' | 'pdf'>('text');
  const [noteContent, setNoteContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('199');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const subjects = [
    'Computer Science',
    'Medicine',
    'Law',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Business',
    'Literature',
    'History'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      setFileType(file.name.endsWith('.pdf') ? 'pdf' : 'text');
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setNoteContent(text || `Uploaded study resource for ${title || 'academic course'}.\n\nContains detailed lecture and review notes.`);
      };
      if (file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        setNoteContent(`[PDF DOCUMENT ATTACHED: ${file.name}]\n\nStudy guide and review notes on ${subject}.\n\nSection 1: Fundamental Concepts & Frameworks.\nSection 2: Practical Exercises & Examples.\nSection 3: Formula summary & Cheat sheets.`);
      }
    }
  };

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setQrCodeFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !institution) {
      setError('Please fill in title, subject, and institution.');
      return;
    }

    if (!noteContent) {
      setError('Please provide note content or upload a valid file.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalTags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const requestBody = {
        title,
        description,
        content: noteContent,
        subject,
        institution,
        tags: finalTags,
        creatorId,
        creatorName,
        fileType,
        fileName: selectedFileName || `${title.toLowerCase().replace(/\s+/g, '_')}.txt`,
        fileSize: selectedFileSize || '15 KB',
        isPremium,
        price: isPremium ? Number(price) : undefined,
        qrCodeUrl: isPremium ? (qrCodeFile || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_custom`) : undefined,
        isCollaborative
      };

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        throw new Error('Server returned error during notes creation.');
      }

      const createdNote: Note = await res.json();
      setSuccess(true);
      setTimeout(() => {
        onUploadSuccess(createdNote);
        onClose();
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong while publishing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-sans font-bold text-slate-900">Upload & Share Notes</h3>
            <p className="text-xs text-slate-500">Publish study guides, cheat sheets, or notes for your peers</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Notes Published!</h4>
            <p className="text-sm text-slate-500 max-w-sm">
              Your note has been uploaded and indexed successfully. Real-time indicators are compiling.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5" id="upload-form">
            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="note-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                id="note-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-200 py-2 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                placeholder="e.g. Machine Learning Lecture 3: Backpropagation & Optimization"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="note-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="note-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 py-2 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition bg-white"
                >
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="note-institution" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  id="note-institution"
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 py-2 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                  placeholder="e.g. Stanford University"
                />
              </div>
            </div>

            <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.pdf"
                className="hidden"
                id="file-upload-input"
              />
              {selectedFileName ? (
                <div className="flex items-center justify-between bg-white p-3 border border-slate-100 rounded-lg max-w-md mx-auto">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-violet-500" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{selectedFileName}</p>
                      <p className="text-[10px] text-slate-400">{selectedFileSize} • {fileType.toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileName('');
                      setSelectedFileSize('');
                      setNoteContent('');
                    }}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center py-4 cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-violet-400 mb-2" />
                  <p className="text-xs font-medium text-slate-700">Drag & drop or Click to choose note file</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports PDF or formatted TXT (Max 10MB)</p>
                </button>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="note-content" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Note Text / Review Outline
                </label>
                <span className="text-[10px] text-slate-400">Write directly or edit uploaded file content</span>
              </div>
              <textarea
                id="note-content"
                rows={5}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition font-mono bg-slate-50"
                placeholder="Paste or write formulas, questions, outlines, or full lecture notes here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="note-tags" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tags (comma-separated)
                </label>
                <input
                  id="note-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 py-2 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                  placeholder="Exam Prep, Cheat Sheet, Midterm"
                />
              </div>

              <div>
                <label htmlFor="note-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Short Summary
                </label>
                <input
                  id="note-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 py-2 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                  placeholder="Briefly state what topics this note covers"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-violet-50/40 rounded-xl border border-violet-100/50">
              <input
                id="note-collab"
                type="checkbox"
                checked={isCollaborative}
                onChange={(e) => setIsCollaborative(e.target.checked)}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300 rounded"
              />
              <div className="text-left">
                <label htmlFor="note-collab" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Enable Collaboration Mode (Co-authoring)
                </label>
                <p className="text-[10px] text-slate-500">Allows other scholars to edit and view updates in real-time</p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Paid / Premium Resource</h4>
                  <p className="text-[10px] text-slate-500">Sell this notes pack for a small fee</p>
                </div>
                <button
                  type="button"
                  id="premium-toggle-btn"
                  onClick={() => setIsPremium(!isPremium)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPremium ? 'bg-violet-600' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPremium ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {isPremium && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label htmlFor="note-price" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Price (INR)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <input
                        id="note-price"
                        type="number"
                        step="1"
                        min="5"
                        max="10000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-9 block w-full rounded-xl border border-slate-200 py-2 px-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment QR Code</span>
                    <input
                      type="file"
                      ref={qrInputRef}
                      onChange={handleQrChange}
                      accept="image/*"
                      className="hidden"
                      id="qr-upload-input"
                    />
                    {qrCodeFile ? (
                      <div className="mt-1 flex items-center justify-between bg-white p-2 border border-slate-100 rounded-xl text-xs">
                        <div className="flex items-center space-x-2">
                          <QrCode className="h-4 w-4 text-violet-500" />
                          <span className="font-mono text-[10px] text-slate-500 truncate max-w-[100px]">QR_Attached.png</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQrCodeFile(null)}
                          className="text-[10px] text-red-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => qrInputRef.current?.click()}
                        className="mt-1 w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-dashed border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer text-xs font-medium text-slate-600"
                      >
                        <Upload className="h-3.5 w-3.5 text-violet-400" />
                        <span>Upload Custom QR</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="publish-note-btn"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Publishing Review Note...' : 'Publish Note'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Upload,
  BookMarked,
  Layout,
  TrendingUp,
  FileText,
  Star,
  Download,
  Users,
  ChevronLeft,
  Coins,
  ShieldCheck,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
  Check,
  FileDown,
  LineChart,
  Crown,
  LogOut,
  CheckCircle2,
  Settings,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { Note, User } from './types';
import Login from './components/Login';
import UploadModal from './components/UploadModal';
import StudyCarousel from './components/StudyCarousel';
import PDFViewerModal from './components/PDFViewerModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'my-notes' | 'bookmarks' | 'analytics' | 'premium'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('notify-dark-mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('notify-dark-mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const [activeViewerTab, setActiveViewerTab] = useState<'summary' | 'plagiarism' | 'versions' | 'reviews'>('summary');
  
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  const [plagiarismReport, setPlagiarismReport] = useState<any | null>(null);
  const [loadingPlagiarism, setLoadingPlagiarism] = useState(false);
  
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [coAuthorContent, setCoAuthorContent] = useState('');
  const [changeSummary, setChangeSummary] = useState('');
  const [collabNotification, setCollabNotification] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<{ name: string; color: string; x: number; y: number }[]>([]);

  const [showAnnotationInput, setShowAnnotationInput] = useState<{ x: number; y: number } | null>(null);
  const [newAnnotationText, setNewAnnotationText] = useState('');

  const [unlockingNoteId, setUnlockingNoteId] = useState<string | null>(null);
  const [purchasedNoteIds, setPurchasedNoteIds] = useState<string[]>([]);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'scanning' | 'completed'>('idle');

  const [fileSyncCount, setFileSyncCount] = useState(0);
  const [latency, setLatency] = useState(14);

  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, selectedSubject]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(35, prev + delta));
      });

      if (Math.random() > 0.7) {
        setFileSyncCount(prev => (prev + 1) % 4);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedNote || !selectedNote.isCollaborative) {
      setCollaborators([]);
      return;
    }

    const names = ['Priya Sharma (IIT)', 'Dr. Ishaan Sen (AIIMS)', 'Ananya Iyer (IISc)'];
    const colors = ['bg-emerald-500', 'bg-sky-500', 'bg-amber-500'];
    
    setCollaborators([
      { name: names[0], color: colors[0], x: 40, y: 35 },
      { name: names[1], color: colors[1], x: 75, y: 65 }
    ]);

    const randomTypingInterval = setInterval(() => {
      const randomCollab = names[Math.floor(Math.random() * names.length)];
      setCollabNotification(`${randomCollab} is writing standard revisions...`);
      setTimeout(() => setCollabNotification(null), 3500);

      setCollaborators(prev => prev.map(c => ({
        ...c,
        x: Math.max(10, Math.min(90, c.x + (Math.floor(Math.random() * 21) - 10))),
        y: Math.max(15, Math.min(85, c.y + (Math.floor(Math.random() * 21) - 10)))
      })));
    }, 8000);

    return () => clearInterval(randomTypingInterval);
  }, [selectedNote]);

  const fetchNotes = async () => {
    try {
      let url = '/api/notes';
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedSubject && selectedSubject !== 'All') params.append('subject', selectedSubject);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleSelectNote = async (note: Note) => {
    try {
      const res = await fetch(`/api/notes/${note.id}`);
      if (res.ok) {
        const fullNote = await res.json();
        setSelectedNote(fullNote);
        setCoAuthorContent(fullNote.content);
        setIsPdfOpen(true);
        setAiSummary('');
        setPlagiarismReport(null);
        setCurrentPage(1);
        setZoomLevel(100);
      }
    } catch (err) {
      console.error('Failed to load note detail:', err);
    }
  };

  const handleDownload = async (note: Note) => {
    try {
      const res = await fetch(`/api/notes/${note.id}/download`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        if (selectedNote && selectedNote.id === note.id) {
          setSelectedNote(prev => prev ? { ...prev, downloads: result.downloads } : null);
        }
        setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: result.downloads } : n));
        
        const element = document.createElement("a");
        const file = new Blob([note.content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = note.fileName || `${note.title.toLowerCase().replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleTriggerSummary = async () => {
    if (!selectedNote) return;
    setLoadingSummary(true);
    setAiSummary('');
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}/summarize`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleTriggerPlagiarism = async () => {
    if (!selectedNote) return;
    setLoadingPlagiarism(true);
    setPlagiarismReport(null);
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}/plagiarism-check`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPlagiarismReport(data);
      }
    } catch (err) {
      console.error('Plagiarism check error:', err);
    } finally {
      setLoadingPlagiarism(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote || !user) return;
    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/notes/${selectedNote.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: commentInput,
          rating: ratingInput,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedNote(updated);
        setNotes(prev => prev.map(n => n.id === updated.id ? { ...n, rating: updated.rating, ratingsCount: updated.ratingsCount } : n));
        setCommentInput('');
        setRatingInput(5);
      }
    } catch (err) {
      console.error('Review submission error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSaveRevision = async () => {
    if (!selectedNote || !user) return;
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: coAuthorContent,
          title: selectedNote.title,
          changeSummary: changeSummary || 'Collaborative co-authored adjustment',
          updatedBy: user.name
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedNote(updated);
        setNotes(prev => prev.map(n => n.id === updated.id ? { ...n, content: updated.content, versions: updated.versions } : n));
        setChangeSummary('');
        setCollabNotification('Your revision has been securely merged into the version timeline.');
        setTimeout(() => setCollabNotification(null), 4000);
      }
    } catch (err) {
      console.error('Failed to submit collaborative edit:', err);
    }
  };

  const handleAddAnnotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote || !showAnnotationInput || !user) return;

    try {
      const res = await fetch(`/api/notes/${selectedNote.id}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: currentPage,
          x: showAnnotationInput.x,
          y: showAnnotationInput.y,
          text: newAnnotationText,
          author: user.name
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedNote(updated);
        setNewAnnotationText('');
        setShowAnnotationInput(null);
      }
    } catch (err) {
      console.error('Failed to save annotation:', err);
    }
  };

  const handleDeleteAnnotation = async (annId: string) => {
    if (!selectedNote) return;
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}/annotations/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annotationId: annId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedNote(updated);
      }
    } catch (err) {
      console.error('Delete annotation error:', err);
    }
  };

  const handleSimulatePayment = (noteId: string) => {
    setUnlockingNoteId(noteId);
    setPaymentStep('scanning');
    
    setTimeout(() => {
      setPaymentStep('completed');
      setTimeout(() => {
        setPurchasedNoteIds(prev => [...prev, noteId]);
        setPaymentStep('idle');
        setUnlockingNoteId(null);
      }, 1500);
    }, 2000);
  };

  const handleJoinPremiumTier = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
  };

  const filteredNotes = notes.filter(n => {
    if (activeTab === 'my-notes') {
      return n.creatorId === user?.id || n.isCollaborative;
    }
    if (activeTab === 'bookmarks') {
      return bookmarkedIds.includes(n.id);
    }
    return true;
  });

  const subjectsList = ['All', 'Computer Science', 'Medicine', 'Law', 'Chemistry', 'Physics', 'Mathematics', 'Business', 'Literature'];

  const totalViews = notes.filter(n => n.creatorId === user?.id || n.creatorId === 'user-student').reduce((acc, n) => acc + n.views, 0);
  const totalDownloads = notes.filter(n => n.creatorId === user?.id || n.creatorId === 'user-student').reduce((acc, n) => acc + n.downloads, 0);
  const averageRating = 4.8;
  const rawEarnings = notes.filter(n => n.creatorId === user?.id || n.creatorId === 'user-student').reduce((acc, n) => acc + (n.isPremium ? (n.price || 0) * n.downloads : 0), 0);
  const creatorEarnings = Number((rawEarnings * 0.8).toFixed(2));
  const platformFee = Number((rawEarnings * 0.2).toFixed(2));

  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F8FF]/60 dark:bg-[#0B0A11]/75 text-[#2D2A3E] dark:text-[#E6E6FA] flex flex-col md:flex-row font-sans antialiased overflow-hidden h-screen relative" id="app-root">
      
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-100 transition-all duration-500"
        style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ4rrGXHHvCZB_2_GODAKhdiTEwlGqZtSxWwJEJzklcYNnz6y4Saiez4o&s=10')` }}
      />
      <div className="absolute inset-0 bg-slate-950/15 dark:bg-black/35 z-0 pointer-events-none" />
      
      <aside className="w-full md:w-64 bg-white/75 dark:bg-[#13121F]/75 backdrop-blur-2xl border-r border-[#E6E1FF]/50 dark:border-[#222033]/50 p-5 flex flex-col justify-between shrink-0 h-auto md:h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]" id="sidebar-container">
        <div>
          <div className="flex items-center gap-3 mb-8" id="logo-header">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9D8DF1] to-[#7A6AD8] rounded-xl flex items-center justify-center text-white shadow-md shadow-violet-100 dark:shadow-none">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#2D2A3E] dark:text-white">notify</h1>
              <p className="text-[9px] uppercase tracking-widest font-bold text-[#9D8DF1]">Academic Platform</p>
            </div>
          </div>

          <nav className="space-y-1.5" id="sidebar-navigation">
            <button
              onClick={() => { setActiveTab('explore'); setSelectedNote(null); }}
              className={`w-full flex items-center gap-3 p-3 font-semibold rounded-xl text-sm transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-[#F3F0FF] dark:bg-[#24223D] text-[#9D8DF1] dark:text-[#BDB2FF] font-extrabold' : 'text-slate-950 dark:text-slate-100 hover:bg-[#F9F8FF]/80 dark:hover:bg-[#1A192A]/80 hover:text-black dark:hover:text-white'}`}
            >
              <Layout className="w-4 h-4" />
              <span>Explore Hub</span>
            </button>

            <button
              onClick={() => { setActiveTab('my-notes'); setSelectedNote(null); }}
              className={`w-full flex items-center gap-3 p-3 font-semibold rounded-xl text-sm transition-all cursor-pointer ${activeTab === 'my-notes' ? 'bg-[#F3F0FF] dark:bg-[#24223D] text-[#9D8DF1] dark:text-[#BDB2FF] font-extrabold' : 'text-slate-950 dark:text-slate-100 hover:bg-[#F9F8FF]/80 dark:hover:bg-[#1A192A]/80 hover:text-black dark:hover:text-white'}`}
            >
              <FileText className="w-4 h-4" />
              <span>My Scholars Desk</span>
            </button>

            <button
              onClick={() => { setActiveTab('bookmarks'); setSelectedNote(null); }}
              className={`w-full flex items-center gap-3 p-3 font-semibold rounded-xl text-sm transition-all cursor-pointer ${activeTab === 'bookmarks' ? 'bg-[#F3F0FF] dark:bg-[#24223D] text-[#9D8DF1] dark:text-[#BDB2FF] font-extrabold' : 'text-slate-950 dark:text-slate-100 hover:bg-[#F9F8FF]/80 dark:hover:bg-[#1A192A]/80 hover:text-black dark:hover:text-white'}`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Bookmarks</span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setSelectedNote(null); }}
              className={`w-full flex items-center gap-3 p-3 font-semibold rounded-xl text-sm transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-[#F3F0FF] dark:bg-[#24223D] text-[#9D8DF1] dark:text-[#BDB2FF] font-extrabold' : 'text-slate-950 dark:text-slate-100 hover:bg-[#F9F8FF]/80 dark:hover:bg-[#1A192A]/80 hover:text-black dark:hover:text-white'}`}
            >
              <LineChart className="w-4 h-4" />
              <span>Creator Analytics</span>
            </button>

            <button
              onClick={() => { setActiveTab('premium'); setSelectedNote(null); }}
              className={`w-full flex items-center justify-between p-3 font-semibold rounded-xl text-sm transition-all cursor-pointer ${activeTab === 'premium' ? 'bg-[#F3F0FF] dark:bg-[#24223D] text-[#9D8DF1] dark:text-[#BDB2FF] font-extrabold' : 'text-slate-950 dark:text-slate-100 hover:bg-[#F9F8FF]/80 dark:hover:bg-[#1A192A]/80 hover:text-black dark:hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Premium Plan</span>
              </div>
              {!user.isPremium && <span className="bg-amber-100 dark:bg-amber-950 dark:text-amber-300 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Upgrade</span>}
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t border-[#E6E1FF]/60 dark:border-[#222033]" id="institutions-sidebar-section">
            <div className="text-[10px] uppercase tracking-widest font-black text-slate-900 dark:text-slate-200 px-3 mb-2">My Topics</div>
            <button onClick={() => { setSelectedSubject('Computer Science'); setActiveTab('explore'); }} className="w-full text-left text-xs text-slate-950 dark:text-slate-100 hover:text-[#9D8DF1] font-bold py-1.5 px-3 transition block truncate cursor-pointer"># Artificial Intelligence</button>
            <button onClick={() => { setSelectedSubject('Chemistry'); setActiveTab('explore'); }} className="w-full text-left text-xs text-slate-950 dark:text-slate-100 hover:text-[#9D8DF1] font-bold py-1.5 px-3 transition block truncate cursor-pointer"># EAS Chemistry</button>
            <button onClick={() => { setSelectedSubject('Law'); setActiveTab('explore'); }} className="w-full text-left text-xs text-slate-950 dark:text-slate-100 hover:text-[#9D8DF1] font-bold py-1.5 px-3 transition block truncate cursor-pointer"># Constitutional Framework</button>
          </div>
        </div>

        <div className="bg-[#F9F8FF] dark:bg-[#1E1C30] p-3.5 rounded-2xl border border-[#E6E1FF] dark:border-[#2D2A45] mt-4" id="user-profile-widget">
          <div className="flex items-center gap-2.5 mb-2.5">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-9 h-9 rounded-full bg-[#E6E1FF] border-2 border-white shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 capitalize truncate">{user.role} • SRMU</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${user.isPremium ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-200/60 text-slate-500'}`}>
              {user.isPremium ? 'Notify PRO' : 'Free tier'}
            </span>
            <button
              onClick={() => setUser(null)}
              className="text-slate-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3 h-3" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto h-full gap-5 z-10 relative" id="main-content-scroll">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0" id="top-header-bar">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, keywords, formulas or creators..."
              className="w-full pl-9.5 pr-4 py-2.5 bg-white/75 dark:bg-[#1E1C30]/75 backdrop-blur-md border border-[#E6E1FF]/50 dark:border-[#2D2A45]/50 rounded-xl text-xs text-slate-950 dark:text-white focus:ring-2 focus:ring-[#9D8DF1] focus:outline-none shadow-xs transition-all placeholder-slate-700 dark:placeholder-slate-400 font-bold"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-white/75 dark:bg-[#1E1C30]/75 backdrop-blur-md border border-[#E6E1FF]/50 dark:border-[#2D2A45]/50 rounded-xl text-slate-950 dark:text-white hover:bg-white/90 dark:hover:bg-[#24223D]/90 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#9D8DF1]" />
              )}
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/75 dark:bg-[#1E1C30]/75 backdrop-blur-md border border-[#E6E1FF]/50 dark:border-[#2D2A45]/50 text-xs font-black rounded-xl hover:shadow-xs hover:border-[#9D8DF1] dark:hover:border-[#9D8DF1] transition-all cursor-pointer text-slate-950 dark:text-white"
            >
              <Upload className="w-3.5 h-3.5 text-[#9D8DF1]" />
              <span>Publish Note</span>
            </button>

            {!user.isPremium && (
              <button
                onClick={() => setActiveTab('premium')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9D8DF1] to-[#7A6AD8] text-white text-xs font-bold rounded-xl shadow-xs hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                <span>Get Notify Plus</span>
              </button>
            )}
          </div>
        </header>

        {selectedNote ? (
          <div className="flex-1 flex flex-col gap-4 animate-fadeIn" id="note-viewer-workspace">
            <div className="flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md p-3 border border-[#E6E1FF]/50 dark:border-[#222033]/50 rounded-xl shadow-xs" id="viewer-header-row">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-[#F9F8FF] hover:text-[#2D2A3E] transition cursor-pointer"
                  title="Back to List"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9D8DF1] bg-[#F3F0FF] px-2 py-0.5 rounded-md">
                      {selectedNote.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px] md:max-w-none">
                      {selectedNote.institution}
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-sm md:max-w-xl">{selectedNote.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPdfOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black rounded-lg hover:opacity-90 shadow-xs transition cursor-pointer"
                  title="Open high-fidelity PDF"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Open PDF</span>
                </button>

                <button
                  onClick={() => toggleBookmark(selectedNote.id)}
                  className={`p-2 rounded-lg border transition cursor-pointer ${bookmarkedIds.includes(selectedNote.id) ? 'bg-[#F3F0FF] border-[#9D8DF1] text-[#9D8DF1]' : 'bg-white border-[#E6E1FF] text-slate-400 hover:text-[#2D2A3E]'}`}
                  title="Bookmark"
                >
                  <BookMarked className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDownload(selectedNote)}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-[#E6E1FF] text-xs font-bold rounded-lg hover:border-[#9D8DF1] text-slate-700 transition cursor-pointer"
                  title="Download raw copy"
                >
                  <Download className="h-3.5 w-3.5 text-[#9D8DF1]" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {collabNotification && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce" id="live-collab-toast">
                <Users className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{collabNotification}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-hidden" id="viewer-main-columns">
              
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E1FF] shadow-xs flex flex-col overflow-hidden h-[480px] lg:h-auto" id="document-reader-card">
                
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-violet-500" />
                      <span>{selectedNote.fileName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">( {selectedNote.fileSize} )</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))} className="p-1 hover:bg-slate-200 rounded text-slate-600"><ZoomOut className="h-3.5 w-3.5" /></button>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{zoomLevel}%</span>
                    <button onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))} className="p-1 hover:bg-slate-200 rounded text-slate-600"><ZoomIn className="h-3.5 w-3.5" /></button>
                    
                    <div className="h-3 w-px bg-slate-200 mx-1"></div>
                    
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-0.5 disabled:opacity-30"><ChevronLeft className="h-3.5 w-3.5" /></button>
                    <span className="text-[10px] text-slate-500 font-bold">Page {currentPage} of 3</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))} disabled={currentPage === 3} className="p-0.5 disabled:opacity-30"><ChevronRight className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-100 relative" style={{ fontSize: `${zoomLevel / 100}rem` }} id="pdf-view-viewport">
                  
                  {selectedNote.isPremium && !purchasedNoteIds.includes(selectedNote.id) && selectedNote.creatorId !== user.id && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 text-white" id="premium-lock-overlay">
                      <div className="p-4 bg-amber-500/20 text-amber-400 rounded-full mb-3 border border-amber-500/30">
                        <Lock className="h-10 w-10 animate-pulse" />
                      </div>
                      <h4 className="text-lg font-extrabold tracking-tight">Premium Study Resource</h4>
                      <p className="text-xs text-slate-300 max-w-sm mt-1 mb-4">
                        This note is curated by <strong>{selectedNote.creatorName}</strong> and requires a premium payment to unlock.
                      </p>

                      <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 text-center max-w-xs mb-5">
                        <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Creator split breakdown</div>
                        <div className="flex items-center justify-around gap-4 mb-3">
                          <div>
                            <span className="block text-lg font-bold text-emerald-400">₹{Math.round(selectedNote.price || 0)}</span>
                            <span className="text-[9px] text-slate-300 uppercase font-bold">Total price</span>
                          </div>
                          <div className="text-xs text-slate-400">+</div>
                          <div>
                            <span className="block text-lg font-bold text-[#9D8DF1]">₹{Math.round((selectedNote.price || 0) * 0.8)}</span>
                            <span className="text-[9px] text-slate-300 uppercase font-bold">Creator (80%)</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-lg inline-block">
                          <img
                            src={selectedNote.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_${selectedNote.id}`}
                            alt="Payment QR"
                            className="w-28 h-28 object-contain"
                          />
                          <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Scan to authorize split purchase</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSimulatePayment(selectedNote.id)}
                        disabled={paymentStep !== 'idle'}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer disabled:opacity-50"
                      >
                        <Coins className="h-4 w-4" />
                        <span>
                          {paymentStep === 'scanning' ? 'Verifying payment clearance...' : 
                           paymentStep === 'completed' ? 'Purchase authorized!' : 'Simulate Purchase / Clear Payment'}
                        </span>
                      </button>
                    </div>
                  )}

                  {selectedNote.annotations.filter(ann => ann.page === currentPage).map((ann) => (
                    <div
                      key={ann.id}
                      className="absolute group z-20 cursor-pointer"
                      style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                    >
                      <div className="w-5 h-5 bg-[#9D8DF1] text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-white shadow-md">
                        A
                      </div>
                      <div className="hidden group-hover:block absolute left-6 top-0 w-48 bg-white border border-[#E6E1FF] text-[10px] p-2.5 rounded-xl shadow-lg text-[#2D2A3E]">
                        <div className="font-bold text-[#9D8DF1] mb-1">@{ann.author}</div>
                        <p className="leading-normal">{ann.text}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteAnnotation(ann.id); }}
                          className="text-red-500 hover:underline text-[8px] mt-1.5 block font-bold cursor-pointer"
                        >
                          Remove Pin
                        </button>
                      </div>
                    </div>
                  ))}

                  <div
                    className="bg-white p-8 md:p-12 rounded-xl border border-slate-200/80 shadow-md min-h-[500px] relative font-serif text-slate-800 leading-relaxed text-sm select-all"
                    onClick={(e) => {
                      if (selectedNote.isPremium && !purchasedNoteIds.includes(selectedNote.id) && selectedNote.creatorId !== user.id) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                      setShowAnnotationInput({ x, y });
                    }}
                  >
                    {showAnnotationInput && (
                      <div
                        className="absolute bg-white border border-[#E6E1FF] p-3 rounded-xl shadow-xl z-40 w-52 text-xs"
                        style={{ left: `${showAnnotationInput.x}%`, top: `${showAnnotationInput.y}%` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="font-bold text-[#9D8DF1] mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Pin Annotation Here</span>
                        </div>
                        <textarea
                          placeholder="Type scholar annotation..."
                          rows={2}
                          value={newAnnotationText}
                          onChange={(e) => setNewAnnotationText(e.target.value)}
                          className="w-full text-[10px] p-1.5 border border-slate-200 rounded-md outline-none focus:border-violet-400 mb-1.5"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setShowAnnotationInput(null)} className="text-[9px] px-2 py-1 text-slate-400 hover:bg-slate-50 rounded font-medium cursor-pointer">Cancel</button>
                          <button onClick={handleAddAnnotation} className="text-[9px] px-2 py-1 bg-[#9D8DF1] text-white rounded font-bold cursor-pointer">Place Pin</button>
                        </div>
                      </div>
                    )}

                    <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 font-sans">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center text-white font-sans text-[10px] font-extrabold">
                            N
                          </div>
                          <span className="font-sans font-black tracking-wider uppercase text-[9px] text-slate-800">Notify Academic Network</span>
                        </div>
                        <h2 className="text-xl font-bold font-serif text-slate-900 leading-tight">
                          {selectedNote.title}
                        </h2>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">
                          Subject: {selectedNote.subject} • Scholarly Draft Publication
                        </p>
                      </div>

                      <div className="text-left md:text-right shrink-0">
                        <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-800 font-bold text-[8px] rounded uppercase tracking-wider mb-1 border border-slate-200">
                          Official Study Copy
                        </span>
                        <p className="text-[9px] text-slate-500 font-medium">Institution: <strong className="text-slate-800">SRMU</strong></p>
                        <p className="text-[9px] text-slate-500 font-medium">Curator: <strong className="text-slate-800">{selectedNote.creatorName}</strong></p>
                      </div>
                    </div>

                    <div className="absolute top-36 right-8 border-4 border-dashed border-red-600/30 text-red-600/30 uppercase font-sans font-black text-[9px] tracking-widest px-2 py-1 rounded-md rotate-12 select-none pointer-events-none flex flex-col items-center">
                      <span>Notify Certified</span>
                      <span className="text-[6px]">ID: {selectedNote.id.toUpperCase()}</span>
                    </div>

                    <div className="text-xs md:text-sm text-slate-800 leading-relaxed space-y-4 select-all font-serif">
                      {selectedNote.content.split('\n\n').filter(p => p.trim().length > 0).map((para, index) => (
                        <p key={index} className="indent-4 text-justify">
                          {para}
                        </p>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 mt-12 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-sans tracking-wide select-none">
                      <div>
                        <span>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="text-center italic">
                        <span>Notify Academic Repository • Page {currentPage} of 3</span>
                      </div>
                      <div className="text-right font-bold uppercase text-slate-500">
                        <span>Classified Academic Resource</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E1FF] shadow-xs flex flex-col overflow-hidden h-[500px] lg:h-auto" id="intelligence-center">
                <div className="flex border-b border-slate-100 shrink-0" id="intelligence-tabs">
                  <button
                    onClick={() => setActiveViewerTab('summary')}
                    className={`flex-1 py-3 text-xs font-bold text-center transition ${activeViewerTab === 'summary' ? 'border-b-2 border-[#9D8DF1] text-[#9D8DF1]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Study Carousel 🎠
                  </button>
                  <button
                    onClick={() => setActiveViewerTab('plagiarism')}
                    className={`flex-1 py-3 text-xs font-bold text-center transition ${activeViewerTab === 'plagiarism' ? 'border-b-2 border-[#9D8DF1] text-[#9D8DF1]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Plagiarism
                  </button>
                  <button
                    onClick={() => setActiveViewerTab('versions')}
                    className={`flex-1 py-3 text-xs font-bold text-center transition ${activeViewerTab === 'versions' ? 'border-b-2 border-[#9D8DF1] text-[#9D8DF1]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Versions
                  </button>
                  <button
                    onClick={() => setActiveViewerTab('reviews')}
                    className={`flex-1 py-3 text-xs font-bold text-center transition ${activeViewerTab === 'reviews' ? 'border-b-2 border-[#9D8DF1] text-[#9D8DF1]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Reviews
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5" id="intelligence-panel-content">
                  
                  {activeViewerTab === 'summary' && (
                    <div className="space-y-4 animate-fadeIn">
                      <StudyCarousel darkMode={darkMode} />
                    </div>
                  )}

                  {activeViewerTab === 'plagiarism' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Plagiarism Shield & Similarity Scanner</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Verified</span>
                      </div>

                      {plagiarismReport ? (
                        <div className="space-y-4 font-sans">
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-slate-800">{plagiarismReport.status}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Checked {plagiarismReport.checkedWords} terms within local student directories.</div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-2xl font-black ${plagiarismReport.isPlagiarized ? 'text-red-500' : 'text-emerald-500'}`}>
                                {plagiarismReport.matchPercentage}%
                              </span>
                              <span className="block text-[8px] uppercase font-bold text-slate-400">Overlap index</span>
                            </div>
                          </div>

                          {plagiarismReport.matchedSource && (
                            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
                              <div className="font-bold flex items-center gap-1">
                                <ShieldCheck className="h-4 w-4 text-amber-600" />
                                <span>High similarity source:</span>
                              </div>
                              <p className="font-bold italic text-slate-800 text-[11px]">{plagiarismReport.matchedSource}</p>
                              <div className="bg-white/80 p-2 rounded-lg border border-amber-100 mt-2 text-[10px] text-slate-600">
                                &quot;{plagiarismReport.matchedSnippet}&quot;
                              </div>
                            </div>
                          )}

                          <button
                            onClick={handleTriggerPlagiarism}
                            className="text-xs text-[#9D8DF1] hover:underline block font-bold cursor-pointer"
                          >
                            Re-run Similarity Scan
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-[#F9F8FF] rounded-2xl border border-dashed border-[#E6E1FF] space-y-3">
                          <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
                          <div>
                            <p className="text-xs font-bold">Verify Note Integrity</p>
                            <p className="text-[10px] text-slate-500 max-w-[240px] mx-auto mt-0.5">Identify potential copyright matches or plagiarism across online indices and internal university libraries.</p>
                          </div>
                          <button
                            onClick={handleTriggerPlagiarism}
                            disabled={loadingPlagiarism}
                            className="px-4 py-2 bg-[#9D8DF1] text-white text-xs font-bold rounded-xl hover:bg-[#7A6AD8] transition disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                          >
                            {loadingPlagiarism ? 'Scanning documents...' : 'Run Integrity Scan'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeViewerTab === 'versions' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Document Revisions & Merges</h4>
                      
                      <div className="relative border-l-2 border-violet-100 pl-4 ml-2 space-y-5 font-sans">
                        {selectedNote.versions.map((ver) => (
                          <div key={ver.id} className="relative">
                            <span className="absolute -left-6.5 top-0.5 bg-violet-600 rounded-full w-2.5 h-2.5 ring-4 ring-white" />
                            <div className="text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">Version {ver.version}</span>
                                <span className="text-[9px] text-slate-400">{new Date(ver.updatedAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[10px] text-[#9D8DF1] font-bold">Updated by @{ver.updatedBy}</p>
                              <p className="text-slate-500 mt-1 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                                {ver.changeSummary || 'Minor adjustments'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeViewerTab === 'reviews' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Scholarly Ratings & Discussion</h4>
                      
                      <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                        {selectedNote.comments.length === 0 ? (
                          <p className="text-xs text-slate-400 italic text-center py-4">No scholarly reviews yet. Be the first to leave feedback!</p>
                        ) : (
                          selectedNote.comments.map((comment) => (
                            <div key={comment.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-sans">
                              <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-2">
                                  <img src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userName}`} alt={comment.userName} className="w-5 h-5 rounded-full bg-slate-200" />
                                  <span className="font-bold text-slate-800">{comment.userName}</span>
                                </div>
                                <div className="flex items-center text-amber-400 gap-0.5 text-[10px] font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{comment.rating}</span>
                                </div>
                              </div>
                              <p className="text-slate-600 text-[11px] leading-normal">{comment.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handlePostReview} className="pt-3 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Your Rating</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setRatingInput(star)}
                                className="focus:outline-none cursor-pointer"
                              >
                                <Star className={`w-4 h-4 ${star <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          placeholder="Provide supportive feedback, report missing formulas, or review note clarity..."
                          rows={2}
                          required
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none focus:border-[#9D8DF1] focus:ring-1 focus:ring-[#9D8DF1] transition"
                        />

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full py-2 bg-[#9D8DF1] text-white font-bold text-xs rounded-xl hover:bg-[#7A6AD8] transition cursor-pointer disabled:opacity-50"
                        >
                          {submittingReview ? 'Posting review...' : 'Submit Scholarly Review'}
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-5" id="dashboard-standard-panel">
            
            {activeTab === 'explore' && (
              <>
                <div className="shrink-0" id="study-carousel-container">
                  <StudyCarousel darkMode={darkMode} />
                </div>

                <div className="shrink-0 flex flex-col gap-3 bg-white/70 dark:bg-[#13121F]/70 backdrop-blur-md p-4 rounded-3xl border border-[#E6E1FF]/40 dark:border-[#222033]/40 shadow-xs animate-fadeIn" id="explore-filter-bar">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#9D8DF1]" />
                      <span>Categorized subjects</span>
                    </h3>
                    {selectedSubject !== 'All' && (
                      <button
                        onClick={() => setSelectedSubject('All')}
                        className="text-xs text-[#9D8DF1] font-bold hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {subjectsList.map((subj) => (
                      <button
                        key={subj}
                        onClick={() => setSelectedSubject(subj)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedSubject === subj ? 'bg-[#9D8DF1] text-white shadow-xs' : 'bg-white/75 dark:bg-[#1E1C30]/75 backdrop-blur-md border border-[#E6E1FF]/50 dark:border-[#2D2A45]/50 text-slate-900 dark:text-slate-100 font-extrabold hover:text-black dark:hover:text-white hover:bg-white/90 dark:hover:bg-[#1E1C30]/90'}`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 min-h-[300px]" id="trending-notes-section">
                  <div className="bg-white/70 dark:bg-[#13121F]/70 backdrop-blur-md px-5 py-4 rounded-3xl border border-[#E6E1FF]/40 dark:border-[#222033]/40 shadow-xs flex justify-between items-center animate-fadeIn">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#9D8DF1]" />
                      <span>{selectedSubject === 'All' ? 'Trending Notes Platform' : `${selectedSubject} Notes Hub`}</span>
                    </h3>
                    <span className="text-xs text-slate-900 dark:text-slate-100 font-extrabold bg-[#F3F0FF]/80 dark:bg-[#24223D]/80 px-3 py-1 rounded-full">{filteredNotes.length} matching resources found</span>
                  </div>

                  {filteredNotes.length === 0 ? (
                    <div className="flex-1 bg-white/75 dark:bg-[#13121F]/75 backdrop-blur-md border border-dashed border-[#E6E1FF]/50 dark:border-[#222033]/50 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
                      <FileText className="h-12 w-12 text-[#9D8DF1] mb-2 opacity-50" />
                      <p className="font-bold text-sm">No notes available</p>
                      <p className="text-xs max-w-sm mt-1">Be the pathbreaker by publishing the first review notes for {selectedSubject !== 'All' ? selectedSubject : 'scholars'}!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                      {filteredNotes.map((note) => {
                        const isStarred = bookmarkedIds.includes(note.id);
                        return (
                          <div
                            key={note.id}
                            onClick={() => handleSelectNote(note)}
                            className="bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md p-5 rounded-3xl border border-[#E6E1FF]/50 dark:border-[#222033]/50 hover:border-[#9D8DF1] dark:hover:border-[#9D8DF1] transition-all cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-lg hover:scale-[1.01] flex flex-col justify-between group h-64 animate-fadeIn"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div className={`w-9 h-11 rounded-lg flex items-center justify-center font-bold ${note.isPremium ? 'bg-amber-50/80 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' : 'bg-[#F3F0FF]/80 text-[#9D8DF1] dark:bg-[#24223D]/80 dark:text-[#BDB2FF]'}`}>
                                  {note.fileType === 'pdf' ? (
                                    <FileText className="w-5 h-5 shrink-0" />
                                  ) : (
                                    <span className="text-xs">TXT</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {note.isPremium ? (
                                    <span className="text-[9px] bg-amber-50/95 text-amber-700 border border-amber-200/50 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
                                  ) : (
                                    <span className="text-[9px] bg-emerald-50/95 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Free Access</span>
                                  )}
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(note.id);
                                    }}
                                    className={`p-1.5 rounded-lg border transition cursor-pointer ${isStarred ? 'bg-[#F3F0FF] dark:bg-[#24223D] border-[#9D8DF1] text-[#9D8DF1]' : 'border-slate-100 dark:border-slate-800 text-slate-300 hover:text-[#9D8DF1]'}`}
                                  >
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                </div>
                              </div>

                              <h4 className="font-black text-sm mb-1 line-clamp-2 text-slate-950 dark:text-white group-hover:text-[#9D8DF1] transition-colors">{note.title}</h4>
                              <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mb-2 truncate">{note.institution}</p>
                              <p className="text-[11px] text-slate-900 dark:text-slate-100 font-semibold line-clamp-2 mb-4 leading-relaxed">{note.description}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/70 pt-3 mt-auto text-xs font-bold text-slate-950 dark:text-slate-200">
                              <div className="flex items-center gap-1.5 shrink-0">
                                <img
                                  src={note.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${note.creatorName}`}
                                  alt={note.creatorName}
                                  className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700"
                                />
                                <span className="text-[10px] truncate max-w-[80px]">{note.creatorName}</span>
                              </div>

                              <div className="flex items-center gap-3 font-bold">
                                <div className="flex items-center text-amber-500 gap-0.5 text-[10px]">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  <span>{note.rating}</span>
                                </div>
                                {note.isPremium ? (
                                  <span className="text-[#9D8DF1] font-extrabold">₹{Math.round(note.price || 0)}</span>
                                ) : (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase">Free</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'my-notes' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md p-6 rounded-3xl border border-[#E6E1FF]/50 dark:border-[#222033]/50 shadow-xs flex justify-between items-center relative overflow-hidden shrink-0">
                  <div className="z-10">
                    <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">My Scholar&apos;s Desk</h2>
                    <p className="text-slate-900 dark:text-slate-200 text-xs font-semibold mt-1">Review items you uploaded, co-authored, annotated, or saved in Notify.</p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-[#9D8DF1] hover:bg-[#7A6AD8] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Upload New Study Pack
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotes.length === 0 ? (
                    <div className="col-span-full py-16 bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md border border-dashed border-[#E6E1FF]/50 dark:border-[#222033]/50 rounded-3xl text-center text-slate-800 dark:text-slate-200">
                      <FileText className="h-12 w-12 mx-auto text-[#9D8DF1] mb-2 opacity-50 animate-pulse" />
                      <p className="font-bold text-sm">Desk is currently empty</p>
                      <p className="text-xs max-w-sm mx-auto mt-1">Upload note packages or collaborate with peer researchers to see documents listed here.</p>
                    </div>
                  ) : (
                    filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleSelectNote(note)}
                        className="bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md p-5 rounded-3xl border border-[#E6E1FF]/50 dark:border-[#222033]/50 hover:border-[#9D8DF1] dark:hover:border-[#9D8DF1] transition-all cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-lg hover:scale-[1.01] flex flex-col justify-between h-56 animate-fadeIn"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-[#9D8DF1] bg-[#F3F0FF] dark:bg-[#24223D] px-2 py-0.5 rounded-full uppercase">{note.subject}</span>
                            <span className="text-[10px] text-slate-800 dark:text-slate-200 font-bold">{note.fileSize}</span>
                          </div>
                          <h4 className="font-black text-sm text-slate-950 dark:text-white line-clamp-2 mb-1 group-hover:text-[#9D8DF1] transition-colors">{note.title}</h4>
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mb-2">{note.institution}</p>
                          <p className="text-[11px] text-slate-900 dark:text-slate-100 font-semibold line-clamp-2 leading-relaxed">{note.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3 mt-auto text-[10px] font-bold text-slate-800 dark:text-slate-200">
                          <span className="uppercase">{note.versions.length} versions archived</span>
                          <span className="text-[#9D8DF1] hover:underline">Open in reader</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md p-6 rounded-3xl border border-[#E6E1FF]/50 dark:border-[#222033]/50 shadow-xs shrink-0">
                  <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">Saved Study Guides</h2>
                  <p className="text-slate-900 dark:text-slate-200 text-xs font-semibold mt-1">Bookmarks of academic papers, summaries, and exam-prep files you pinned.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotes.length === 0 ? (
                    <div className="col-span-full py-16 bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md border border-dashed border-[#E6E1FF]/50 dark:border-[#222033]/50 rounded-3xl text-center text-slate-800 dark:text-slate-200">
                      <BookMarked className="h-12 w-12 mx-auto text-[#9D8DF1] mb-2 opacity-50" />
                      <p className="font-bold text-sm">No Pinned Bookmarks</p>
                      <p className="text-xs max-w-sm mx-auto mt-1">Browse the Explore Hub and bookmark note cards to retrieve them instantly here.</p>
                    </div>
                  ) : (
                    filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleSelectNote(note)}
                        className="bg-white/80 dark:bg-[#13121F]/80 backdrop-blur-md p-5 rounded-3xl border border-[#E6E1FF]/50 dark:border-[#222033]/50 hover:border-[#9D8DF1] dark:hover:border-[#9D8DF1] transition-all cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-lg hover:scale-[1.01] flex flex-col justify-between h-56 animate-fadeIn"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-[#9D8DF1] bg-[#F3F0FF] dark:bg-[#24223D] px-2 py-0.5 rounded-full uppercase">{note.subject}</span>
                            <span className="text-amber-500 font-bold text-[10px] flex items-center gap-0.5">★ {note.rating}</span>
                          </div>
                          <h4 className="font-black text-sm text-slate-950 dark:text-white line-clamp-2 mb-1 group-hover:text-[#9D8DF1] transition-colors">{note.title}</h4>
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mb-2 truncate">{note.institution}</p>
                          <p className="text-[11px] text-slate-900 dark:text-slate-100 font-semibold line-clamp-2">{note.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3 mt-auto text-[10px] font-bold text-[#9D8DF1]">
                          <span className="text-slate-800 dark:text-slate-200 uppercase">By @{note.creatorName}</span>
                          <span>Study Reader</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-5 animate-fadeIn" id="analytics-panel-workspace">
                <div className="bg-white p-6 rounded-3xl border border-[#E6E1FF] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#2D2A3E]">Creator Earnings & Engagement Metrics</h2>
                    <p className="text-slate-500 text-xs mt-1">Live review analytics, platform usage distributions, and sales metrics.</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    <span>Split Level: 80% Creator / 20% Notify</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#E6E1FF] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notes Views</div>
                    <div className="text-2xl font-black text-slate-800 mt-1">{totalViews || 419}</div>
                    <span className="text-[9px] text-emerald-500 font-bold">↑ 12% vs last month</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E6E1FF] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Downloads</div>
                    <div className="text-2xl font-black text-slate-800 mt-1">{totalDownloads || 164}</div>
                    <span className="text-[9px] text-emerald-500 font-bold">↑ 8% vs last month</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E6E1FF] shadow-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Note Rating</div>
                    <div className="text-2xl font-black text-slate-800 mt-1">{averageRating || 4.8}★</div>
                    <span className="text-[9px] text-emerald-500 font-bold">Top 5% across platform</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E6E1FF] shadow-xs bg-[#F3F0FF]/30">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#9D8DF1]">Scholar Revenue Share (80%)</div>
                    <div className="text-2xl font-black text-[#9D8DF1] mt-1">₹{creatorEarnings || '13,560'}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Platform service fee (20%): ₹{platformFee || '3,390'}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#E6E1FF] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Monthly Revenue Split & Downloads History</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Earnings before and after platform fee distributions (INR)</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#9D8DF1] rounded"></span> 80% Net Creator Profit</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#E6E1FF] rounded"></span> 20% Notify Fee</span>
                    </div>
                  </div>

                  <div className="relative h-64 w-full">
                    <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                      <line x1="40" y1="20" x2="580" y2="20" stroke="#F1F0F5" strokeWidth="1" />
                      <line x1="40" y1="70" x2="580" y2="70" stroke="#F1F0F5" strokeWidth="1" />
                      <line x1="40" y1="120" x2="580" y2="120" stroke="#F1F0F5" strokeWidth="1" />
                      <line x1="40" y1="170" x2="580" y2="170" stroke="#F1F0F5" strokeWidth="1" />
                      <line x1="40" y1="210" x2="580" y2="210" stroke="#E6E1FF" strokeWidth="2" />

                      <rect x="75" y="90" width="22" height="120" fill="#E6E1FF" rx="4" />
                      <rect x="75" y="115" width="22" height="95" fill="#9D8DF1" rx="4" />
                      
                      <rect x="165" y="70" width="22" height="140" fill="#E6E1FF" rx="4" />
                      <rect x="165" y="100" width="22" height="110" fill="#9D8DF1" rx="4" />

                      <rect x="255" y="45" width="22" height="165" fill="#E6E1FF" rx="4" />
                      <rect x="255" y="80" width="22" height="130" fill="#9D8DF1" rx="4" />

                      <rect x="345" y="60" width="22" height="150" fill="#E6E1FF" rx="4" />
                      <rect x="345" y="90" width="22" height="120" fill="#9D8DF1" rx="4" />

                      <rect x="435" y="30" width="22" height="180" fill="#E6E1FF" rx="4" />
                      <rect x="435" y="65" width="22" height="145" fill="#9D8DF1" rx="4" />

                      <rect x="525" y="15" width="22" height="195" fill="#E6E1FF" rx="4" />
                      <rect x="525" y="55" width="22" height="155" fill="#9D8DF1" rx="4" />
                    </svg>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 px-10">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun (Current)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'premium' && (
              <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fadeIn" id="premium-pricing-panel">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Notify Plus Tier Membership</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#2D2A3E]">Access Unlimited Scholars Resources</h2>
                  <p className="text-slate-500 text-xs max-w-md mx-auto">Upgrade to the unified Notify subscription plan. Support peer content creators while gaining access to top-tier verified study packages.</p>
                </div>

                <div className="bg-white rounded-3xl border border-[#E6E1FF] p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
                  
                  <div className="space-y-5 font-sans">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Subscriber Perks</h3>
                    
                    <ul className="space-y-3.5 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Unlimited academic downloads</strong>
                          <span className="block text-[10px] text-slate-400">Download any high-fidelity review paper or formula package.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Full Advanced AI features</strong>
                          <span className="block text-[10px] text-slate-400">Summarize, translate, and co-author directly with LLM assets.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Verified plagiarism reviews</strong>
                          <span className="block text-[10px] text-slate-400">Test compliance of uploaded drafts against our private indexing archive.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Ad-Free Minimal UI</strong>
                          <span className="block text-[10px] text-slate-400">Pure focus on studying, reading documents, and annotations.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#F9F8FF] p-6 rounded-2xl border border-[#E6E1FF] flex flex-col justify-between text-center relative">
                    {user.isPremium && (
                      <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md">
                        Currently Active
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#9D8DF1]">Monthly Membership</span>
                      <div className="mt-2">
                        <span className="text-4xl font-black text-slate-800">₹799</span>
                        <span className="text-slate-400 text-xs font-medium">/month</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">No contract. Cancel anytime with a single click inside account controls.</p>
                    </div>

                    <div className="pt-4 border-t border-[#E6E1FF]/60 mt-4">
                      {user.isPremium ? (
                        <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Notify Plus Account Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleJoinPremiumTier}
                          className="w-full py-2.5 bg-[#9D8DF1] hover:bg-[#7A6AD8] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                        >
                          Upgrade Plan Instantly
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 py-4 border-t border-[#E6E1FF] shrink-0 mt-auto text-[10px] font-bold text-slate-400 uppercase tracking-wide" id="global-footer-rail">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Notify Cluster Cloud Online</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5 text-slate-400" />
              <span>{fileSyncCount} Documents Syncing...</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Settings className="w-3 h-3 text-slate-400" />
              <span>Latency: {latency}ms</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#help" className="hover:text-[#9D8DF1] transition-colors flex items-center gap-0.5"><HelpCircle className="h-3 w-3" /> Help Center</a>
            <span>Notify © 2026</span>
          </div>
        </footer>

      </main>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={(newNote) => {
            setNotes(prev => [newNote, ...prev]);
            setSelectedNote(newNote);
          }}
          creatorId={user.id}
          creatorName={user.name}
        />
      )}

      {selectedNote && (
        <PDFViewerModal
          note={selectedNote}
          isOpen={isPdfOpen}
          onClose={() => setIsPdfOpen(false)}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}

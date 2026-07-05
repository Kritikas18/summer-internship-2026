import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Clock, Brain, Award, Flame, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Slide {
  id: number;
  title: string;
  description: string;
  highlight: string;
  accent: string;
  icon: React.ReactNode;
  bgGradient: string;
}

interface StudyCarouselProps {
  darkMode?: boolean;
}

export default function StudyCarousel({ darkMode = false }: StudyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Active Recall Study Method",
      description: "Simply reading notes doesn't trigger retention. After reading, ask yourself key questions and try to explain them out loud without looking. This increases recall rates by 150%.",
      highlight: "Tip: Test yourself on these notes at least twice daily for peak retention.",
      accent: "text-violet-500 bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300",
      icon: <Brain className="h-6 w-6" />,
      bgGradient: "from-violet-50 to-indigo-50 dark:from-violet-950/25 dark:to-indigo-950/25"
    },
    {
      id: 2,
      title: "Spaced Repetition System",
      description: "Review your study materials on day 1, day 3, and day 7. This interval tricks the brain into shifting notes from temporary memory to permanent long-term storage.",
      highlight: "Tip: Use 'Bookmarks' or add items to 'My Scholars Desk' to schedule cycles.",
      accent: "text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300",
      icon: <Clock className="h-6 w-6" />,
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/25 dark:to-teal-950/25"
    },
    {
      id: 3,
      title: "Smart Concise Outlines",
      description: "Ditch heavy paragraphs! Use clean bullets, block-quotes, and highlight key formulas. Use our collaborative editor to co-author top-tier docs with peers.",
      highlight: "Tip: Double-click notes to add real-time pinned comments (Annotations) instantly.",
      accent: "text-amber-500 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300",
      icon: <Lightbulb className="h-6 w-6" />,
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/25 dark:to-orange-950/25"
    },
    {
      id: 4,
      title: "Collaborative Study Groups",
      description: "Explaining a concept to a fellow student solidifies your own grasp by up to 90%. Sharing knowledge is the most efficient form of studying!",
      highlight: "Tip: Use your customized note codes to share instantly with classmates.",
      accent: "text-rose-500 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300",
      icon: <Flame className="h-6 w-6" />,
      bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/25 dark:to-pink-950/25"
    },
    {
      id: 5,
      title: "Pomodoro Micro-Learning Cycles",
      description: "Study with absolute intensity for 25 minutes, then rest for 5 minutes. Studying for hours straight causes fatigue, reducing overall productivity.",
      highlight: "Tip: Stand up and drink water during breaks—avoid browsing social media.",
      accent: "text-sky-500 bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300",
      icon: <Award className="h-6 w-6" />,
      bgGradient: "from-sky-50 to-blue-50 dark:from-sky-950/25 dark:to-blue-950/25"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentIndex];

  return (
    <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.02)] ${
      darkMode 
        ? 'bg-[#1E1C33]/85 border-[#2D2A45]/65 text-slate-100' 
        : 'bg-white/85 border-[#E6E1FF]/65 text-[#2D2A3E]'
    }`} id="study-tips-carousel">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#9D8DF1] animate-bounce" />
          <span className="text-xs font-black uppercase tracking-widest text-[#9D8DF1]">
            Study Companion Carousel 🎠
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-[#E6E1FF] text-[#7A6AD8] dark:bg-[#2D2A45] dark:text-violet-300' 
                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {isPlaying ? "● AutoPlay On" : "|| Paused"}
          </button>
        </div>
      </div>

      <div className="relative min-h-[260px] overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 25, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -25, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`absolute inset-0 rounded-2xl p-6 border flex flex-col justify-between bg-gradient-to-br ${activeSlide.bgGradient} ${
              darkMode ? 'border-[#2D2A45]/45' : 'border-violet-100/70'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className={`p-2.5 rounded-xl ${activeSlide.accent} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {activeSlide.icon}
                </motion.div>
                <h3 className="font-sans font-black text-base tracking-tight text-slate-950 dark:text-white">
                  {activeSlide.title}
                </h3>
              </div>
              
              <p className="text-sm text-slate-900 dark:text-slate-200 font-semibold leading-relaxed font-sans">
                {activeSlide.description}
              </p>
            </div>

            <div className={`mt-5 pt-4 border-t text-xs font-bold flex items-center gap-2 ${
              darkMode ? 'border-[#2D2A45]/50 text-violet-200' : 'border-violet-100 text-violet-950'
            }`}>
              <span className="shrink-0 text-base">💡</span>
              <span className="italic">{activeSlide.highlight}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-5 pt-1">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(false);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex 
                  ? 'w-6 bg-[#9D8DF1]' 
                  : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              darkMode 
                ? 'bg-[#181726]/80 border-[#2D2A45] hover:bg-[#24223D] text-slate-300' 
                : 'bg-white border-[#E6E1FF] hover:bg-slate-50 text-slate-950'
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              darkMode 
                ? 'bg-[#181726]/80 border-[#2D2A45] hover:bg-[#24223D] text-slate-300' 
                : 'bg-white border-[#E6E1FF] hover:bg-slate-50 text-slate-950'
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

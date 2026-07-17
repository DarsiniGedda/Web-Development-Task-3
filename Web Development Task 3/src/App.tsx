import { useState } from 'react';
import { 
  Terminal, Smartphone, Award, Globe, BookOpen, 
  CheckCircle2, Milestone, ArrowUpRight, Github 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResponsiveSimulator from './components/ResponsiveSimulator';
import QuizCarouselModule from './components/QuizCarouselModule';
import ApiFetcher from './components/ApiFetcher';

type ActiveTask = 'task1' | 'task2' | 'task3';

export default function App() {
  const [activeTask, setActiveTask] = useState<ActiveTask>('task1');

  // Simulated lesson completion tracking
  const [completions, setCompletions] = useState<Record<ActiveTask, boolean>>({
    task1: true,
    task2: true,
    task3: true,
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-neutral-900 flex flex-col font-sans p-4 md:p-8 selection:bg-indigo-200" id="app-root">
      {/* Bento Header */}
      <header className="mb-8 max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-indigo-500 rounded-2xl border-2 border-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white stroke-[2.5]" />
            </span>
            ApexPlanet Hub
          </h1>
          <p className="text-neutral-500 font-bold mt-2 text-sm uppercase tracking-wide">
            Advanced Styling and JavaScript • TASK-3
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-white border-2 border-neutral-900 rounded-full font-extrabold text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-900"></span>
            ALL WORK COMPLETED
          </div>
          <div className="w-12 h-12 bg-neutral-900 border-2 border-neutral-900 rounded-full flex items-center justify-center text-white font-extrabold text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            AP
          </div>
        </div>
      </header>

      {/* Main Educational Bento Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          
          {/* Lesson Outline Card */}
          <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400">
              Task Checklist
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTask('task1')}
                className={`w-full p-3.5 rounded-2xl border-2 border-neutral-900 text-left flex items-center justify-between gap-3 transition-all ${
                  activeTask === 'task1'
                    ? 'bg-indigo-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
                id="sidebar-task1-btn"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold border-2 border-neutral-900 ${
                    activeTask === 'task1' ? 'bg-white text-neutral-900' : 'bg-neutral-100 text-neutral-900'
                  }`}>
                    1
                  </span>
                  <div className="truncate text-left">
                    <h3 className="text-xs font-black leading-tight">Responsive Layout</h3>
                    <p className={`text-[10px] font-bold ${activeTask === 'task1' ? 'text-indigo-100' : 'text-neutral-400'}`}>Media Queries & Grid</p>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${activeTask === 'task1' ? 'text-white' : 'text-emerald-500'}`} />
              </button>

              <button
                onClick={() => setActiveTask('task2')}
                className={`w-full p-3.5 rounded-2xl border-2 border-neutral-900 text-left flex items-center justify-between gap-3 transition-all ${
                  activeTask === 'task2'
                    ? 'bg-indigo-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
                id="sidebar-task2-btn"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold border-2 border-neutral-900 ${
                    activeTask === 'task2' ? 'bg-white text-neutral-900' : 'bg-neutral-100 text-neutral-900'
                  }`}>
                    2
                  </span>
                  <div className="truncate text-left">
                    <h3 className="text-xs font-black leading-tight">Interactive JS Module</h3>
                    <p className={`text-[10px] font-bold ${activeTask === 'task2' ? 'text-indigo-100' : 'text-neutral-400'}`}>Quiz & Carousel</p>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${activeTask === 'task2' ? 'text-white' : 'text-emerald-500'}`} />
              </button>

              <button
                onClick={() => setActiveTask('task3')}
                className={`w-full p-3.5 rounded-2xl border-2 border-neutral-900 text-left flex items-center justify-between gap-3 transition-all ${
                  activeTask === 'task3'
                    ? 'bg-indigo-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
                id="sidebar-task3-btn"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold border-2 border-neutral-900 ${
                    activeTask === 'task3' ? 'bg-white text-neutral-900' : 'bg-neutral-100 text-neutral-900'
                  }`}>
                    3
                  </span>
                  <div className="truncate text-left">
                    <h3 className="text-xs font-black leading-tight">API Data Fetcher</h3>
                    <p className={`text-[10px] font-bold ${activeTask === 'task3' ? 'text-indigo-100' : 'text-neutral-400'}`}>Asynchronous Networks</p>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${activeTask === 'task3' ? 'text-white' : 'text-emerald-500'}`} />
              </button>
            </div>
          </div>

          {/* Quick Technical Tip Card - Neobrutalist styling */}
          <div className="bg-amber-400 border-2 border-neutral-900 text-neutral-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-neutral-900 animate-bounce stroke-[2.5]" />
              <span className="text-xs font-extrabold uppercase tracking-wide">Apex Tech Tip</span>
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              When styling bento layout, hard borders and chunky drop-shadows produce high contrast interfaces that draw clear focus areas for viewers.
            </p>
          </div>

        </aside>

        {/* Content Workspace Area */}
        <section className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTask}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="p-1"
            >
              {activeTask === 'task1' && <ResponsiveSimulator />}
              {activeTask === 'task2' && <QuizCarouselModule />}
              {activeTask === 'task3' && <ApiFetcher />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Footer info */}
      <footer className="border-t-2 border-neutral-900 bg-white py-6 mt-12 text-center text-xs text-neutral-600 space-y-1 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2">
        <p className="font-extrabold text-neutral-900">Interactive Education Workbook Platform • Bento Grid Suite</p>
        <p className="font-mono text-[10px] text-neutral-500">Built for ApexPlanet Advanced Development Program</p>
      </footer>
    </div>
  );
}

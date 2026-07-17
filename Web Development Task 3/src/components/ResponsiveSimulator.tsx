import { useState, useRef, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, Info, Code, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ResponsiveSimulator() {
  const [viewportWidth, setViewportWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxAvailableWidth, setMaxAvailableWidth] = useState<number>(1000);

  // Auto-fit simulator bounds on mount/resize
  useEffect(() => {
    if (containerRef.current) {
      const parentWidth = containerRef.current.clientWidth;
      setMaxAvailableWidth(parentWidth - 40); // account for padding
      if (parentWidth < 840) {
        setViewportWidth(Math.max(340, parentWidth - 40));
      }
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        setMaxAvailableWidth(parentWidth - 40);
        setViewportWidth((prev) => Math.min(prev, parentWidth - 40));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setPreset = (width: number) => {
    const targetWidth = Math.min(width, maxAvailableWidth);
    setViewportWidth(targetWidth);
  };

  // Determine current "device mode" based on simulated width
  let deviceMode: 'mobile' | 'tablet' | 'desktop' = 'mobile';
  if (viewportWidth >= 768) {
    deviceMode = 'desktop';
  } else if (viewportWidth >= 550) {
    deviceMode = 'tablet';
  }

  // Active styles and Tailwind codes
  const activeTailwindClass = {
    mobile: 'flex flex-col gap-4 p-5 bg-[#F7F7F7] border-2 border-neutral-900 rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-neutral-900',
    tablet: 'grid grid-cols-2 gap-5 p-6 bg-[#F7F7F7] border-2 border-neutral-900 rounded-[2rem] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-neutral-900',
    desktop: 'grid grid-cols-3 gap-6 p-8 bg-[#F7F7F7] border-2 border-neutral-900 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-neutral-900',
  }[deviceMode];

  const activeCssCode = {
    mobile: `/* Mobile Default Styles (< 550px) */
.dashboard-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background-color: #F7F7F7;
  border: 2px solid #171717;
  border-radius: 1.5rem;
  box-shadow: 4px 4px 0px 0px #000000;
}`,
    tablet: `/* Tablet Styles (>= 550px && < 768px) */
@media (min-width: 550px) {
  .dashboard-card {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    padding: 1.5rem;
    background-color: #F7F7F7;
    border: 2px solid #171717;
    border-radius: 2rem;
    box-shadow: 5px 5px 0px 0px #000000;
  }
}`,
    desktop: `/* Desktop Styles (>= 768px) */
@media (min-width: 768px) {
  .dashboard-card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 2rem;
    background-color: #F7F7F7;
    border: 2px solid #171717;
    border-radius: 2rem;
    box-shadow: 6px 6px 0px 0px #000000;
  }
}`,
  }[deviceMode];

  const explanation = {
    mobile: "Mobile first! Under 550px, the bento container collapses into a single-column block format (`flex-col`) for vertical scanning. The border-2 and chunky hard-shadow design remains sharp and readable on thumb-touch screens.",
    tablet: "At 550px, the media query adjusts the bento layout to a dual-column format. Multiple items sit side-by-side cleanly with a solid border structure and a flat neo-brutalist shadow layout.",
    desktop: "At 768px and above, desktop styles expand into a complete 3-column bento-grid. Sub-cards fill the columns seamlessly, accented by thick boundaries and a high-contrast shadow indicating interactive density.",
  }[deviceMode];

  return (
    <div className="space-y-8" id="responsive-sim-root">
      {/* Introduction Header */}
      <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start gap-4">
        <div className="p-3 bg-indigo-500 text-white rounded-2xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Smartphone className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-neutral-900 font-sans">Task 1: Responsive Design & Media Queries</h3>
          <p className="text-neutral-600 text-sm mt-1.5 leading-relaxed font-semibold">
            Responsive design allows a single layout to restructure seamlessly across phones, tablets, and desktop displays. Use the interactive emulator below to resize the canvas and watch CSS and Tailwind properties transform in real-time.
          </p>
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-[2rem] border-2 border-neutral-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Presets:</span>
          <button
            onClick={() => setPreset(375)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold font-sans flex items-center gap-1.5 border-2 border-neutral-900 transition-all ${
              deviceMode === 'mobile'
                ? 'bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-0.5'
                : 'bg-white text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
            id="preset-mobile-btn"
          >
            <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
            Mobile (375px)
          </button>
          <button
            onClick={() => setPreset(640)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold font-sans flex items-center gap-1.5 border-2 border-neutral-900 transition-all ${
              deviceMode === 'tablet'
                ? 'bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-0.5'
                : 'bg-white text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
            id="preset-tablet-btn"
          >
            <Tablet className="w-3.5 h-3.5 stroke-[2.5]" />
            Tablet (640px)
          </button>
          <button
            onClick={() => setPreset(880)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold font-sans flex items-center gap-1.5 border-2 border-neutral-900 transition-all ${
              deviceMode === 'desktop'
                ? 'bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-0.5'
                : 'bg-white text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
            id="preset-desktop-btn"
          >
            <Monitor className="w-3.5 h-3.5 stroke-[2.5]" />
            Desktop (880px)
          </button>
        </div>

        {/* Size Slider */}
        <div className="flex items-center gap-3 flex-1 max-w-xs min-w-[200px]">
          <span className="text-xs font-black text-neutral-400">WIDTH:</span>
          <input
            type="range"
            min="320"
            max={maxAvailableWidth}
            value={viewportWidth}
            onChange={(e) => setViewportWidth(parseInt(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-neutral-200 rounded-lg border border-neutral-400"
            id="width-range-slider"
          />
          <span className="text-xs font-mono bg-white text-indigo-500 px-2.5 py-1.5 rounded-xl border-2 border-neutral-900 font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {viewportWidth}px
          </span>
        </div>
      </div>

      {/* Interactive Resizable Workspace */}
      <div 
        ref={containerRef} 
        className="w-full bg-white border-2 border-neutral-900 rounded-[2rem] p-6 flex flex-col items-center justify-center min-h-[380px] overflow-x-hidden relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="absolute top-4 left-6 flex items-center gap-1.5 text-xs text-neutral-500 font-bold uppercase tracking-wider">
          <Eye className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
          <span>Interactive Canvas Simulator</span>
        </div>

        {/* Resizable Subcontainer */}
        <div 
          style={{ width: `${viewportWidth}px` }} 
          className="transition-all duration-300 ease-out border-2 border-dashed border-neutral-400 p-6 rounded-[2.5rem] bg-[#F7F7F7] shadow-inner relative"
        >
          {/* Label indicating width */}
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-mono font-black px-3 py-1 rounded-full border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Viewport: {viewportWidth}px ({deviceMode.toUpperCase()})
          </div>

          {/* Simulated Component with Dynamic Classes */}
          <div className={activeTailwindClass}>
            {/* Bento Block 1: Profile & Title */}
            <div className="bg-white p-4 rounded-2xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-neutral-900 text-white font-black text-sm flex items-center justify-center">
                AP
              </div>
              <div>
                <h4 className="text-sm font-black text-neutral-900 leading-tight">ApexPlanet Dev</h4>
                <p className="text-[11px] text-neutral-500 font-bold">Task 3 Portfolio</p>
              </div>
            </div>

            {/* Bento Block 2: Quick Metrics */}
            <div className="bg-emerald-400 p-4 rounded-2xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[80px]">
              <span className="text-[10px] font-black text-neutral-900 uppercase tracking-wide">CSS Grid Mastery</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black font-mono text-neutral-900">98%</span>
                <span className="text-[10px] text-neutral-900 bg-white border-2 border-neutral-900 px-1.5 py-0.5 rounded font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  +12%
                </span>
              </div>
            </div>

            {/* Bento Block 3: Dynamic Visual / Action Block */}
            <div className={`bg-amber-400 p-4 rounded-2xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center ${
              deviceMode === 'mobile' ? 'hidden' : 'col-span-1'
            } ${deviceMode === 'desktop' ? 'col-span-1' : ''}`}>
              <h5 className="text-xs font-black text-neutral-900 mb-1">Flexbox vs Grid</h5>
              <p className="text-[10px] text-neutral-900 font-semibold leading-normal">
                Grid is 2D (rows/cols) while Flex is 1D (rows OR cols). Media queries swap them beautifully.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Display and Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSS Panel */}
        <div className="bg-white border-2 border-neutral-900 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-neutral-900 px-5 py-3 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <Code className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>Simulated Media Query CSS</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500 border border-neutral-900 text-white px-2 py-0.5 rounded font-black">
              CSS3
            </span>
          </div>
          <div className="p-4 bg-neutral-950 flex-1">
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{activeCssCode}</code>
            </pre>
          </div>
        </div>

        {/* Explain & Tailwind Panel */}
        <div className="bg-white border-2 border-neutral-900 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-neutral-900 px-5 py-3 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <Info className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
              <span>How it Works</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-500 border border-neutral-900 text-white px-2 py-0.5 rounded font-black">
              Tailwind v4
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between gap-5 text-neutral-900">
            <p className="text-sm font-semibold leading-relaxed">
              {explanation}
            </p>
            
            <div className="bg-neutral-100 p-4 rounded-xl border-2 border-neutral-900">
              <span className="text-[10px] font-black text-neutral-500 uppercase block mb-1">Active Tailwind Classes:</span>
              <code className="text-xs font-mono text-indigo-600 block break-all font-bold">
                {activeTailwindClass}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

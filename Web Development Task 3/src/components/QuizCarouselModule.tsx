import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Play, RotateCcw, ChevronLeft, ChevronRight, Pause, 
  HelpCircle, Sparkles, Terminal, List, PlusCircle, CheckCircle, XCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion, CarouselImage } from '../types';

// Default Web Dev Questions
const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "Which CSS display property allows elements to change size to fit their container dynamically along 1-dimension?",
    options: ["display: block", "display: flex", "display: grid", "display: inline-block"],
    correctAnswer: 1,
    explanation: "Flexbox (display: flex) is designed for 1-dimensional layouts (either columns or rows), allowing flexible resizing of children."
  },
  {
    id: 'q2',
    question: "What is the correct syntax for a CSS Media Query targeting viewport widths that are at least 768px?",
    options: ["@media (max-width: 768px)", "@media screen and 768px", "@media (min-width: 768px)", "@media (width: >= 768px)"],
    correctAnswer: 2,
    explanation: "@media (min-width: 768px) applies styles for screens that are 768px wide or larger, commonly used for desktop-first or mobile-first scale-up."
  },
  {
    id: 'q3',
    question: "In JavaScript, which method is used to dynamically make network requests to retrieve JSON data?",
    options: ["window.getJSON()", "document.request()", "fetch()", "JSON.parse()"],
    correctAnswer: 2,
    explanation: "The fetch() API is the modern native JavaScript way to fetch resources asynchronously across the network."
  },
  {
    id: 'q4',
    question: "What does the 'A' in AJAX stands for?",
    options: ["Advanced", "Asynchronous", "Aggregate", "Application"],
    correctAnswer: 1,
    explanation: "AJAX stands for Asynchronous JavaScript and XML, allowing web pages to update content dynamically without reloading."
  }
];

// Beautiful high-res tech/minimal unsplash images
const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 'img1',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    title: 'Modern Code Workspace',
    author: 'Artem Sapegin',
    description: 'A clean, high-contrast editor setup optimized for responsive styling.'
  },
  {
    id: 'img2',
    url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1000&q=80',
    title: 'System Diagnostics & Logs',
    author: 'Florian Olivo',
    description: 'Dynamic terminal dashboards communicating live API fetch parameters.'
  },
  {
    id: 'img3',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    title: 'Mobile App Wireframing',
    author: 'Halagate',
    description: 'Designing user interactions, animations, and touch targets.'
  },
  {
    id: 'img4',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    title: 'Responsive Layout Outlines',
    author: 'Arian Darvishi',
    description: 'Structuring components for fluid width adapters across devices.'
  }
];

export default function QuizCarouselModule() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'carousel'>('quiz');

  // QUIZ STATE
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUESTIONS);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Timer States
  const [timeRemaining, setTimeRemaining] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom Question Creator form states
  const [newQuestion, setNewQuestion] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [newOpt4, setNewOpt4] = useState('');
  const [newCorrect, setNewCorrect] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [showCreator, setShowCreator] = useState(false);

  // CAROUSEL STATE
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [carouselInterval, setCarouselInterval] = useState(3000);
  const [carouselLogs, setCarouselLogs] = useState<string[]>(['[System] Carousel initialized.']);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- QUIZ LOGIC ---
  useEffect(() => {
    if (quizStarted && !quizComplete && !isAnswered) {
      setTimeRemaining(15);
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Out of time - auto lock
            clearInterval(timerRef.current!);
            handleAnswerSelect(-1); // special index for timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, currentQIndex, quizComplete, isAnswered]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newOpt1 || !newOpt2 || !newOpt3 || !newOpt4) return;

    const q: QuizQuestion = {
      id: `custom_${Date.now()}`,
      question: newQuestion,
      options: [newOpt1, newOpt2, newOpt3, newOpt4],
      correctAnswer: newCorrect,
      explanation: newExplanation || "No custom explanation provided."
    };

    setQuestions((prev) => [...prev, q]);
    
    // reset form
    setNewQuestion('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewOpt4('');
    setNewCorrect(0);
    setNewExplanation('');
    setShowCreator(false);
  };

  // --- CAROUSEL LOGIC ---
  const addCarouselLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setCarouselLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 7)]);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => {
      const nextIdx = (prev + 1) % CAROUSEL_IMAGES.length;
      addCarouselLog(`Rotated next to Slide ${nextIdx + 1}`);
      return nextIdx;
    });
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => {
      const prevIdx = (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
      addCarouselLog(`Rotated previous to Slide ${prevIdx + 1}`);
      return prevIdx;
    });
  };

  // Auto rotate carousel effect
  useEffect(() => {
    if (isCarouselPlaying) {
      carouselTimerRef.current = setInterval(() => {
        nextSlide();
      }, carouselInterval);
    }
    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [isCarouselPlaying, carouselInterval, carouselIndex]);

  const toggleCarouselPlay = () => {
    setIsCarouselPlaying(!isCarouselPlaying);
    addCarouselLog(isCarouselPlaying ? "Auto-play paused" : "Auto-play resumed");
  };

  return (
    <div className="space-y-6" id="quiz-carousel-module-root">
      {/* Tab Selectors */}
      <div className="flex border-b-2 border-neutral-900 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold border-2 border-neutral-900 rounded-t-2xl transition-all ${
            activeTab === 'quiz'
              ? 'bg-indigo-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-0.5'
              : 'bg-white text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="quiz-tab-btn"
        >
          <Award className="w-4 h-4 stroke-[2.5]" />
          Interactive Quiz
        </button>
        <button
          onClick={() => setActiveTab('carousel')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold border-2 border-neutral-900 rounded-t-2xl transition-all ${
            activeTab === 'carousel'
              ? 'bg-indigo-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-0.5'
              : 'bg-white text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="carousel-tab-btn"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          Image Carousel
        </button>
      </div>

      {/* --- TAB 1: QUIZ --- */}
      {activeTab === 'quiz' && (
        <div className="space-y-6" id="quiz-workspace">
          {!quizStarted && !quizComplete ? (
            /* Intro Screen */
            <div className="bg-white border-2 border-neutral-900 p-8 rounded-[2rem] text-center space-y-6 max-w-xl mx-auto my-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <HelpCircle className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-neutral-900">Frontend Concepts Quiz</h3>
                <p className="text-neutral-600 text-sm max-w-sm mx-auto leading-relaxed font-semibold">
                  Test your skills on modern web development concepts including Flexbox, Grid, Media Queries, and fetch APIs!
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-mono text-neutral-900 bg-neutral-100 p-3.5 rounded-2xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-extrabold">
                <span>Total: {questions.length} Questions</span>
                <span className="text-neutral-400">|</span>
                <span>Time/Q: 15s</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-2xl border-2 border-neutral-900 text-xs font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  id="start-quiz-btn"
                >
                  <Play className="w-4 h-4 stroke-[2.5]" />
                  Start Interactive Quiz
                </button>
                <button
                  onClick={() => setShowCreator(!showCreator)}
                  className="px-6 py-3 bg-white text-neutral-900 rounded-2xl border-2 border-neutral-900 text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  id="add-question-btn"
                >
                  Create Custom Question
                </button>
              </div>
            </div>
          ) : quizComplete ? (
            /* Final Score Screen */
            <div className="bg-white border-2 border-neutral-900 p-8 rounded-[2rem] text-center space-y-6 max-w-xl mx-auto my-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-neutral-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-indigo-500 transition-all duration-1000"
                  style={{ clipPath: `polygon(50% 50%, -50% -50%, ${score / questions.length * 100}% -50%)` }}
                ></div>
                <div className="absolute inset-2 bg-[#F7F7F7] border-2 border-neutral-900 rounded-full flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-2xl font-black font-mono text-neutral-900">{score} / {questions.length}</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Score</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-neutral-900">
                  {score === questions.length ? "Perfect Score! 🌟" : score >= questions.length / 2 ? "Great Effort! 👍" : "Keep Learning! 📚"}
                </h3>
                <p className="text-neutral-600 text-sm max-w-xs mx-auto leading-relaxed font-semibold">
                  You scored {(score / questions.length * 100).toFixed(0)}% in the Advanced Styling and JS challenge.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={startQuiz}
                  className="px-5 py-2.5 bg-indigo-500 text-white border-2 border-neutral-900 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  id="retry-quiz-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizComplete(false);
                  }}
                  className="px-5 py-2.5 bg-white text-neutral-900 border-2 border-neutral-900 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  id="back-quiz-home-btn"
                >
                  Back to Hub
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question card */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-6 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  {/* Timer Bar */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-200 border-b-2 border-neutral-900">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        timeRemaining <= 4 ? 'bg-rose-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${(timeRemaining / 15) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-6 mt-3 font-mono font-bold">
                    <span>Question {currentQIndex + 1} of {questions.length}</span>
                    <span className={`font-black ${timeRemaining <= 4 ? 'text-rose-500 animate-pulse' : 'text-neutral-900'}`}>
                      Time left: {timeRemaining}s
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-neutral-900 leading-snug mb-6">
                    {questions[currentQIndex].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQIndex].options.map((opt, idx) => {
                      const isCorrect = idx === questions[currentQIndex].correctAnswer;
                      const isSelected = idx === selectedAnswer;
                      
                      let btnStyle = "bg-white hover:bg-neutral-50 border-neutral-900 text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]";
                      let icon = null;

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-400 border-neutral-900 text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-extrabold";
                          icon = <CheckCircle className="w-5 h-5 text-neutral-900 shrink-0 stroke-[2.5]" />;
                        } else if (isSelected) {
                          btnStyle = "bg-rose-400 border-neutral-900 text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-extrabold";
                          icon = <XCircle className="w-5 h-5 text-neutral-900 shrink-0 stroke-[2.5]" />;
                        } else {
                          btnStyle = "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerSelect(idx)}
                          className={`w-full p-4 rounded-xl border-2 text-left text-xs font-bold flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                          id={`quiz-option-${idx}-btn`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded border-2 border-neutral-900 bg-neutral-100 flex items-center justify-center text-[11px] font-mono font-black text-neutral-900 shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            {opt}
                          </span>
                          {icon}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button / Explanation */}
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-5 border-t-2 border-neutral-200 space-y-4"
                    >
                      <div className="bg-[#F7F7F7] p-4 rounded-xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-mono text-indigo-600 uppercase block mb-1 font-black">
                          Explanation:
                        </span>
                        <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                          {questions[currentQIndex].explanation}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl border-2 border-neutral-900 text-xs font-black flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                          id="quiz-next-btn"
                        >
                          {currentQIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Progress Panel */}
              <div className="space-y-4">
                <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 text-xs font-black text-neutral-900 border-b-2 border-neutral-100 pb-3">
                    <List className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
                    <span>Progress Tracker</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2.5">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xs font-mono font-black border-2 transition-all ${
                          idx === currentQIndex
                            ? 'bg-indigo-500 border-neutral-900 text-white scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : idx < currentQIndex
                            ? 'bg-emerald-400 border-neutral-900 text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white border-neutral-900 text-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quit Card */}
                <div className="bg-white border-2 border-dashed border-neutral-300 rounded-[2rem] p-4 text-center">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to end the quiz?")) {
                        setQuizStarted(false);
                      }
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 transition"
                    id="quit-quiz-btn"
                  >
                    Quit Quiz and Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Question Builder collapse */}
          {showCreator && (
            <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-6 max-w-xl mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                  <span className="text-sm font-black text-neutral-900">Create Custom JS Quiz Question</span>
                </div>
                <button 
                  onClick={() => setShowCreator(false)}
                  className="text-xs font-bold text-neutral-400 hover:text-neutral-600"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">QUESTION TEXT</label>
                  <input
                    type="text"
                    required
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g., Which JS array method returns a brand new filtered array?"
                    className="w-full bg-white border-2 border-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-semibold"
                    id="new-question-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">OPTION A</label>
                    <input
                      type="text"
                      required
                      value={newOpt1}
                      onChange={(e) => setNewOpt1(e.target.value)}
                      placeholder="Choice A"
                      className="w-full bg-white border-2 border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-semibold"
                      id="new-opt-a-input"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">OPTION B</label>
                    <input
                      type="text"
                      required
                      value={newOpt2}
                      onChange={(e) => setNewOpt2(e.target.value)}
                      placeholder="Choice B"
                      className="w-full bg-white border-2 border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-semibold"
                      id="new-opt-b-input"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">OPTION C</label>
                    <input
                      type="text"
                      required
                      value={newOpt3}
                      onChange={(e) => setNewOpt3(e.target.value)}
                      placeholder="Choice C"
                      className="w-full bg-white border-2 border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-semibold"
                      id="new-opt-c-input"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">OPTION D</label>
                    <input
                      type="text"
                      required
                      value={newOpt4}
                      onChange={(e) => setNewOpt4(e.target.value)}
                      placeholder="Choice D"
                      className="w-full bg-white border-2 border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-semibold"
                      id="new-opt-d-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">CORRECT ANSWER</label>
                    <select
                      value={newCorrect}
                      onChange={(e) => setNewCorrect(parseInt(e.target.value))}
                      className="w-full bg-white border-2 border-neutral-900 rounded-xl px-2 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-bold"
                      id="new-correct-select"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 font-black block mb-1">EDUCATIONAL EXPLANATION</label>
                    <input
                      type="text"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Explain why this choice is correct..."
                      className="w-full bg-white border-2 border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-indigo-500 font-semibold"
                      id="new-explanation-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-400 text-neutral-900 border-2 border-neutral-900 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-sans"
                  id="submit-new-question-btn"
                >
                  Add Custom Question to Pool
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: CAROUSEL --- */}
      {activeTab === 'carousel' && (
        <div className="space-y-6" id="carousel-workspace">
          {/* Main Visual Carousel Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {/* Carousel Active Slide */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={CAROUSEL_IMAGES[carouselIndex].url}
                        alt={CAROUSEL_IMAGES[carouselIndex].title}
                        className="w-full h-full object-cover brightness-75"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                      {/* Photo Author Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-900 border-2 border-neutral-900 font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Photo by {CAROUSEL_IMAGES[carouselIndex].author}
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-6 left-6 right-6 space-y-1">
                        <h4 className="text-xl font-black text-white font-sans tracking-tight">
                          {CAROUSEL_IMAGES[carouselIndex].title}
                        </h4>
                        <p className="text-slate-200 text-xs leading-relaxed max-w-lg font-semibold font-sans">
                          {CAROUSEL_IMAGES[carouselIndex].description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    id="carousel-prev-btn"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    id="carousel-next-btn"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Progress Indicators and Pause Control */}
                <div className="flex items-center justify-between mt-4 border-t-2 border-neutral-100 pt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleCarouselPlay}
                      className="p-2 rounded-xl bg-white text-neutral-900 border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 transition-all"
                      id="carousel-play-pause-btn"
                    >
                      {isCarouselPlaying ? <Pause className="w-4 h-4 stroke-[2.5]" /> : <Play className="w-4 h-4 text-indigo-500 stroke-[2.5]" />}
                    </button>
                    
                    <div className="flex gap-2">
                      {CAROUSEL_IMAGES.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCarouselIndex(idx);
                            addCarouselLog(`Manually jumped to Slide ${idx + 1}`);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 border border-neutral-900 ${
                            idx === carouselIndex ? 'w-6 bg-indigo-500' : 'w-2.5 bg-white hover:bg-neutral-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Interval Slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 font-bold">SPEED:</span>
                    <input
                      type="range"
                      min="1000"
                      max="5000"
                      step="500"
                      value={carouselInterval}
                      onChange={(e) => {
                        const newSpeed = parseInt(e.target.value);
                        setCarouselInterval(newSpeed);
                        addCarouselLog(`Interval speed updated to ${newSpeed}ms`);
                      }}
                      className="w-20 accent-indigo-500 h-1.5 cursor-pointer bg-neutral-200 rounded-lg border border-neutral-300"
                      id="carousel-speed-slider"
                    />
                    <span className="text-[10px] font-mono text-indigo-500 font-extrabold bg-white border-2 border-neutral-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {carouselInterval / 1000}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* JavaScript State Monitor Panel */}
            <div className="space-y-4">
              <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 text-xs font-black text-neutral-900 border-b-2 border-neutral-100 pb-3">
                  <Terminal className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
                  <span>JS Carousel State Engine</span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border-2 border-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <pre className="text-[11px] font-mono text-indigo-400 leading-normal overflow-x-auto">
                    <code>
                      {JSON.stringify({
                        currentIndex: carouselIndex,
                        activeImageId: CAROUSEL_IMAGES[carouselIndex].id,
                        isPlaying: isCarouselPlaying,
                        rotationIntervalMs: carouselInterval,
                        totalSlidesCount: CAROUSEL_IMAGES.length,
                      }, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Event Logs panel */}
              <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-5 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xs font-black text-neutral-900">Carousel Event Console</span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {carouselLogs.map((log, idx) => (
                    <div key={idx} className="text-[10px] font-mono text-neutral-500 leading-tight font-semibold">
                      <span className="text-indigo-500">⚙️</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

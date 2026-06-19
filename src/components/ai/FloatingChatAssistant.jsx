import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, X, Send, Bot, User, Sparkles, CornerDownLeft } from 'lucide-react';

export const FloatingChatAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I am your AI Career Assistant. How can I help you accelerate your career today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  const quickReplies = [
    { text: '📝 Create Cover Letter', query: 'generate cover letter' },
    { text: '🚀 React Dev Path', query: 'suggest react developer career path' },
    { text: '💼 Interview Tips', query: 'give me interview guidance' },
    { text: '🎓 Certificate FAQ', query: 'how do i get a certificate' }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseText = getAiResponse(text.toLowerCase());
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const getAiResponse = (query) => {
    // 1. Cover Letter Generation
    if (query.includes('cover letter') || query.includes('write a cover letter')) {
      const profileName = user?.profile?.fullName || 'John Doe';
      const skills = user?.profile?.skills?.join(', ') || 'React, Tailwind CSS, JavaScript';
      return `### 📝 Custom Cover Letter Draft\n\nHere is an ATS-optimized cover letter template based on your profile details:\n\n---\n\n**Dear Hiring Manager,**\n\nI am writing to express my enthusiastic interest in the Frontend Developer position at your organization. As a skilled developer proficient in **${skills}**, I am confident in my ability to immediately add value to your product engineering teams.\n\nIn my previous projects, I successfully implemented responsive user interfaces, structured complex global state models, and improved application load times by optimizing web assets. I specialize in building smooth UX transition models using modern toolsets and styling compilers.\n\nI would welcome the opportunity to discuss how my skillset and background align with your engineering goals. Thank you for your time and consideration.\n\nSincerely,  \n**${profileName}**`;
    }

    // 2. React Developer Career Path
    if (query.includes('react') && (query.includes('path') || query.includes('career') || query.includes('suggest'))) {
      return `### 🚀 React Developer Career Roadmap\n\nHere is a recommended path to master React and become an industry-ready engineer:\n\n1. **Core Fundamentals**: Deep understanding of JS ES6+ (Scope, Promises, Async/Await, Array Methods).\n2. **React Fundamentals**: JSX, Props, State, Component Lifecycle, Conditional Rendering.\n3. **State Management**: Master Context API for simple scopes, and transition to **Redux Toolkit** for enterprise-scale states.\n4. **CSS & Layouts**: Learn **Tailwind CSS** for rapid styling, and **Framer Motion** to build premium micro-animations.\n5. **Tooling & Build**: Build bundling profiles with **Vite** and configure testing suites with Jest or Vitest.\n6. **PWA Integration**: Configure custom service workers to enable offline routing caching.`;
    }

    // 3. Interview Guidance
    if (query.includes('interview') || query.includes('prep') || query.includes('guidance')) {
      return `### 💼 Professional Interview Guidance\n\nUse this checklist to ace your next technical interview:\n\n- **The STAR Method**: When answering behavioral questions, structure responses by **S**ituation, **T**ask, **A**ction, and **R**esult.\n- **Think Out Loud**: In coding rounds, explain your logical approach BEFORE typing syntax. Interviewers care about your problem-solving framework.\n- **Master State/API**: Be ready to explain how state synchronization and React virtual diffing operate under the hood.\n- **Ask Questions**: At the end of the meeting, ask questions like: *"What does a typical day look like for an engineer here?"* or *"What is your team's approach to technical debt?"*`;
    }

    // 4. Certificate FAQ
    if (query.includes('certificate') || query.includes('cert') || query.includes('quiz')) {
      return `### 🎓 Skill Assessment & Certificates\n\nTo earn a verified certificate on CareerConnect Pro Ultimate:\n\n1. Navigate to the **Skill Assessments** page.\n2. Select a technology category (such as React JS, JavaScript, or SQL) and click **Start Quiz**.\n3. Answer all Multiple Choice Questions before the timer expires.\n4. Score **80% or higher** to pass the evaluation.\n5. Upon completion, click **View Certificate** to open, print, or download your PDF certificate containing a unique verification QR code!`;
    }

    // 5. Resume Builder Help
    if (query.includes('resume') || query.includes('builder')) {
      return `### 📝 ATS-Friendly Resume Builder\n\nOur platform includes a live-preview Resume Builder. To use it:\n\n1. Select **Resume Builder** from the top navigation bar.\n2. Complete your bio, education records, work experiences, projects, and certifications list.\n3. Switch templates on-the-fly (choose from **Professional, Modern, ATS-Friendly, or Executive**).\n4. Click **Download Resume** to export a clean, parseable PDF file generated via jsPDF.`;
    }

    // Default Fallback
    return `Thank you for asking! I can help you with:
- Writing custom **Cover Letters**
- Career roadmaps (e.g. **React Dev Path**)
- **Interview tips** and advice
- Explaining how to earn **Certificates** and use the **Resume Builder**
    
Feel free to select one of the suggested replies below or type a query!`;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 p-4 bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
        style={{ animationDuration: '3s' }}
        title="AI Career Assistant"
      >
        {isOpen ? <X className="h-6 w-6 animate-pulse" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-22 right-5 z-40 w-92 md:w-96 h-[500px] glass-card rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-float">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 dark:from-brand-900/80 dark:to-indigo-950/80 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide flex items-center gap-1.5">
                  AI Career Expert <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                </h3>
                <span className="text-[10px] opacity-75">Platform Guide & Writer</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20 no-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-xl flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200'}`}>
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user' ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80 rounded-tl-none'
                }`}>
                  {/* Basic markdown renderer */}
                  <div className="space-y-1.5 whitespace-pre-line">
                    {msg.text.split('\n\n').map((paragraph, i) => {
                      if (paragraph.startsWith('###')) {
                        return <h4 key={i} className="font-bold text-sm text-brand-600 dark:text-brand-400 mt-2 mb-1">{paragraph.replace('###', '').trim()}</h4>;
                      }
                      if (paragraph.startsWith('-') || paragraph.startsWith('*')) {
                        return (
                          <ul key={i} className="list-disc list-inside space-y-1 pl-1">
                            {paragraph.split('\n').map((li, j) => (
                              <li key={j}>{li.replace(/^[-\*]\s*/, '').trim()}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={i}>{paragraph}</p>;
                    })}
                  </div>
                  <span className={`text-[9px] block text-right mt-1.5 ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies / Suggested Questions */}
          {messages.length < 5 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar bg-slate-50/20">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply.query)}
                  className="flex-shrink-0 px-3 py-1.5 text-[10px] font-semibold bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:hover:bg-brand-950/20 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder="Ask anything or generate content..."
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className="p-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatAssistant;

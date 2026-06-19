import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailService } from '../../services/emailService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Mail, Inbox, Clock, RefreshCw, Send, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

export const EmailSimulation = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'templates'
  const [selectedTemplate, setSelectedTemplate] = useState('Registration');
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    const list = await emailService.listSent();
    setEmails(list);
    if (list.length > 0 && !activeEmail) {
      setActiveEmail(list[0]);
    }
  };

  const fetchTemplates = async () => {
    const list = await emailService.getTemplates();
    setTemplates(list);
  };

  useEffect(() => {
    fetchEmails();
    fetchTemplates();
    
    // Live update when new email is simulated
    const handleEmailSimulated = () => {
      fetchEmails();
    };
    window.addEventListener('email_simulated', handleEmailSimulated);
    return () => window.removeEventListener('email_simulated', handleEmailSimulated);
  }, []);

  const triggerTestEmail = async () => {
    setLoading(true);
    try {
      let vars = {
        name: user?.name || 'Muham Seeker',
        email: user?.email || 'seeker@careerconnect.com',
        role: user?.role || 'seeker',
        jobTitle: 'Senior Frontend Developer',
        companyName: 'TechFlow Solutions',
        dateTime: 'June 25th, 2026 at 10:00 AM'
      };
      await emailService.sendSimulated(selectedTemplate, vars);
      showToast('success', 'Email Simulated', `Dispatched "${selectedTemplate}" simulated email!`);
      setActiveTab('inbox');
      await fetchEmails();
    } catch (err) {
      showToast('error', 'Error', 'Failed to generate test email.');
    } finally {
      setLoading(false);
    }
  };

  // Extract reset-password link
  const renderBodyWithLinks = (text) => {
    if (!text) return '';
    // Find URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Parse pathname/search to make relative route
        try {
          const parsed = new URL(part);
          const route = parsed.pathname + parsed.search;
          return (
            <button
              key={index}
              onClick={() => navigate(route)}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline block my-2 p-2 bg-brand-50/50 dark:bg-brand-950/20 rounded-xl border border-brand-200/50 dark:border-brand-900/50 text-center w-full max-w-xs transition-colors"
            >
              Click here to trigger loop Action
            </button>
          );
        } catch (e) {
          return part;
        }
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-float" style={{ animationDuration: '6s' }}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="h-7 w-7 text-brand-600 dark:text-brand-400" />
            Email Simulation Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Simulate and debug system transactional emails, check reset tokens, and test role-based triggers.
          </p>
        </div>
        
        {/* Email generator widget */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="bg-transparent text-xs font-semibold focus:outline-none border-none dark:text-white pr-8"
          >
            <option value="Registration">Registration Alert</option>
            <option value="Password Reset">Password Reset Link</option>
            <option value="Application Submitted">App Received</option>
            <option value="Interview Invitation">Interview Invite</option>
            <option value="Selection">Job Offer Letter</option>
          </select>
          <button
            onClick={triggerTestEmail}
            disabled={loading}
            className="btn-primary py-2 px-3 flex items-center gap-1.5 text-xs font-bold"
          >
            {loading ? (
              <span className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-3 w-3" /> Simulate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Navigation Tabs & List */}
        <div className="lg:col-span-5 flex flex-col glass-card rounded-3xl overflow-hidden min-h-[450px]">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'inbox' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Inbox className="h-4 w-4" />
              Inbox ({emails.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'templates' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              Templates ({templates.length})
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[400px]">
            {activeTab === 'inbox' ? (
              emails.length === 0 ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                  <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">No simulated emails sent yet. Select a template and click "Simulate" to dispatch one.</p>
                </div>
              ) : (
                emails.map(email => (
                  <div
                    key={email.id}
                    onClick={() => setActiveEmail(email)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                      activeEmail?.id === email.id ? 'bg-brand-50/25 dark:bg-brand-950/15 border-l-4 border-brand-500' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{email.to}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 truncate">{email.type}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{email.subject}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  </div>
                ))
              )
            ) : (
              templates.map(tmpl => (
                <div key={tmpl.type} className="p-4 bg-transparent">
                  <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">{tmpl.type} Template</h4>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5">Subject: {tmpl.subject}</p>
                  <pre className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl mt-2 overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
                    {tmpl.body}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Preview Panel */}
        <div className="lg:col-span-7 flex flex-col glass-card rounded-3xl overflow-hidden min-h-[450px]">
          {activeTab === 'inbox' && activeEmail ? (
            <div className="flex flex-col h-full">
              {/* Mail Header */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{activeEmail.subject}</h3>
                    <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <p>
                        <span className="font-bold">From:</span> CareerConnect System &lt;no-reply@careerconnect.pro&gt;
                      </p>
                      <p>
                        <span className="font-bold">To:</span> {activeEmail.to}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
                    {activeEmail.type}
                  </span>
                </div>
              </div>

              {/* Mail Body */}
              <div className="flex-1 p-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-900/30 overflow-y-auto whitespace-pre-wrap">
                {renderBodyWithLinks(activeEmail.body)}
              </div>

              {/* Mail Footer */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/20 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Verification logs - ID: {activeEmail.id}</span>
                <span>Sent: {new Date(activeEmail.sentAt).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 text-center bg-white dark:bg-slate-900/10">
              <Eye className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
              <h3 className="font-bold text-sm">Preview window</h3>
              <p className="text-xs max-w-xs mt-1">Select any simulated email from the inbox list to preview headers, metadata, and execute deep links.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailSimulation;

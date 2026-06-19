import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchApplications } from '../../store/applicationSlice';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Calendar, CheckCircle2, Clock, Ban, ChevronRight, MessageSquare, ListCollapse } from 'lucide-react';

export const ApplicationTracker = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const applications = useSelector(state => state.applications.items);
  const appStatus = useSelector(state => state.applications.status);

  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    if (appStatus === 'idle') dispatch(fetchApplications());
  }, [dispatch, appStatus]);

  // Seeker applications
  const seekerApps = applications.filter(a => a.seekerId === user?.id);

  // Set default active app
  useEffect(() => {
    if (seekerApps.length > 0 && !activeApp) {
      setActiveApp(seekerApps[0]);
    }
  }, [seekerApps, activeApp]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold text-[10px] rounded-full">Selected</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 font-bold text-[10px] rounded-full">Not Selected</span>;
      case 'Interview Scheduled':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 font-bold text-[10px] rounded-full">Interview</span>;
      case 'Shortlisted':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400 font-bold text-[10px] rounded-full">Shortlisted</span>;
      case 'Under Review':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 font-bold text-[10px] rounded-full">Under Review</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 font-bold text-[10px] rounded-full">Applied</span>;
    }
  };

  const steps = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

  const getStepIndex = (status) => {
    if (status === 'Rejected') return -1;
    return steps.indexOf(status);
  };

  const activeStepIdx = activeApp ? getStepIndex(activeApp.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-float" style={{ animationDuration: '6s' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Application Tracking Board
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Monitor your job applications pipeline status, interview details, and feedback records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Sent Applications List */}
        <div className="lg:col-span-5 flex flex-col glass-card rounded-3xl overflow-hidden min-h-[450px]">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/80 font-bold text-xs text-slate-500 dark:text-slate-400">
            Active Submissions ({seekerApps.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[400px]">
            {seekerApps.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                <p className="text-xs">You haven't submitted any job applications yet.</p>
                <Link to="/jobs" className="btn-primary py-2 px-4 text-xs font-bold mt-2">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              seekerApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setActiveApp(app)}
                  className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    activeApp?.id === app.id ? 'bg-brand-50/20 dark:bg-brand-950/10 border-l-4 border-brand-500' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">{app.companyName}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {getStatusBadge(app.status)}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Timeline & Logs */}
        <div className="lg:col-span-7 flex flex-col glass-card rounded-3xl overflow-hidden min-h-[450px]">
          {activeApp ? (
            <div className="flex flex-col h-full">
              {/* Header card details */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{activeApp.jobTitle}</h3>
                    <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-1">{activeApp.companyName}</p>
                  </div>
                  {getStatusBadge(activeApp.status)}
                </div>
              </div>

              {/* Progress Pipeline step bar */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/10">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Pipeline Progress</h4>
                
                {activeApp.status === 'Rejected' ? (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-2">
                    <Ban className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Application Declined</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Thank you for your interest in this role. The recruitment team has chosen to proceed with other candidates at this time.</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex justify-between items-center w-full">
                    {/* Line behind */}
                    <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-2 h-0.5 bg-brand-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${(activeStepIdx / (steps.length - 1)) * 95}%` }}
                    />
                    
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= activeStepIdx;
                      const isActive = idx === activeStepIdx;
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isActive ? 'bg-white border-brand-500 ring-4 ring-brand-500/20 dark:bg-slate-950' :
                              isCompleted ? 'bg-brand-500 border-brand-500 text-white' :
                              'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isCompleted && !isActive && <CheckCircle2 className="h-3 w-3 text-white" />}
                            {isActive && <div className="h-1.5 w-1.5 bg-brand-500 rounded-full animate-ping" />}
                          </div>
                          <span className={`text-[9px] font-bold mt-2 whitespace-nowrap hidden sm:block ${
                            isActive ? 'text-brand-600 dark:text-brand-400' :
                            isCompleted ? 'text-slate-900 dark:text-slate-300' :
                            'text-slate-400'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Details notes content logs */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto leading-relaxed bg-white dark:bg-slate-900/30">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Timeline History
                  </h4>
                  <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-3.5 mt-2">
                    <div className="relative">
                      <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950" />
                      <p className="text-xs font-bold">Applied Submitted</p>
                      <span className="text-[10px] text-slate-400">{new Date(activeApp.appliedDate).toLocaleString()}</span>
                    </div>
                    {activeApp.notes && (
                      <div className="relative">
                        <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-brand-500 border-2 border-white dark:border-slate-950" />
                        <p className="text-xs font-bold">Recruiter Status Update</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">{activeApp.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Application ID: {activeApp.id}</span>
                <span>Last updated: {new Date(activeApp.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 text-center bg-white dark:bg-slate-900/10">
              <ListCollapse className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
              <h3 className="font-bold text-sm">No application selected</h3>
              <p className="text-xs max-w-xs mt-1">Select an active submission to check status history updates and interview times.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracker;

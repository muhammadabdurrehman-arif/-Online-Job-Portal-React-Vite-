import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { fetchJobs, setSelectedJob } from '../../store/jobSlice';
import { fetchApplications } from '../../store/applicationSlice';
import { Briefcase, Calendar, Award, FileText, CheckCircle2, User, ChevronRight, Bookmark } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const jobs = useSelector(state => state.jobs.items);
  const jobsStatus = useSelector(state => state.jobs.status);
  const applications = useSelector(state => state.applications.items);
  const appStatus = useSelector(state => state.applications.status);

  useEffect(() => {
    if (jobsStatus === 'idle') dispatch(fetchJobs());
    if (appStatus === 'idle') dispatch(fetchApplications());
  }, [dispatch, jobsStatus, appStatus]);

  // Seeker applications
  const seekerApps = applications.filter(a => a.seekerId === user?.id);
  const interviews = seekerApps.filter(a => a.status === 'Interview Scheduled');

  // Job Recommendation matching logic (by overlap of skills)
  const seekerSkills = user?.profile?.skills || [];
  const recommendedJobs = jobs.filter(job => {
    // If user has no skills, recommend open jobs
    if (seekerSkills.length === 0) return true;
    return job.skills.some(skill => seekerSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
  }).slice(0, 3);

  const viewJobDetails = (job) => {
    dispatch(setSelectedJob(job));
    navigate('/jobs');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-float" style={{ animationDuration: '7s' }}>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 dark:from-brand-900/80 dark:to-indigo-950/80 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-white/80 text-xs md:text-sm mt-2 max-w-xl leading-relaxed">
            Ready to find your next opportunity? Build your ATS resume, take skill assessments to stand out, or prep with mock interviews.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/jobs" className="px-5 py-2.5 bg-white text-brand-600 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all">
              Explore Open Jobs
            </Link>
            <Link to="/seeker/resume-builder" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all">
              Build Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/85">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 rounded-xl w-fit">
            <Briefcase className="h-5 w-5" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-4">Applied Jobs</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{seekerApps.length}</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/85">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl w-fit">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-4">Interviews Scheduled</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{interviews.length}</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/85">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <Award className="h-5 w-5" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-4">Verified Skill Badges</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {/* Mock completion metrics */}
            {user?.profile?.skills?.length ? Math.min(user.profile.skills.length, 3) : 0}
          </h3>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/85">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-4">Resume Completeness</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{user?.profile?.profileCompletion || 15}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Recommended Opportunities</h2>
            <Link to="/jobs" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedJobs.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400 rounded-2xl">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs">No specific matching jobs found. Add more skills to your profile to receive tailored recommendations!</p>
              </div>
            ) : (
              recommendedJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => viewJobDetails(job)}
                  className="glass-card glass-card-hover p-5 rounded-2xl flex items-start gap-4 cursor-pointer border border-slate-200/50 dark:border-slate-800/85"
                >
                  <img
                    src={job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60'}
                    alt={job.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{job.companyName} - {job.location}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end justify-between self-stretch">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold rounded-full">
                      {job.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-4">{job.salary}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Timeline & Activity */}
        <div className="space-y-6">
          {/* Upcoming interviews */}
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Upcoming Interviews</h2>
            <div className="space-y-3">
              {interviews.length === 0 ? (
                <div className="glass-card p-6 text-center text-slate-400 rounded-2xl border border-slate-200/50 dark:border-slate-800/85">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">No upcoming interviews scheduled. Applied applications under review will appear here.</p>
                </div>
              ) : (
                interviews.map(interview => (
                  <div key={interview.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-start gap-3 shadow-sm">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Calendar className="h-4.5 w-4.5 animate-pulse-soft" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{interview.jobTitle}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{interview.companyName}</p>
                      <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl mt-2 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                        {interview.notes || 'Interview scheduled. Awaiting virtual link.'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick learning actions */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/85">
            <h3 className="font-bold text-sm text-slate-950 dark:text-white mb-3">Accelerate Your Search</h3>
            <div className="space-y-2.5">
              <Link to="/seeker/quizzes" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-brand-50/20 dark:bg-slate-950 dark:hover:bg-brand-950/15 border border-slate-200/40 dark:border-slate-800/60 rounded-xl transition-colors">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Earn Badges</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link to="/seeker/interview-prep" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-brand-50/20 dark:bg-slate-950 dark:hover:bg-brand-950/15 border border-slate-200/40 dark:border-slate-800/60 rounded-xl transition-colors">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Interview Practice</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

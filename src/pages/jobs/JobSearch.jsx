import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { fetchJobs, setFilters, resetFilters, setSelectedJob, selectFilteredJobs } from '../../store/jobSlice';
import { fetchApplications, applyToJob } from '../../store/applicationSlice';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Eye, Bookmark, X, AlertCircle } from 'lucide-react';

export const JobSearch = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const dispatch = useDispatch();

  const filteredJobs = useSelector(selectFilteredJobs);
  const jobsStatus = useSelector(state => state.jobs.status);
  const selectedJob = useSelector(state => state.jobs.selectedJob);
  const applications = useSelector(state => state.applications.items);
  const appStatus = useSelector(state => state.applications.status);
  const filters = useSelector(state => state.jobs.filters);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingLoader, setApplyingLoader] = useState(false);

  useEffect(() => {
    if (jobsStatus === 'idle') dispatch(fetchJobs());
    if (appStatus === 'idle') dispatch(fetchApplications());
  }, [dispatch, jobsStatus, appStatus]);

  // Set default selected job if none is set and jobs are loaded
  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJob) {
      dispatch(setSelectedJob(filteredJobs[0]));
    }
  }, [filteredJobs, selectedJob, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };

  const clearAllFilters = () => {
    dispatch(resetFilters());
  };

  const hasApplied = (jobId) => {
    if (!user) return false;
    return applications.some(a => a.jobId === jobId && a.seekerId === user.id);
  };

  const executeApply = async () => {
    if (!user) return;
    setApplyingLoader(true);
    try {
      await dispatch(applyToJob({
        jobId: selectedJob.id,
        seekerData: { id: user.id, name: user.name, email: user.email, profile: user.profile }
      })).unwrap();
      showToast('success', 'Application Sent!', `You successfully applied for ${selectedJob.title} at ${selectedJob.companyName}.`);
      setShowApplyModal(false);
    } catch (err) {
      showToast('error', 'Submission Failed', err || 'Already applied or connection error.');
    } finally {
      setApplyingLoader(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and simple keyword search */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by job title, company, or keywords..."
            className="input-field pl-10"
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <MapPin className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="City or Remote"
            className="input-field pl-10"
          />
        </div>

        <button onClick={clearAllFilters} className="btn-secondary whitespace-nowrap text-xs">
          Clear Filters
        </button>
      </div>

      {/* Advanced filters line */}
      <div className="flex flex-wrap gap-2.5 mb-8 bg-slate-100/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="bg-white dark:bg-slate-950 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none dark:text-white"
        >
          <option value="">Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          value={filters.experience}
          onChange={(e) => handleFilterChange('experience', e.target.value)}
          className="bg-white dark:bg-slate-950 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none dark:text-white"
        >
          <option value="">Experience Level</option>
          <option value="Junior">Junior (1-2 years)</option>
          <option value="Intermediate">Intermediate (3+ years)</option>
          <option value="Senior">Senior (5+ years)</option>
        </select>
        
        <input
          type="text"
          value={filters.skills}
          onChange={(e) => handleFilterChange('skills', e.target.value)}
          placeholder="Filter by Skill (e.g. React)"
          className="bg-white dark:bg-slate-950 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none dark:text-white max-w-[160px]"
        />
      </div>

      {/* Main split view layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Job List */}
        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
          {jobsStatus === 'loading' ? (
            <div className="py-12 text-center">
              <span className="h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400 rounded-3xl">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-xs">No jobs match your search parameters. Try checking spelling or clearing filters.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => dispatch(setSelectedJob(job))}
                className={`glass-card p-5 rounded-2xl flex items-start gap-4 cursor-pointer border transition-all ${
                  selectedJob?.id === job.id
                    ? 'border-brand-500 bg-brand-50/10 dark:bg-brand-950/10 shadow-md scale-[1.01]'
                    : 'border-slate-200/50 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <img
                  src={job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60'}
                  alt={job.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{job.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{job.companyName}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="mx-1.5">•</span>
                    <span className="flex items-center gap-0.5"><DollarSign className="h-3 w-3" /> {job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-md uppercase">
                    {job.type}
                  </span>
                  {hasApplied(job.id) && (
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold rounded-md">
                      Applied
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Detailed View */}
        <div className="lg:col-span-7 glass-card rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 sticky top-22">
          {selectedJob ? (
            <div className="flex flex-col min-h-[500px]">
              {/* Cover Details Header */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedJob.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60'}
                      alt={selectedJob.companyName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200/50 dark:border-slate-800 flex-shrink-0 shadow-sm"
                    />
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{selectedJob.title}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1.5 hover:underline cursor-pointer">
                        {selectedJob.companyName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Posted {new Date(selectedJob.postedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 rounded-full font-bold text-xs uppercase tracking-wide">
                    {selectedJob.type}
                  </span>
                </div>

                {/* Substats */}
                <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-slate-400" /> {selectedJob.salary}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-slate-400" /> {selectedJob.experience}</span>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 p-6 space-y-6 max-h-[350px] overflow-y-auto leading-relaxed">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Job Description</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Requirements</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-1">
                    {selectedJob.requirements?.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Desired Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedJob.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400 text-xs font-bold rounded-lg border border-brand-200/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Footer Actions */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                {!user ? (
                  <Link to="/login" className="btn-primary py-2.5 px-6 font-bold text-xs">
                    Login to Apply
                  </Link>
                ) : user.role !== 'seeker' ? (
                  <span className="text-xs text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    Register as Job Seeker to Apply
                  </span>
                ) : hasApplied(selectedJob.id) ? (
                  <button disabled className="px-6 py-2.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30 font-bold text-xs rounded-xl cursor-default">
                    Application Submitted
                  </button>
                ) : (
                  <button onClick={() => setShowApplyModal(true)} className="btn-primary py-2.5 px-6 font-bold text-xs">
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center min-h-[500px]">
              <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
              <h3 className="font-bold text-sm">No job selected</h3>
              <p className="text-xs max-w-xs mt-1">Select a job from the listing panel to view comprehensive role requirements and submit your application.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 animate-float" style={{ animationDuration: '5s' }}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Confirm Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You are applying for **{selectedJob.title}** at **{selectedJob.companyName}**.
              </p>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <p className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  Your Profile Information
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Name: <span className="font-semibold text-slate-900 dark:text-slate-300">{user?.name}</span>  
                  Email: <span className="font-semibold text-slate-900 dark:text-slate-300">{user?.email}</span>
                </p>
                <div className="mt-3">
                  <span className="font-bold text-[10px] text-slate-400 block mb-1">Attached Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {user?.profile?.skills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-brand-50/50 text-brand-700 dark:bg-brand-950/10 dark:text-brand-400 rounded text-[9px] font-bold">
                        {s}
                      </span>
                    ))}
                    {(!user?.profile?.skills || user.profile.skills.length === 0) && (
                      <span className="text-rose-500 text-[10px] font-bold">No skills added! Add skills in Profile to increase match rates.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/50 rounded-2xl text-[11px] text-blue-700 dark:text-blue-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  Submitting this application will instantly trigger a simulated confirmation email. Check the **Email Simulation Center** in the navbar to preview the sent message.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button onClick={() => setShowApplyModal(false)} className="btn-secondary py-2 px-4 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={executeApply}
                disabled={applyingLoader}
                className="btn-primary py-2 px-5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {applyingLoader ? (
                  <span className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;

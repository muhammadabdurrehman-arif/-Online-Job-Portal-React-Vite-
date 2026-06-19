import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Sparkles, Mail, Lock, CheckCircle, Chrome } from 'lucide-react';

export const Login = () => {
  const { login, user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [errorText, setErrorText] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Check for remembered email or redirect if already authenticated
  useEffect(() => {
    const remembered = localStorage.getItem('cc_remembered_email');
    if (remembered) setValue('email', remembered);
    
    if (user) {
      if (user.role === 'seeker') navigate('/seeker/dashboard');
      else if (user.role === 'employer') navigate('/employer/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [user, navigate, setValue]);

  const onSubmit = async (data) => {
    setLoadingState(true);
    setErrorText('');
    try {
      const loggedUser = await login(data.email, data.password, data.rememberMe);
      showToast('success', 'Welcome back!', `Logged in as ${loggedUser.name}`);
      
      if (loggedUser.role === 'seeker') navigate('/seeker/dashboard');
      else if (loggedUser.role === 'employer') navigate('/employer/dashboard');
      else if (loggedUser.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setErrorText(err.message || 'Login failed. Please verify credentials.');
      showToast('error', 'Login Failed', err.message || 'Verification error.');
    } finally {
      setLoadingState(false);
    }
  };

  const handleSocialLogin = async (role) => {
    setLoadingState(true);
    setErrorText('');
    try {
      // Simulate Google Auth
      let email = `${role}@careerconnect.com`;
      const loggedUser = await login(email, 'password123', false);
      showToast('success', 'Social Sign-in Success', `Logged in via Google as ${loggedUser.name}`);
      
      if (loggedUser.role === 'seeker') navigate('/seeker/dashboard');
      else if (loggedUser.role === 'employer') navigate('/employer/dashboard');
      else if (loggedUser.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setErrorText('Could not authenticate Google test account.');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="text-center relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign in to <span className="text-gradient">CareerConnect</span>
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Welcome back! Select a role or enter credentials.
          </p>
        </div>

        {errorText && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold leading-relaxed">
            {errorText}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email input */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="example@careerconnect.com"
                className={`input-field pl-10 ${errors.email ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
              />
            </div>
            {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.password ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
              />
            </div>
            {errors.password && <span className="text-[10px] text-rose-500 mt-1 block">{errors.password.message}</span>}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="rounded border-slate-300 dark:border-slate-800 text-brand-600 focus:ring-brand-500 h-4 w-4 cursor-pointer"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loadingState}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold mt-2"
          >
            {loadingState ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-5">
          <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Fast Login / Social Google Demo
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSocialLogin('seeker')}
              className="px-2 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Chrome className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>Job Seeker</span>
            </button>
            <button
              onClick={() => handleSocialLogin('employer')}
              className="px-2 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Chrome className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Employer</span>
            </button>
            <button
              onClick={() => handleSocialLogin('admin')}
              className="px-2 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <Chrome className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

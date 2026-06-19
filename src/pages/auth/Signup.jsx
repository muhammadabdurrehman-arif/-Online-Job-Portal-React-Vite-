import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Mail, Lock, User, UserCheck, Briefcase } from 'lucide-react';

export const Signup = () => {
  const { signup } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [selectedRole, setSelectedRole] = useState('seeker'); // 'seeker' | 'employer'

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoadingState(true);
    setErrorText('');
    try {
      const newUser = await signup(data.name, data.email, data.password, selectedRole);
      showToast('success', 'Registration Successful!', `Welcome ${newUser.name}. A confirmation email has been simulated.`);
      
      if (selectedRole === 'seeker') navigate('/seeker/dashboard');
      else navigate('/employer/dashboard');
    } catch (err) {
      setErrorText(err.message || 'Registration failed. Try again.');
      showToast('error', 'Registration Error', err.message || 'Verify parameters.');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full space-y-6 glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 left-0 h-40 w-40 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="text-center relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Join CareerConnect Pro Ultimate and land your dream job.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl relative">
          <button
            onClick={() => setSelectedRole('seeker')}
            type="button"
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'seeker'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Job Seeker
          </button>
          <button
            onClick={() => setSelectedRole('employer')}
            type="button"
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'employer'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Employer
          </button>
        </div>

        {errorText && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold leading-relaxed">
            {errorText}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name input */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                placeholder="Muham Seeker"
                className={`input-field pl-10 ${errors.name ? 'border-rose-500' : ''}`}
              />
            </div>
            {errors.name && <span className="text-[10px] text-rose-500 mt-1 block">{errors.name.message}</span>}
          </div>

          {/* Email input */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
                placeholder="example@careerconnect.com"
                className={`input-field pl-10 ${errors.email ? 'border-rose-500' : ''}`}
              />
            </div>
            {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Password input */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters long' }
                })}
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.password ? 'border-rose-500' : ''}`}
              />
            </div>
            {errors.password && <span className="text-[10px] text-rose-500 mt-1 block">{errors.password.message}</span>}
          </div>

          {/* Confirm Password input */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: value => value === passwordVal || 'Passwords do not match'
                })}
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.confirmPassword ? 'border-rose-500' : ''}`}
              />
            </div>
            {errors.confirmPassword && <span className="text-[10px] text-rose-500 mt-1 block">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loadingState}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold mt-2"
          >
            {loadingState ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

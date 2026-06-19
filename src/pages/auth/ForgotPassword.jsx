import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { emailService } from '../../services/emailService';
import { useNotifications } from '../../context/NotificationContext';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPassword = () => {
  const { showToast } = useNotifications();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // Trigger simulation
      await emailService.sendSimulated('Password Reset', {
        name: 'Career Seeker',
        email: email
      });
      showToast('success', 'Simulation Triggered', 'Password reset email simulated successfully.');
      setSuccess(true);
    } catch (err) {
      showToast('error', 'Error', 'Failed to simulate password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full space-y-6 glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-500/10 rounded-full blur-3xl" />
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            We will simulate sending a password recovery link.
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs leading-relaxed text-left">
              <p className="font-bold mb-1">✓ Reset Email Simulated!</p>
              We've dispatched a recovery link to **{email}**. To complete the reset, visit the **Email Simulation Center** in the top navigation bar, select the simulated email, and click the link!
            </div>
            <Link to="/login" className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email address"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Recovery Link
                </>
              )}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mt-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

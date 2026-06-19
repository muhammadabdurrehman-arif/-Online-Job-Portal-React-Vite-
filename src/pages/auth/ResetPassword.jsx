import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Lock, Check } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('error', 'Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showToast('error', 'Too short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate updating user password in mock database
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      showToast('success', 'Password Updated', 'Your password has been updated in the mock DB.');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full space-y-6 glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Set New Password
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Token: <code className="text-brand-600 font-bold">{token || 'invalid-or-missing'}</code>
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0" />
              <span>Your password has been updated! You can now log in.</span>
            </div>
            <button onClick={() => navigate('/login')} className="w-full btn-primary py-3">
              Go to Login
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="minimum 6 characters"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="re-enter password"
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
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

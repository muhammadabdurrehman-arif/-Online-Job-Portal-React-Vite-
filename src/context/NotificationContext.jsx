import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockApi } from '../utils/mockDb';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Fetch in-app notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const data = await mockApi.notifications.list(user.id);
    setNotifications(data);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listener for database notification triggers
  useEffect(() => {
    const handleNewNotification = () => {
      fetchNotifications();
    };
    window.addEventListener('new_notification', handleNewNotification);
    return () => {
      window.removeEventListener('new_notification', handleNewNotification);
    };
  }, [fetchNotifications]);

  // Toast utilities
  const showToast = useCallback((type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    // Auto remove after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Mark notification read
  const markAsRead = async (notifId) => {
    await mockApi.notifications.markRead(notifId);
    await fetchNotifications();
  };

  // Mark all read
  const markAllAsRead = async () => {
    if (!user) return;
    await mockApi.notifications.markAllRead(user.id);
    await fetchNotifications();
    showToast('success', 'Success', 'All notifications marked as read.');
  };

  // Live simulation event listener for simulated email sends
  useEffect(() => {
    const handleEmailSimulated = (e) => {
      const email = e.detail;
      // Show an interactive toast that links to the email simulator
      showToast('info', 'Simulated Email Sent', `To: ${email.to}\nSubject: ${email.subject}`);
    };

    window.addEventListener('email_simulated', handleEmailSimulated);
    return () => {
      window.removeEventListener('email_simulated', handleEmailSimulated);
    };
  }, [showToast]);

  const value = {
    notifications,
    toasts,
    fetchNotifications,
    showToast,
    removeToast,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Global Floating Toasts Panel */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 border transition-all duration-300 animate-float bg-white dark:bg-slate-900 ${
              toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20' :
              toast.type === 'error' ? 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20' :
              toast.type === 'info' ? 'border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20' :
              'border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Notification Badge Status Icon */}
            <div className="mt-0.5">
              {toast.type === 'success' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
              )}
              {toast.type === 'error' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold">✗</span>
              )}
              {toast.type === 'info' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold">i</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{toast.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-pre-line leading-relaxed">{toast.message}</p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

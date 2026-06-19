import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckSquare, Trash2, MailOpen } from 'lucide-react';

export const NotificationCenter = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllAsRead();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />;
      case 'error':
        return <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />;
      case 'warning':
        return <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />;
      default:
        return <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col max-h-96 w-full">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <span className="font-bold text-sm">Notifications</span>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline flex items-center gap-1 font-medium"
          >
            <CheckSquare className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 no-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
            <MailOpen className="h-8 w-8 stroke-[1.5]" />
            <p className="text-xs">No notifications yet</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                notif.read ? 'opacity-60 bg-white hover:bg-slate-50 dark:bg-slate-900' : 'bg-brand-50/10 dark:bg-brand-950/10 hover:bg-brand-50/20'
              }`}
            >
              {getIcon(notif.type)}
              
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                  {notif.title}
                  {!notif.read && (
                    <span className="h-1.5 w-1.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
                  )}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(notif.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-800/30">
        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white font-medium"
        >
          Close panel
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;

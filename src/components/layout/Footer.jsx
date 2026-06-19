import React from 'react';
import { Briefcase } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-600 text-white shadow-sm">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300">
              CareerConnect Pro
            </span>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} CareerConnect Pro Ultimate. All rights reserved.
          </p>
          
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Support Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

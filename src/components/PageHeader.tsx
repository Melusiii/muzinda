import React from 'react';
import { cn } from '../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  className, 
  children 
}) => {
  return (
    <header className={cn("sticky top-0 z-50 mb-12", className)}>
      <div className="glass bg-white/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary-dark font-manrope leading-tight uppercase italic">
              {title}
            </h1>
            {subtitle && (
              <p className="text-primary-dark/40 font-bold uppercase tracking-[0.2em] text-[9px] italic">
                {subtitle}
              </p>
            )}
          </div>
          {children && (
            <div className="flex items-center gap-4 w-full md:w-auto">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

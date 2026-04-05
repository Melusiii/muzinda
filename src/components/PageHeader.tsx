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
    <header className={cn("space-y-6 mb-12", className)}>
      <div className="flex gap-2 items-center text-[#4F7C2C]/60">
        <div className="w-8 h-[1px] bg-current opacity-20" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Official Muzinda Registry</span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-primary-dark font-manrope leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-primary-dark/40 font-bold uppercase tracking-[0.2em] text-[10px]">
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
    </header>
  );
};

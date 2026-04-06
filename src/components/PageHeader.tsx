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
  const renderTitle = (text: string) => {
    const parts = text.split(' ');
    if (parts.length < 2) return text;
    const last = parts.pop();
    return (
      <>
        {parts.join(' ')} <span className="italic text-primary">{last}</span>
      </>
    );
  };

  return (
    <header className={cn("mb-12", className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary-dark font-manrope leading-tight uppercase">
            {renderTitle(title)}
          </h1>
          {subtitle && (
            <p className="text-primary-dark/40 font-black uppercase tracking-[0.4em] text-[9px]">
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

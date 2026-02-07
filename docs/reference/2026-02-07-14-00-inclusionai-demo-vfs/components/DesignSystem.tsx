import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Typography ---
export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn("font-serif text-2xl font-semibold text-brand-dark mb-4 tracking-tight", className)}>
    {children}
  </h2>
);

export const SubTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn("font-sans text-xs font-bold uppercase tracking-wider text-brand-gray mb-2", className)}>
    {children}
  </h3>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium";
  
  const variants = {
    // Primary uses the new gradient directly or solid dark for high contrast
    primary: "bg-brand-dark text-white hover:bg-black border border-transparent shadow-sm rounded-lg hover:shadow-md",
    // Secondary interacts with the Cyan/Blue palette
    secondary: "bg-white text-brand-dark border border-brand-border hover:border-brand-cyan/50 hover:bg-brand-cyan-light hover:shadow-sm rounded-lg",
    ghost: "bg-transparent text-brand-gray hover:text-brand-dark hover:bg-brand-dark/5 rounded-lg",
    icon: "p-2 rounded-full hover:bg-brand-dark/5 text-brand-gray hover:text-brand-dark transition-colors",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const sizeStyles = variant === 'icon' ? '' : sizes[size];

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizeStyles, className)} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverEffect = false, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white border border-brand-border rounded-xl p-4 transition-all duration-300 relative overflow-hidden group",
      hoverEffect && "hover:shadow-md hover:border-brand-cyan/30 cursor-pointer",
      className
    )}
  >
    {/* Updated Hover Gradient to use the new Cyan/Blue mix */}
    {hoverEffect && (
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-full blur-xl transition-opacity duration-500" />
    )}
    {children}
  </div>
);

// --- Input / Select / Textarea ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          // Changed focus ring to Blue/Cyan
          "flex h-10 w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full appearance-none rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 transition-all font-sans pr-8",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  </div>
);

// --- Layout Containers ---
export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-1 overflow-hidden h-full relative", className)}>
    {children}
  </div>
);

export const Sidebar: React.FC<{ children: React.ReactNode; position: 'left' | 'right'; className?: string }> = ({ children, position, className }) => (
  <aside 
    className={cn(
      "h-full bg-white/50 backdrop-blur-sm flex flex-col border-brand-border z-10 w-72 shrink-0 transition-all",
      position === 'left' ? "border-r" : "border-l",
      className
    )}
  >
    {children}
  </aside>
);

export const MainContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <main className={cn("flex-1 h-full overflow-hidden flex flex-col relative", className)}>
    {children}
  </main>
);
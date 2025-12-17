import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  action?: ReactNode;
}

export function PageHeader({ action }: PageHeaderProps) {
  return (
    <header className="border-border border-b">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        <Link to="/" className="flex items-center">
          <h1 className="text-foreground cursor-pointer text-lg font-bold transition-opacity hover:opacity-80">
            TechBlog
          </h1>
        </Link>

        {action}
      </div>
    </header>
  );
}

interface HeaderButtonProps {
  to: string;
  children: ReactNode;
  variant?: 'default' | 'logout';
  icon?: ReactNode;
  mobileIcon?: ReactNode;
  onClick?: () => void;
}

export function HeaderButton({
  to,
  children,
  variant = 'default',
  icon,
  mobileIcon,
  onClick,
}: HeaderButtonProps) {
  const baseClasses =
    'bg-accent text-foreground h-10 rounded-xl px-4 text-sm font-semibold hover:bg-transparent';

  if (variant === 'logout' && mobileIcon) {
    return (
      <div className="flex items-center gap-8">
        <Button
          variant="ghost"
          className={`hidden md:flex ${baseClasses}`}
          onClick={onClick}
          asChild
        >
          <Link to={to}>
            {icon}
            {children}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="text-foreground flex h-10 md:hidden"
          onClick={onClick}
          asChild
        >
          <Link to={to}>{mobileIcon}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" className={baseClasses} onClick={onClick} asChild>
      <Link to={to}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}

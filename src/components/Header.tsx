import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export function Header() {
  const location = useLocation();
  const isStartPage = location.pathname === '/';

  return (
    <header className="border-border border-b">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        <Link to="/" className="flex items-center justify-center">
          <h1 className="text-foreground cursor-pointer text-lg leading-tight font-bold transition-opacity hover:opacity-80">
            TechBlog
          </h1>
        </Link>

        {isStartPage && (
          <Button
            variant="ghost"
            className="text-primary h-10 rounded-xl px-4 text-sm font-semibold hover:bg-transparent"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

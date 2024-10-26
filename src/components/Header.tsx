import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Generator' },
    { path: '/preview', icon: FileText, label: 'Preview' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span className="font-bold inline-block">KP Medizin</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                  location.pathname === path 
                    ? "text-foreground" 
                    : "text-foreground/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

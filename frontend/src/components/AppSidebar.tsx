import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ArrowUpRight,
  Users,
  LogOut,
  Library,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  onLogout: () => void;
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ onLogout, className, onNavigate }: AppSidebarProps) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/books', label: 'Books Catalogue', icon: BookOpen },
    { to: '/issue', label: 'Issue Book', icon: ArrowUpRight },
    { to: '/members', label: 'Members', icon: Users },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card/80 backdrop-blur border-r border-border p-4 select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Library className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-base leading-tight tracking-tight text-foreground">
            ShelfLife
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Library Management
          </p>
        </div>
      </div>

      <Separator className="mb-4 bg-border/60" />

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <Separator className="my-4 bg-border/60" />

      {/* User Info & Logout Card */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-1 ring-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              LB
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate text-foreground">
              Librarian
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              librarian@shelflife.com
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="w-full justify-center gap-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}

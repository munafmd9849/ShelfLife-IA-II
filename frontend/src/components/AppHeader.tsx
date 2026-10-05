import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/components/theme-provider';
import { AppSidebar } from './AppSidebar';

interface AppHeaderProps {
  onLogout: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'System circulation overview & operational metrics',
  },
  '/books': {
    title: 'Books Catalogue',
    subtitle: 'Manage and explore library books and live inventory',
  },
  '/issue': {
    title: 'Issue Book',
    subtitle: 'Assign available books to registered members',
  },
  '/members': {
    title: 'Members Directory',
    subtitle: 'Manage student and faculty member profiles',
  },
};

export function AppHeader({ onLogout }: AppHeaderProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Match title or dynamic member history title
  let pageInfo = pageTitles[location.pathname];
  if (!pageInfo && location.pathname.startsWith('/members/')) {
    pageInfo = {
      title: 'Member History',
      subtitle: 'Complete borrowing timeline and overdue status',
    };
  }
  if (!pageInfo) {
    pageInfo = {
      title: 'ShelfLife',
      subtitle: 'Library Circulation & Inventory Management',
    };
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur transition-all">
      {/* Left side: Hamburger for mobile + Page Title */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-9 w-9 shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <AppSidebar
              onLogout={onLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-foreground">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-muted-foreground">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Theme toggle + User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400 transition-all" />
          ) : (
            <Moon className="h-4 w-4 transition-all" />
          )}
        </Button>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-2.5 h-9 rounded-full hover:bg-accent/60"
            >
              <Avatar className="h-7 w-7 ring-1 ring-border">
                <AvatarFallback className="bg-primary/20 text-primary text-[11px] font-bold">
                  LB
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block text-xs font-semibold text-foreground">
                Librarian
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-foreground">
                  Librarian Staff
                </p>
                <p className="text-[11px] leading-none text-muted-foreground truncate">
                  librarian@shelflife.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs gap-2 cursor-pointer" disabled>
              <UserIcon className="h-3.5 w-3.5" />
              <span>Role: Librarian</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-xs gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, BookOpen, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api, getApiErrorMessage, TOKEN_KEY } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.login(email.trim(), password);
      localStorage.setItem(TOKEN_KEY, data.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to sign in. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background select-none">
      {/* Left Column: Visual branding and features */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-linear-to-b from-card/80 via-background to-background border-r border-border/60 relative overflow-hidden">
        {/* Subtle decorative background patterns */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Library className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              ShelfLife
            </span>
            <span className="block text-xs font-medium text-muted-foreground">
              Library Management System
            </span>
          </div>
        </div>

        {/* Center: Hero Description */}
        <div className="max-w-md space-y-6 relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Staff Circulation Portal · IA-II Verified</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Library management, <br />
            <span className="text-primary">simplified & scalable.</span>
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Manage catalogue volumes, assign book loans, track overdue circulation, and guarantee zero inventory race conditions.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60">
            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">Atomic DB</p>
              <p className="text-xs text-muted-foreground">Zero-copy issue prevention</p>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">Live Tracking</p>
              <p className="text-xs text-muted-foreground">Real-time overdue flags</p>
            </div>
          </div>
        </div>

        {/* Bottom: Footer info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground/70 relative z-10">
          <span>Full Stack Web Development IA-II</span>
          <span>College Campus Edition</span>
        </div>
      </div>

      {/* Right Column: Modern Sign In Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Mobile only branding */}
          <div className="flex md:hidden items-center gap-3 justify-center mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Library className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-foreground">ShelfLife</h1>
              <p className="text-xs text-muted-foreground">Library Management</p>
            </div>
          </div>

          <Card className="border-border/80 bg-card/80 backdrop-blur shadow-xl">
            <CardHeader className="space-y-1.5 pb-6">
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                Staff Sign In
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter your librarian credentials to access the circulation dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="py-2.5">
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                    Staff Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="librarian@shelflife.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="h-10 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 font-semibold text-sm gap-2 mt-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Demo helper pill */}
                <div className="rounded-lg border border-border/80 bg-muted/40 p-3 mt-4 text-center space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Demo Credentials
                  </p>
                  <p className="text-xs font-mono text-foreground/90">
                    librarian@shelflife.com / librarian123
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('librarian@shelflife.com');
                      setPassword('librarian123');
                    }}
                    className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    Click to fill credentials
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

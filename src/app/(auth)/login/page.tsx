
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [gamerTagInput, setGamerTagInput] = useState('');
  const [passwordInput, setPasswordInput] = useState(''); // Added password state
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate gamerTagInput and passwordInput
    if (gamerTagInput.trim()) {
      login(gamerTagInput.trim());
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-glow-primary w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl text-primary flex items-center justify-center">
          <LogIn className="mr-2 h-6 w-6 sm:h-7 sm:w-7" /> Enter Wello
        </CardTitle>
        <CardDescription className="text-foreground/80 pt-1">
          Enter your Gamer Tag and Password to continue.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gamerTag" className="text-foreground/90">Gamer Tag</Label>
            <Input
              id="gamerTag"
              type="text"
              placeholder="e.g., ProPlayer123"
              value={gamerTagInput}
              onChange={(e) => setGamerTagInput(e.target.value)}
              required
              className="bg-background border-primary focus:ring-primary text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordLogin" className="text-foreground/90">Password</Label>
            <Input
              id="passwordLogin"
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="bg-background border-primary focus:ring-primary text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <Button type="submit" className="w-full btn-gradient-primary-accent btn-glow-primary text-lg py-3">
            Login
          </Button>
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" legacyBehavior passHref>
              <a className="font-semibold text-primary hover:underline">
                Sign up here
              </a>
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

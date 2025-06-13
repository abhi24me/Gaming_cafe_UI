
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [gamerTagInput, setGamerTagInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [gamerTagError, setGamerTagError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth(); // Using login for signup in this mock setup

  const validateForm = (): boolean => {
    let isValid = true;

    // Gamer Tag Validation
    if (!gamerTagInput.trim()) {
      setGamerTagError('Gamer Tag is required.');
      isValid = false;
    } else if (gamerTagInput.trim().length < 3) {
      setGamerTagError('Gamer Tag must be at least 3 characters.');
      isValid = false;
    } else if (gamerTagInput.trim().length > 20) {
      setGamerTagError('Gamer Tag must be at most 20 characters.');
      isValid = false;
    } else {
      setGamerTagError('');
    }

    // Email Validation
    if (!emailInput.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Phone Number Validation
    if (!phoneInput.trim()) {
      setPhoneError('Phone number is required.');
      isValid = false;
    } else if (!/^\+\d{10,15}$/.test(phoneInput.replace(/\s/g, ''))) { // Allow spaces but validate without them
      setPhoneError('Enter a valid phone number (e.g., +91 XXXXXXXXXX).');
      isValid = false;
    } else {
      setPhoneError('');
    }

    // Password Validation
    if (!passwordInput) { // Don't trim password for validation
      setPasswordError('Password is required.');
      isValid = false;
    } else if (passwordInput.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, you'd send all data (gamerTagInput, emailInput, phoneInput, passwordInput)
      // to the backend to create a new user account.
      // For this mock setup, we'll still just use the gamerTag for the "login" function.
      if (gamerTagInput.trim()) {
        login(gamerTagInput.trim()); // "Signs up" and logs in the user with GamerTag
      }
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-glow-primary w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl text-primary flex items-center justify-center">
          <UserPlus className="mr-2 h-6 w-6 sm:h-7 sm:w-7" /> Create Your Account
        </CardTitle>
        <CardDescription className="text-foreground/80 pt-1">
          Fill in the details below to join Wello. All fields are required.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="gamerTagSignup" className="text-foreground/90">Gamer Tag</Label>
            <Input
              id="gamerTagSignup"
              type="text"
              placeholder="e.g., NewLegend007"
              value={gamerTagInput}
              onChange={(e) => {
                setGamerTagInput(e.target.value);
                if (gamerTagError) validateForm(); // Re-validate on change if there was an error
              }}
              className={`bg-background border-primary focus:ring-primary text-base ${gamerTagError ? 'border-destructive focus:ring-destructive' : 'border-primary'}`}
              aria-describedby="gamerTagError"
              aria-invalid={!!gamerTagError}
            />
            {gamerTagError && <p id="gamerTagError" className="text-xs text-destructive mt-1">{gamerTagError}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="emailSignup" className="text-foreground/90">Email</Label>
            <Input
              id="emailSignup"
              type="email"
              placeholder="you@example.com"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (emailError) validateForm();
              }}
              className={`bg-background text-base ${emailError ? 'border-destructive focus:ring-destructive' : 'border-primary focus:ring-primary'}`}
              aria-describedby="emailError"
              aria-invalid={!!emailError}
            />
            {emailError && <p id="emailError" className="text-xs text-destructive mt-1">{emailError}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phoneSignup" className="text-foreground/90">Phone Number</Label>
            <Input
              id="phoneSignup"
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                if (phoneError) validateForm();
              }}
              className={`bg-background text-base ${phoneError ? 'border-destructive focus:ring-destructive' : 'border-primary focus:ring-primary'}`}
              aria-describedby="phoneError"
              aria-invalid={!!phoneError}
            />
            {phoneError && <p id="phoneError" className="text-xs text-destructive mt-1">{phoneError}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="passwordSignup" className="text-foreground/90">Password</Label>
            <Input
              id="passwordSignup"
              type="password"
              placeholder="Create a strong password (min 8 chars)"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                if (passwordError) validateForm();
              }}
              className={`bg-background text-base ${passwordError ? 'border-destructive focus:ring-destructive' : 'border-primary focus:ring-primary'}`}
              aria-describedby="passwordError"
              aria-invalid={!!passwordError}
            />
            {passwordError && <p id="passwordError" className="text-xs text-destructive mt-1">{passwordError}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 pt-2">
          <Button type="submit" className="w-full btn-gradient-primary-accent btn-glow-primary text-lg py-3">
            Sign Up & Enter
          </Button>
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" legacyBehavior passHref>
              <a className="font-semibold text-primary hover:underline">
                Login here
              </a>
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

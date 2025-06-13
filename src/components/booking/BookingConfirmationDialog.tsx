
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Screen, TimeSlot } from '@/lib/types';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  screen: Screen | null;
  slot: TimeSlot | null;
  date: Date | null;
  onConfirm: (gamerTag: string) => void;
}

export default function BookingConfirmationDialog({
  isOpen,
  onOpenChange,
  screen,
  slot,
  date,
  onConfirm,
}: BookingConfirmationDialogProps) {
  const [gamerTagInput, setGamerTagInput] = useState('');
  const { gamerTag: authGamerTag, isAuthenticated } = useAuth(); // Get auth state

  useEffect(() => {
    if (isOpen && isAuthenticated && authGamerTag) {
      setGamerTagInput(authGamerTag);
    }
    if (!isOpen) { // Reset when dialog closes
        setGamerTagInput('');
    }
  }, [isOpen, isAuthenticated, authGamerTag]);

  if (!isOpen || !screen || !slot || !date) {
    return null;
  }

  const handleConfirm = () => {
    if (gamerTagInput.trim()) {
      onConfirm(gamerTagInput.trim());
      setGamerTagInput(''); 
    } else {
      // Consider using a toast for errors instead of alert
      alert("Please enter your Gamer Tag.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setGamerTagInput(''); // Reset on close
    }}>
      <AlertDialogContent className="bg-background border-glow-accent p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-accent text-xl sm:text-2xl">Confirm Your Session</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground/80 pt-1 sm:pt-2 text-xs sm:text-sm">
            You are about to book:
          </AlertDialogDescription>
          <ul className="list-disc list-inside my-1 sm:my-2 text-foreground text-xs sm:text-sm space-y-1">
            <li><span className="font-semibold">Screen:</span> {screen.name}</li>
            <li><span className="font-semibold">Date:</span> {date.toLocaleDateString()}</li>
            <li><span className="font-semibold">Time:</span> {slot.time}</li>
            {slot.price && <li><span className="font-semibold">Price:</span> ₹{slot.price} (deducted from wallet)</li>}
          </ul>
          <AlertDialogDescription className="text-foreground/80 text-xs sm:text-sm">
            Please enter your Gamer Tag to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-2 sm:py-4">
          <Label htmlFor="gamerTagDialog" className="text-foreground/90 text-xs sm:text-sm">
            Gamer Tag
          </Label>
          <Input
            id="gamerTagDialog" // Changed id to avoid conflict if another input has 'gamerTag'
            value={gamerTagInput}
            onChange={(e) => setGamerTagInput(e.target.value)}
            placeholder="e.g., ProPlayer123"
            className="mt-1 bg-card border-primary focus:ring-primary text-base"
          />
        </div>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="border-muted hover:border-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm} className="btn-gradient-primary-accent text-primary-foreground btn-glow-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto">
              Confirm Booking
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

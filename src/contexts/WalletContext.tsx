
'use client';

import type { WalletState, Transaction, Booking } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { INITIAL_BOOKINGS, INITIAL_TRANSACTIONS, INITIAL_BALANCE_CONTEXT } from '@/lib/mockData';

const WalletContext = createContext<WalletState | undefined>(undefined);

const LOW_BALANCE_THRESHOLD = 200;
const POINTS_PER_BOOKING = 10;

// Calculate initial loyalty points from existing bookings
const calculateInitialLoyaltyPoints = (initialBookings: Booking[]): number => {
  return initialBookings.reduce((totalPoints, booking) => {
    if (booking.status === 'upcoming' || booking.status === 'completed') {
      return totalPoints + POINTS_PER_BOOKING;
    }
    return totalPoints;
  }, 0);
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE_CONTEXT);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => calculateInitialLoyaltyPoints(INITIAL_BOOKINGS));

  const { toast } = useToast();
  const prevBalanceRef = useRef<number>(balance);

  // Effect for low balance notifications
  useEffect(() => {
    if (prevBalanceRef.current !== balance) {
      if (balance < LOW_BALANCE_THRESHOLD && prevBalanceRef.current >= LOW_BALANCE_THRESHOLD) {
        toast({
            title: "Low Wallet Balance",
            description: `Your wallet balance is now ₹${balance.toFixed(2)}. Consider topping up!`,
            variant: "destructive",
            duration: 8000,
        });
      }
    }
    prevBalanceRef.current = balance;
  }, [balance, toast]);

  // Effect for low balance on initial load
   useEffect(() => {
    if (INITIAL_BALANCE_CONTEXT < LOW_BALANCE_THRESHOLD) {
      toast({
        title: "Low Wallet Balance",
        description: `Your wallet balance is ₹${INITIAL_BALANCE_CONTEXT.toFixed(2)}. Consider topping up soon!`,
        variant: "destructive",
        duration: 8000,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const topUp = (amount: number) => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Top-up amount must be positive.",
        variant: "destructive",
      });
      return;
    }
    const newBalance = balance + amount;
    setBalance(newBalance);

    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'top-up',
      amount: amount,
      description: 'Wallet Top-Up',
      date: new Date(),
    };
    setTransactions(prevTxns => [newTransaction, ...prevTxns].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    toast({
      title: "Wallet Top-Up Successful!",
      description: `₹${amount.toFixed(2)} added. Your new balance is ₹${newBalance.toFixed(2)}.`,
      className: "bg-green-600 text-white border-green-700",
    });
  };

  const deduct = (amount: number, description: string) => {
    if (amount <= 0) return true;

    if (balance >= amount) {
      const newBalance = balance - amount;
      setBalance(newBalance);

      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'booking-fee',
        amount: -amount,
        description: description,
        date: new Date(),
      };
      setTransactions(prevTxns => [newTransaction, ...prevTxns].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      return true;
    } else {
      toast({
        title: "Insufficient Funds",
        description: `Your wallet balance (₹${balance.toFixed(2)}) is too low to cover ₹${amount.toFixed(2)}. Please top up.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const addLoyaltyPoints = (points: number) => {
    setLoyaltyPoints(prevPoints => prevPoints + points);
  };

  const addBooking = (newBooking: Booking) => {
    setBookings(prevBookings => [newBooking, ...prevBookings].sort((a,b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()));
    // Award loyalty points for new booking
    addLoyaltyPoints(POINTS_PER_BOOKING);
    // No need to toast here for loyalty points, booking success toast is in HomePage
  };


  const value = { balance, transactions, bookings, loyaltyPoints, topUp, deduct, addBooking, addLoyaltyPoints };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletState {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

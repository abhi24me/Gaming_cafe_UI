
'use client';

import type { Booking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, UserCircle, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingHistoryItemProps {
  booking: Booking;
}

export default function BookingHistoryItem({ booking }: BookingHistoryItemProps) {
  const statusColors = {
    upcoming: 'bg-primary/80 text-primary-foreground border-primary',
    completed: 'bg-green-600/80 text-white border-green-600',
    cancelled: 'bg-destructive/80 text-destructive-foreground border-destructive',
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-glow-primary flex flex-col">
      <CardHeader className="p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg sm:text-xl text-primary">{booking.screenName}</CardTitle>
          <Badge variant="outline" className={cn("capitalize text-xs", statusColors[booking.status])}>
            {booking.status}
          </Badge>
        </div>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 text-foreground/90 p-3 sm:p-4 pt-0 flex-grow">
        <div className="flex items-center text-xs sm:text-sm">
          <CalendarDays className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm">
          <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          <span>{booking.timeSlot}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm">
          <UserCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          <span>Gamer Tag: {booking.gamerTag}</span>
        </div>
        {booking.pricePaid !== undefined && (
           <div className="flex items-center text-xs sm:text-sm">
            <IndianRupee className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            <span>Price Paid: ₹{booking.pricePaid.toFixed(2)}</span>
          </div>
        )}
      </CardContent>
      {/* Rebook button and CardFooter removed */}
    </Card>
  );
}

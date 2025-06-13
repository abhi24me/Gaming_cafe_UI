
'use client';

import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation'; // Removed for rebook feature removal
import BookingConfirmationDialog from '@/components/booking/BookingConfirmationDialog';
import ScreenSelector from '@/components/booking/ScreenSelector';
import DateSelector from '@/components/booking/DateSelector';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import BookingPreview from '@/components/booking/BookingPreview';
import { SCREENS } from '@/lib/mockData';
import type { Screen, TimeSlot, Booking } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@/contexts/WalletContext';

type BookingStep = 'screen' | 'date' | 'time' | 'confirm';

export default function HomePage() {
  // const searchParams = useSearchParams(); // Removed for rebook feature removal

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const [bookingStep, setBookingStep] = useState<BookingStep>('screen');
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const [currentBookingDetails, setCurrentBookingDetails] = useState<{
    screen: Screen | null;
    slot: TimeSlot | null;
    date: Date | null;
  }>({ screen: null, slot: null, date: null });

  const { toast } = useToast();
  const { deduct, addBooking } = useWallet();

  // Effect to handle pre-filling from query parameters for rebooking - REMOVED
  // useEffect(() => {
  //   const screenNameToRebook = searchParams.get('screenName');
  //   const dateToRebookStr = searchParams.get('date');
  //   if (screenNameToRebook) {
  //     // ... rebooking logic removed ...
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams, toast]); 

  const handleScreenSelect = (screen: Screen) => {
    setSelectedScreen(screen);
    setBookingStep('date');
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setBookingStep('time');
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setBookingStep('confirm');
  };
  
  const prepareForBookingConfirmation = () => {
    if (selectedScreen && selectedDate && selectedTimeSlot) {
      setCurrentBookingDetails({
        screen: selectedScreen,
        slot: selectedTimeSlot,
        date: selectedDate,
      });
      setIsConfirmDialogOpen(true);
    } else {
      toast({
        title: "Incomplete Selection",
        description: "Something went wrong with your selection. Please try again.",
        variant: "destructive",
      });
      setBookingStep('screen');
      setSelectedScreen(null);
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
    }
  };
  
  const handleBookingConfirm = (gamerTag: string) => {
    if (currentBookingDetails.screen && currentBookingDetails.slot && currentBookingDetails.date) {
      const slotPrice = currentBookingDetails.slot.price || 0;
      const bookingDescription = `Booking for ${currentBookingDetails.screen.name} on ${currentBookingDetails.date.toLocaleDateString()}`;

      if (!deduct(slotPrice, bookingDescription)) {
        return; 
      }

      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        screenName: currentBookingDetails.screen.name,
        date: currentBookingDetails.date.toLocaleDateString('en-CA'), // YYYY-MM-DD format
        timeSlot: currentBookingDetails.slot.time,
        gamerTag: gamerTag,
        bookedAt: new Date(),
        status: 'upcoming',
        pricePaid: slotPrice,
      };
      addBooking(newBooking); 
      
      setIsConfirmDialogOpen(false);
      
      setBookingStep('screen');
      setSelectedScreen(null);
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
      setCurrentBookingDetails({ screen: null, slot: null, date: null });
      
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Session for ${gamerTag} on ${currentBookingDetails.screen.name} at ${currentBookingDetails.slot.time} is booked. ₹${slotPrice.toFixed(2)} deducted.`,
        className: "bg-green-600 text-white border-green-700",
      });
    }
  };

  const handleBackToScreenSelection = () => {
    setSelectedScreen(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setBookingStep('screen');
  };

  const handleBackToDateSelection = () => {
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setBookingStep('date');
  };

  const handleBackToTimeSelection = () => {
    setSelectedTimeSlot(null);
    setBookingStep('time');
  };

  return (
    <>
      <div className="space-y-8">
          <div className="text-center mb-8 pt-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text mb-2 inline-block">Book Your Gaming Session</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                {bookingStep === 'screen' && "Choose your battle station! Select a screen to begin your legendary gaming session."}
                {bookingStep === 'date' && `Lock in your game day for ${selectedScreen?.name || 'the screen'}.`}
                {bookingStep === 'time' && `Select your prime time slot for ${selectedScreen?.name || 'the screen'} on ${selectedDate?.toLocaleDateString() || 'chosen date'}.`}
                {bookingStep === 'confirm' && "One last check! Make sure everything's perfect before you dive in."}
              </p>
          </div>

          {bookingStep === 'screen' && (
            <ScreenSelector screens={SCREENS} onScreenSelect={handleScreenSelect} />
          )}

          {bookingStep === 'date' && selectedScreen && (
            <DateSelector
              screen={selectedScreen}
              selectedDate={selectedDate}
              onDateChange={handleDateSelect}
              onBack={handleBackToScreenSelection}
            />
          )}

          {bookingStep === 'time' && selectedScreen && selectedDate && (
            <TimeSlotSelector
              screen={selectedScreen}
              date={selectedDate}
              selectedSlotId={selectedTimeSlot?.id || null}
              onSlotSelect={handleTimeSlotSelect}
              onBack={handleBackToDateSelection}
            />
          )}
          
          {bookingStep === 'confirm' && selectedScreen && selectedDate && selectedTimeSlot && (
            <BookingPreview
              screen={selectedScreen}
              date={selectedDate}
              slot={selectedTimeSlot}
              onConfirm={prepareForBookingConfirmation}
              onBack={handleBackToTimeSelection}
            />
          )}
      </div>

      <BookingConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        screen={currentBookingDetails.screen}
        slot={currentBookingDetails.slot}
        date={currentBookingDetails.date}
        onConfirm={handleBookingConfirm}
      />
    </>
  );
}

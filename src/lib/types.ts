
export interface TimeSlot {
  id: string;
  time: string; // e.g., "10:00 AM - 11:00 AM"
  isAvailable: boolean;
  price?: number; // Optional price per slot
}

export interface Screen {
  id: string;
  name: string; // "Screen 1", "Screen 2"
  icon?: React.ElementType; // Lucide icon component
  imagePlaceholderUrl: string; // For placeholder images
  imageAiHint: string; // For AI hint for actual images
}

export interface Booking {
  id: string;
  screenName: string;
  date: string; // Store as 'YYYY-MM-DD' formatted string
  timeSlot: string; // e.g., "10:00 AM - 11:00 AM"
  gamerTag: string;
  bookedAt: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  pricePaid?: number; // Record the price paid for this booking
}

export interface AvailableSlotDay {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface Transaction {
  id: string;
  type: 'top-up' | 'booking-fee' | 'refund';
  amount: number; // Positive for top-up/refund, negative for booking-fee
  description: string;
  date: Date;
}

// Wallet context types
export interface WalletState {
  balance: number;
  transactions: Transaction[];
  bookings: Booking[];
  loyaltyPoints: number; // Added for loyalty program
  topUp: (amount: number) => void;
  deduct: (amount: number, description: string) => boolean; // Returns true if deduction was successful
  addBooking: (newBooking: Booking) => void;
  addLoyaltyPoints: (points: number) => void; // Added for loyalty program
}

// Auth context types
export interface AuthState {
  gamerTag: string | null;
  isAuthenticated: boolean;
  login: (tag: string) => void;
  logout: () => void;
  updateGamerTag: (newTag: string) => void;
}

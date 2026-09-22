export interface AdminBookingListItem {
  id: string;
  bookingNumber: string;
  status: string;
  totalAmount: number;
  adults: number;
  children: number;
  createdAt: string;
  tour: { title: string };
  user: { fullName: string; email: string } | null;
}

export interface AdminBookingPayment {
  id: string;
  method: string;
  amount: number;
  status: string;
  transactionRef: string | null;
  proofUrl: string | null;
  createdAt: string;
}

export interface AdminBookingDetail {
  id: string;
  bookingNumber: string;
  status: string;
  adults: number;
  children: number;
  totalAmount: number;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  holdExpiresAt: string | null;
  createdAt: string;
  tour: { title: string; slug: string };
  availability: { departureDate: string };
  user: { fullName: string; email: string; phone: string | null } | null;
  payments: AdminBookingPayment[];
}
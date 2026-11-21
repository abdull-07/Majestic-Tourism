export interface AccountPayment {
    id: string;
    method: string;
    amount: number;
    status: string;
    transactionRef: string | null;
    createdAt: string;
}

export interface AccountBooking {
    id: string;
    bookingNumber: string;
    status: string;
    adults: number;
    children: number;
    totalAmount: number;
    paidAmount: number;
    holdExpiresAt: string | null;
    createdAt: string;
    tour: {
        id: string;
        title: string;
        slug: string;
        destination: { name: string };
        images: { url: string }[];
    };
    availability: { departureDate: string };
    review: { id: string; status: string } | null;
}

export interface AccountProfile {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
}

export interface AccountBookingDetail extends AccountBooking {
    payments: AccountPayment[];
}
export interface AdminPaymentListItem {
    id: string;
    method: string;
    amount: number;
    status: string;
    transactionRef: string | null;
    createdAt: string;
    booking: { bookingNumber: string; totalAmount: number; guestName: string | null; guestEmail: string | null };
}

export interface AdminPaymentDetail extends AdminPaymentListItem {
    proofUrl: string | null;
    verifiedAt: string | null;
    booking: AdminPaymentListItem['booking'] & { id: string };
}
export interface AdminCoupon {
    id: string;
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minAmount: number | null;
    maxUses: number | null;
    usedCount: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
    createdAt: string;
}

export interface CouponFormValues {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minAmount: number | null;
    maxUses: number | null;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}
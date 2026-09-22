export interface Tour {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    durationDays: number;
    durationNights: number;
    basePrice: number;
    maxGroupSize: number;
    destination: { name: string; slug: string };
    images: { url: string; isCover: boolean }[];
}

export interface TourItineraryDay {
    id: string;
    dayNumber: number;
    title: string;
    description: string;
}

export interface TourAvailabilitySlot {
    id: string;
    departureDate: string;
    totalSeats: number;
    bookedSeats: number;
    status: string;
}

export interface TourReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { fullName: string };
}

export interface TourDetail extends Tour {
    destination: { name: string; slug: string; description: string };
    itinerary: TourItineraryDay[];
    availability: TourAvailabilitySlot[];
    reviews: TourReview[];
    inclusions: string[];
    exclusions: string[];
    childPrice: number | null;
    difficultyLevel: string;
    minGroupSize: number;
}
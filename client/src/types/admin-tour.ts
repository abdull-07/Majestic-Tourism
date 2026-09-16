export interface AdminTourImage {
    id: string;
    url: string;
    isCover: boolean;
    sortOrder: number;
}

export interface AdminTourItineraryDay {
    id: string;
    dayNumber: number;
    title: string;
    description: string;
}

export interface AdminTourAvailability {
    id: string;
    departureDate: string;
    totalSeats: number;
    bookedSeats: number;
    status: string;
}

export interface AdminTour {
    id: string;
    title: string;
    slug: string;
    description: string;
    destinationId: string;
    destination: { name: string };
    category: string;
    difficultyLevel: string;
    durationDays: number;
    durationNights: number;
    minGroupSize: number;
    maxGroupSize: number;
    basePrice: number;
    childPrice: number | null;
    inclusions: string[];
    exclusions: string[];
    isFeatured: boolean;
    isActive: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    images: AdminTourImage[];
    itinerary: AdminTourItineraryDay[];
    availability: AdminTourAvailability[];
    _count?: { bookings: number };
}

export interface TourFormValues {
    title: string;
    description: string;
    destinationId: string;
    category: string;
    difficultyLevel: string;
    durationDays: number;
    durationNights: number;
    minGroupSize: number;
    maxGroupSize: number;
    basePrice: number;
    childPrice: number | null;
    inclusions: string[];
    exclusions: string[];
    isFeatured: boolean;
    isActive: boolean;
}
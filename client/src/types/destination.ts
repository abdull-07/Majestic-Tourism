export interface Destination {
    id: string;
    name: string;
    slug: string;
    description: string;
    coverImage: string | null;
    bestTimeToVisit: string | null;
    _count?: { tours: number };
}

export interface DestinationTourSummary {
    id: string;
    title: string;
    slug: string;
    basePrice: number;
    durationDays: number;
}

export interface DestinationDetail extends Destination {
    tours: DestinationTourSummary[];
}
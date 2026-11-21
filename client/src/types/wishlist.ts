export interface WishlistItem {
  id: string;
  tourId: string;
  createdAt: string;
  tour: {
    id: string;
    title: string;
    slug: string;
    basePrice: number | string;
    durationDays: number;
    destination: { name: string };
    images: { url: string }[];
  };
}
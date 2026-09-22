export interface AdminReview {
    id: string;
    rating: number;
    comment: string;
    images: string[];
    status: string;
    createdAt: string;
    user: { fullName: string; email: string };
    tour: { title: string };
}
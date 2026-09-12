import { Star } from 'lucide-react';
import type { TourReview } from '../../../types/tour';

export default function ReviewsList({ reviews }: { reviews: TourReview[] }) {
  if (reviews.length === 0) {
    return <p className="text-text-muted">No reviews yet for this tour.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="card p-6">
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < review.rating ? 'fill-tertiary text-tertiary' : 'text-mountain-mist'} />
            ))}
          </div>
          <p className="text-text-muted text-body-sm mb-3">{review.comment}</p>
          <p className="font-semibold text-primary text-body-sm">{review.user.fullName}</p>
        </div>
      ))}
    </div>
  );
}
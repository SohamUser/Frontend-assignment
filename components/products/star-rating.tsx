import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

/** Ratings are clamped to 0–5 and displayed to the nearest half star. */
export function StarRating({ rating }: StarRatingProps) {
  const value = Number.isFinite(rating)
    ? Math.round(Math.min(5, Math.max(0, rating)) * 2) / 2
    : 0;

  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of 5 stars`}
      className="inline-flex gap-0.5 text-accent"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, value - index));

        return (
          <span key={index} aria-hidden="true" className="relative block size-4">
            <Star className="size-4" strokeWidth={1.5} />
            {fill > 0 ? (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="size-4 fill-current" strokeWidth={1.5} />
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

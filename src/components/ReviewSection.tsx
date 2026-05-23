import { useState, useEffect } from "react";
import { api } from "../api/api";
import { getToken } from "../utils/token";

interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface ReviewData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`text-xl transition-colors ${interactive ? "cursor-pointer" : "cursor-default"} bg-transparent border-none p-0`}
          style={{ color: star <= (hovered || rating) ? "#f59e0b" : "#374151" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: number }) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isLoggedIn = !!getToken();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/product/${productId}`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const submitReview = async () => {
    if (rating === 0) { setError("Please select a rating!"); return; }
    if (!comment.trim()) { setError("Please write a comment!"); return; }
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/reviews/product/${productId}`, { rating, comment });
      setRating(0);
      setComment("");
      loadReviews();
    } catch (err: any) {
      setError(err.response?.data || "Something went wrong!");
    }
    setSubmitting(false);
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      loadReviews();
    } catch (err) { console.log(err); }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-lg">⭐</span>
        <h3 className="text-base font-semibold text-white">Reviews & Ratings</h3>
        {data && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
            {data.totalReviews} reviews
          </span>
        )}
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {data && data.totalReviews > 0 && (
        <div className="flex items-center gap-4 mb-6 bg-[#111] border border-white/10 rounded-xl p-4">
          <div className="text-5xl font-bold text-white">{data.averageRating}</div>
          <div>
            <Stars rating={Math.round(data.averageRating)} />
            <p className="text-xs text-gray-500 mt-1">{data.totalReviews} reviews</p>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="bg-[#111] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-sm font-medium text-white mb-3">Write a Review</p>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Your Rating</p>
            <Stars rating={rating} interactive onRate={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 resize-none"
          />
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          <button
            onClick={submitReview}
            disabled={submitting}
            className="mt-3 py-2 px-5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}

      {!loading && data && data.reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No reviews yet — be the first to review!
        </div>
      )}

      {!loading && data && data.reviews.map((review) => (
        <div key={review.id} className="bg-[#111] border border-white/10 rounded-xl p-4 mb-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-white">{review.userName}</p>
              <Stars rating={review.rating} />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => deleteReview(review.id)}
                className="text-xs text-red-400/50 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                🗑
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
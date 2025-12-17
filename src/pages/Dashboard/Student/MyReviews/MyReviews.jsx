import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import useAuth from "../../../../hooks/useAuth";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

const MyReviews = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState(null);
  const [editData, setEditData] = useState({ rating: 5, comment: "" });

  const {
    data: reviews = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["my-reviews", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/my-reviews?email=${user?.email}`);
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this review?");
    if (!confirm) return;

    try {
      await axiosPublic.delete(`/reviews/${id}`);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setEditData({
      rating: Number(review.ratingPoint) || 5,
      comment: review.reviewComment || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      await axiosPublic.patch(`/reviews/${editingReview._id}`, {
        ratingPoint: Number(editData.rating),
        reviewComment: editData.comment,
      });

      setEditingReview(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  // ⭐ Star Rating UI
  const StarRating = ({ value, onChange }) => {
    const v = Number(value) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            className="p-1 rounded-md hover:bg-slate-100 transition"
            aria-label={`Rate ${n} star`}
            title={`${n} star`}
          >
            <span className={`text-lg ${n <= v ? "text-amber-500" : "text-slate-300"}`}>
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-xs font-semibold text-slate-600">
          {v}/5
        </span>
      </div>
    );
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-secondary">My Reviews</h1>
        <p className="text-xs text-slate-500">Total reviews: {reviews.length}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Scholarship</th>
              <th className="px-3 py-2 text-left">University</th>
              <th className="px-3 py-2 text-left">Rating</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Comment</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-3 py-6 text-center text-xs text-slate-500"
                >
                  You haven't written any reviews yet.
                </td>
              </tr>
            )}

            {reviews.map((review) => (
              <tr
                key={review._id}
                className="border-t border-slate-100 hover:bg-slate-50/60"
              >
                <td className="px-3 py-3 align-top text-xs text-secondary font-medium">
                  {review.scholarshipName || "N/A"}
                </td>

                <td className="px-3 py-3 align-top text-xs text-slate-700">
                  {review.universityName}
                </td>

                <td className="px-3 py-3 align-top text-xs text-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="font-semibold">{review.ratingPoint}</span>
                    <span className="text-slate-400">/5</span>
                  </div>
                </td>

                <td className="px-3 py-3 align-top text-[11px] text-slate-600">
                  {formatDate(review.reviewDate)}
                </td>

                <td className="px-3 py-3 align-top text-xs text-slate-700 max-w-xs">
                  {review.reviewComment}
                </td>

                <td className="px-3 py-3 align-top text-right">
                  <div className="flex justify-end gap-1 flex-wrap">
                    <button
                      onClick={() => openEditModal(review)}
                      className="btn btn-secondary btn-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="btn btn-danger btn-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-lg space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-sm font-semibold text-secondary">
                Edit Review – {editingReview.universityName}
              </h2>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="btn btn-ghost btn-xs"
              >
                ✕
              </button>
            </div>

            {/* ⭐ Star Rating */}
            <div className="space-y-1">
              <label className="block text-xs text-slate-600 font-medium">
                Rating
              </label>
              <StarRating
                value={editData.rating}
                onChange={(n) => setEditData({ ...editData, rating: n })}
              />
            </div>

            {/* ✍️ Modern Textarea */}
            <div className="space-y-1">
              <label className="block text-xs text-slate-600 font-medium">
                Your Comment
              </label>
              <textarea
                value={editData.comment}
                onChange={(e) =>
                  setEditData({ ...editData, comment: e.target.value })
                }
                placeholder="Write your feedback..."
                className="w-full min-h-[110px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition"
                required
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Be specific & helpful.</span>
                <span>{editData.comment?.length || 0} chars</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="btn btn-secondary btn-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-xs">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default MyReviews;

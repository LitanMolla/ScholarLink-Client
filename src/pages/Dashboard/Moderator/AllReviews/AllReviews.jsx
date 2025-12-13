import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa";

const AllReviews = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: reviews = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews");
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosPublic.delete(`/reviews/${id}`);

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete review",
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <FaStar
            key={n}
            className={`text-[12px] ${
              n <= rating ? "text-yellow-400" : "text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-secondary">All Reviews</h1>
        <p className="text-xs text-slate-500">
          Total reviews: {reviews.length}
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Reviewer</th>
                <th className="px-3 py-2 text-left">University</th>
                <th className="px-3 py-2 text-left">Scholarship</th>
                <th className="px-3 py-2 text-left">Rating</th>
                <th className="px-3 py-2 text-left">Review</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3">
                    <p className="font-medium text-secondary text-xs">
                      {review.userName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {review.userEmail}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {review.universityName}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {review.scholarshipName}
                  </td>

                  <td className="px-3 py-3">{renderStars(review.ratingPoint)}</td>

                  <td className="px-3 py-3 text-xs text-slate-700 max-w-xs">
                    {review.reviewComment}
                  </td>

                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="btn btn-danger btn-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {reviews.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-xl border border-black/10 bg-white p-4 space-y-2 shadow-sm"
          >
            <div>
              <p className="text-xs font-semibold text-secondary">
                {review.userName}
              </p>
              <p className="text-[11px] text-slate-500">
                {review.userEmail}
              </p>
            </div>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">University:</span>{" "}
              {review.universityName}
            </p>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Scholarship:</span>{" "}
              {review.scholarshipName}
            </p>

            {renderStars(review.ratingPoint)}

            <p className="text-xs text-slate-700">
              {review.reviewComment}
            </p>

            <button
              onClick={() => handleDelete(review._id)}
              className="btn btn-danger btn-xs w-full"
            >
              Delete Review
            </button>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl py-6 bg-white">
            No reviews found.
          </p>
        )}
      </div>
    </section>
  );
};

export default AllReviews;

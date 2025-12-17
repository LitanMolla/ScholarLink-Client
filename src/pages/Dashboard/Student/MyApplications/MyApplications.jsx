import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import useAuth from "../../../../hooks/useAuth";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";

const MyApplications = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  // ✅ Applications
  const {
    data: applications = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["my-applications", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/applications?email=${user?.email}`);
      return res.data.data;
    },
  });

  // ✅ My Reviews (to block duplicate review on UI)
  const {
    data: myReviews = [],
    isPending: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["my-reviews", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/my-reviews?email=${user?.email}`);
      return res.data.data || [];
    },
  });

  if (isPending || reviewsLoading) return <LoadingSpinner />;

  // ✅ helper: already reviewed?
  const hasReviewed = (scholarshipId) =>
    myReviews?.some((r) => r.scholarshipId === scholarshipId);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this application delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosPublic.delete(`/applications/${id}`);

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your application has been deleted.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: res.data?.message || "Delete failed.",
        });
      }

      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  const handlePay = async (application) => {
    try {
      const res = await axiosPublic.post("/create-checkout-session", {
        scholarshipId: application.scholarshipId,
        userEmail: user?.email,
        userName: user?.displayName,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Payment error",
        text: error.message || "Could not start payment.",
      });
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setShowDetails(true);
  };

  const openReviewModal = (app) => {
    if (hasReviewed(app.scholarshipId)) {
      return Swal.fire({
        icon: "info",
        title: "Already reviewed",
        text: "You already submitted a review for this scholarship.",
      });
    }

    setSelectedApp(app);
    setReviewData({ rating: 5, comment: "" });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (hasReviewed(selectedApp.scholarshipId)) {
      setShowReviewModal(false);
      return Swal.fire({
        icon: "info",
        title: "Already reviewed",
        text: "You already submitted a review for this scholarship.",
      });
    }

    try {
      const res = await axiosPublic.post("/reviews", {
        scholarshipId: selectedApp.scholarshipId,
        universityName: selectedApp.universityName,
        scholarshipName: selectedApp.scholarshipName,
        userName: user?.displayName,
        userEmail: user?.email,
        userImage: user?.photoURL,
        ratingPoint: reviewData.rating,
        reviewComment: reviewData.comment,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Review added",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setShowReviewModal(false);
      await refetchReviews();
    } catch (error) {
      console.error(error);

      const msg =
        error?.response?.status === 409
          ? "You already reviewed this scholarship."
          : error.message || "Could not submit review.";

      Swal.fire({
        icon: error?.response?.status === 409 ? "info" : "error",
        title: error?.response?.status === 409 ? "Already reviewed" : "Error",
        text: msg,
      });

      setShowReviewModal(false);
      await refetchReviews();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  // ✅ updated: added "processing"
  const statusBadgeClass = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-600";
    if (status === "processing") return "bg-blue-50 text-blue-600";
    if (status === "completed") return "bg-emerald-50 text-emerald-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-slate-50 text-slate-600";
  };

  const paymentBadgeClass = (status) => {
    if (status === "paid") return "bg-emerald-50 text-emerald-600";
    return "bg-red-50 text-red-600";
  };

  return (
    <section className="py-6 capitalize">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-secondary">My Applications</h1>
        <p className="text-xs text-slate-500">
          Total applications: {applications.length}
        </p>
      </div>

      {/* 🔹 Mobile (md-) */}
      <div className="grid gap-3 md:hidden">
        {applications.length === 0 && (
          <p className="text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl py-6 bg-white">
            You have not applied to any scholarships yet.
          </p>
        )}

        {applications.map((app) => (
          <div
            key={app._id}
            className="rounded-xl border border-black/10 bg-white p-3 shadow-sm space-y-2"
          >
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-secondary">
                  {app.universityName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {app.scholarshipCategory} · {app.degree}
                </p>
              </div>

              <span
                className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${statusBadgeClass(
                  app.applicationStatus
                )}`}
              >
                {app.applicationStatus}
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Subject:</span> {app.subjectCategory}
            </p>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Fees:</span> $
              {app.applicationFees || 0} (application) + ${app.serviceCharge || 0}{" "}
              (service)
            </p>

            <div className="flex items-center justify-between">
              <span
                className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${paymentBadgeClass(
                  app.paymentStatus
                )}`}
              >
                {app.paymentStatus}
              </span>
              <span className="text-[10px] text-slate-500">
                {formatDate(app.applicationDate)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              <button
                onClick={() => openDetails(app)}
                className="btn btn-secondary btn-xs"
              >
                Details
              </button>

              {/* ✅ Pay/Delete only when PENDING */}
              {app.applicationStatus === "pending" && (
                <>
                  {app.paymentStatus === "unpaid" && (
                    <button
                      onClick={() => handlePay(app)}
                      className="btn btn-primary btn-xs"
                    >
                      Pay
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(app._id)}
                    className="btn btn-danger btn-xs"
                  >
                    Delete
                  </button>
                </>
              )}

              {/* ✅ Review only when COMPLETED */}
              {app.applicationStatus === "completed" &&
                !hasReviewed(app.scholarshipId) && (
                  <button
                    onClick={() => openReviewModal(app)}
                    className="btn btn-primary btn-xs"
                  >
                    Add Review
                  </button>
                )}

              {app.applicationStatus === "completed" &&
                hasReviewed(app.scholarshipId) && (
                  <button className="btn btn-success btn-xs bg-blue-500" disabled>
                    Reviewed
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Desktop (md+) */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">University</th>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Fees</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Payment</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    You have not applied to any scholarships yet.
                  </td>
                </tr>
              )}

              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3 align-top">
                    <p className="font-medium text-secondary text-xs sm:text-sm">
                      {app.universityName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {app.scholarshipCategory} · {app.degree}
                    </p>
                  </td>

                  <td className="px-3 py-3 align-top text-xs text-slate-700">
                    {app.subjectCategory}
                  </td>

                  <td className="px-3 py-3 align-top text-xs text-slate-700">
                    <p>
                      Application:{" "}
                      <span className="font-semibold">
                        ${app.applicationFees || 0}
                      </span>
                    </p>
                    <p>
                      Service:{" "}
                      <span className="font-semibold">
                        ${app.serviceCharge || 0}
                      </span>
                    </p>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${statusBadgeClass(
                        app.applicationStatus
                      )}`}
                    >
                      {app.applicationStatus}
                    </span>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${paymentBadgeClass(
                        app.paymentStatus
                      )}`}
                    >
                      {app.paymentStatus}
                    </span>
                  </td>

                  <td className="px-3 py-3 align-top text-[11px] text-slate-600">
                    {formatDate(app.applicationDate)}
                  </td>

                  <td className="px-3 py-3 align-top text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      <button
                        onClick={() => openDetails(app)}
                        className="btn btn-secondary btn-xs"
                      >
                        Details
                      </button>

                      {/* ✅ Pay/Delete only when PENDING */}
                      {app.applicationStatus === "pending" && (
                        <>
                          {app.paymentStatus === "unpaid" && (
                            <button
                              onClick={() => handlePay(app)}
                              className="btn btn-primary btn-xs"
                            >
                              Pay
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(app._id)}
                            className="btn btn-danger btn-xs"
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {/* ✅ Review only when COMPLETED */}
                      {app.applicationStatus === "completed" &&
                        !hasReviewed(app.scholarshipId) && (
                          <button
                            onClick={() => openReviewModal(app)}
                            className="btn btn-primary btn-xs"
                          >
                            Add Review
                          </button>
                        )}

                      {app.applicationStatus === "completed" &&
                        hasReviewed(app.scholarshipId) && (
                          <button className="btn btn-success btn-xs bg-blue-500 text-slate-100 disabled:cursor-not-allowed!" disabled>
                            Reviewed
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-secondary mb-3">
              Application Details
            </h2>

            <div className="space-y-1 text-xs text-slate-700">
              <p>
                <span className="font-medium">University:</span>{" "}
                {selectedApp.universityName}
              </p>
              <p>
                <span className="font-medium">Subject:</span>{" "}
                {selectedApp.subjectCategory}
              </p>
              <p>
                <span className="font-medium">Degree:</span> {selectedApp.degree}
              </p>
              <p>
                <span className="font-medium">Fees:</span> $
                {selectedApp.applicationFees || 0} (application) + $
                {selectedApp.serviceCharge || 0} (service)
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedApp.applicationStatus}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {selectedApp.paymentStatus}
              </p>

              {selectedApp.feedback && (
                <p>
                  <span className="font-medium">Feedback:</span>{" "}
                  {selectedApp.feedback}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="btn btn-secondary btn-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showReviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-lg space-y-3"
          >
            <h2 className="text-sm font-semibold text-secondary">
              Add Review – {selectedApp.universityName}
            </h2>

            <div className="space-y-1 text-xs">
              <label className="block text-slate-600">Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={reviewData.rating}
                onChange={(e) =>
                  setReviewData({ ...reviewData, rating: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-slate-600">Your Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                className="textarea textarea-bordered w-full min-h-[90px]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="btn btn-secondary btn-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-xs">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default MyApplications;

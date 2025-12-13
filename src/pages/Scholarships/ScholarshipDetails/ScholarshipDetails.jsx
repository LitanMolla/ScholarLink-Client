import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { FiArrowLeft, FiMapPin, FiDollarSign, FiAward } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";

const ScholarshipDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ 1) scholarship query
  const scholarshipQuery = useQuery({
    queryKey: ["scholarship", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get(`/scholarships/${id}`);
      return res.data.data;
    },
  });

  // ✅ 2) reviews query
  const reviewsQuery = useQuery({
    queryKey: ["reviews", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get(`/reviews?scholarshipId=${id}`);
      return res.data.data || [];
    },
  });

  const scholarship = scholarshipQuery.data || {};
  const reviews = reviewsQuery.data || [];

  // ✅ fees fallback
  const applicationFees = Number(
    scholarship.applicationFees ?? scholarship.application_fees ?? 0
  );
  const serviceCharge = Number(
    scholarship.serviceCharge ?? scholarship.service_charge ?? 0
  );

  // ✅ stats (always called)
  const stats = useMemo(() => {
    const total = reviews.length;

    // only valid ratings (1-5) count
    const validRatings = reviews
      .map((r) => Number(r.ratingPoint))
      .filter((p) => p >= 1 && p <= 5);

    const sum = validRatings.reduce((acc, p) => acc + p, 0);
    const avg = validRatings.length ? sum / validRatings.length : 0;

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    validRatings.forEach((p) => {
      breakdown[p] = (breakdown[p] || 0) + 1;
    });

    return { total, avg, breakdown };
  }, [reviews]);

  // ✅ loading / error (after hooks)
  const loading = scholarshipQuery.isPending || reviewsQuery.isPending;
  if (loading) return <LoadingSpinner />;

  if (scholarshipQuery.isError) {
    return (
      <div className="container py-10 text-sm text-red-600">
        Failed to load scholarship details.
      </div>
    );
  }

  if (reviewsQuery.isError) {
    return (
      <div className="container py-10 text-sm text-red-600">
        Failed to load reviews.
      </div>
    );
  }

  const renderStars = (count) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          className={`text-[11px] ${
            n <= count ? "text-yellow-400" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );

  const handleApply = () => {
    if (!user) {
      return navigate("/login", {
        state: { from: `/scholarships-details/${id}` },
      });
    }
    navigate(`/checkout/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <section className="py-10 lg:py-14">
      <div className="container max-w-4xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 hover:text-primary duration-300"
        >
          <FiArrowLeft className="text-sm" />
          Back
        </button>

        {/* Main card */}
        <div className="mt-5 rounded-2xl border border-black/10 bg-white shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-black/10 shrink-0">
                <img
                  src={scholarship.image || "https://i.ibb.co/2d0tYkQ/placeholder.png"}
                  alt={scholarship.scholarship_name || "Scholarship"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                  {scholarship.scholarship_category || "N/A"}
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-secondary leading-snug">
                  {scholarship.scholarship_name || "Scholarship"}
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  {scholarship.university_name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Location
                </p>
                <p className="flex items-center gap-1.5 text-slate-800">
                  <FiMapPin className="text-primary text-sm" />
                  {scholarship.city || "N/A"}, {scholarship.country || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Degree
                </p>
                <p className="text-slate-800">{scholarship.degree || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Subject Category
                </p>
                <p className="text-slate-800">
                  {scholarship.subject_category || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  World Rank
                </p>
                <p className="flex items-center gap-1.5 text-slate-800">
                  <FiAward className="text-primary text-sm" />
                  #{scholarship.world_rank ?? "N/A"}
                </p>
              </div>

              {applicationFees > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Application Fees
                  </p>
                  <p className="text-slate-800">${applicationFees}</p>
                </div>
              )}

              {serviceCharge > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Service Charge
                  </p>
                  <p className="text-slate-800">${serviceCharge}</p>
                </div>
              )}
            </div>

            {/* Tuition Fees */}
            <div className="flex items-center justify-between rounded-lg border border-dashed border-black/15 px-3 py-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-slate-600">
                <FiDollarSign className="text-primary text-sm" />
                Estimated tuition fees
              </span>
              <span className="font-semibold text-secondary">
                ${scholarship.tuition_fees ?? 0}
              </span>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500 max-w-xs">
              Make sure your eligibility matches before applying.
            </p>

            <button
              onClick={handleApply}
              className="btn btn-primary text-sm w-full sm:w-auto"
            >
              Apply for Scholarship
            </button>
          </div>
        </div>

        {/* Reviews + Statistics */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-secondary">
                Student Reviews
              </h2>
              <p className="text-[11px] text-slate-500">
                {stats.total} review{stats.total !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-[11px] text-slate-500">Average</p>
              <p className="text-lg font-semibold text-secondary leading-none">
                {stats.avg.toFixed(1)}
              </p>
              <div className="mt-1 flex justify-end">
                {renderStars(Math.round(stats.avg))}
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-3">
            {reviews.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-xs text-slate-500">
                No reviews yet for this scholarship.
              </div>
            )}

            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-xl border border-black/10 bg-white px-4 py-3.5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold overflow-hidden">
                    {review.userImage ? (
                      <img
                        src={review.userImage}
                        alt={review.userName || "User"}
                        className="h-full w-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      (review.userName || "U").charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">
                          {review.userName || "Anonymous"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {formatDate(review.reviewDate)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {renderStars(Number(review.ratingPoint || 0))}
                        <span className="text-[10px] text-slate-400">
                          {Number(review.ratingPoint || 0)}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                      {review.reviewComment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipDetails;

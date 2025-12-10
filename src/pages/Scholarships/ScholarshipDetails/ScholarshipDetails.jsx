import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  FiArrowLeft,
  FiMapPin,
  FiDollarSign,
  FiAward,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import demoReviews from "../../../utils/demoReviews";
import useAuth from "../../../hooks/useAuth";

const ScholarshipDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: scholarship = {}, isPending } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/scholarships/${id}`);
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  // 🔥 MAIN FIX — DB er real field + camelCase fallback
  const applicationFees = Number(
    scholarship.applicationFees ?? scholarship.application_fees ?? 0
  );

  const serviceCharge = Number(
    scholarship.serviceCharge ?? scholarship.service_charge ?? 0
  );

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
                  src={scholarship.image}
                  alt={scholarship.scholarship_name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                  {scholarship.scholarship_category}
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-secondary leading-snug">
                  {scholarship.scholarship_name}
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  {scholarship.university_name}
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
                  {scholarship.city}, {scholarship.country}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Degree
                </p>
                <p className="text-slate-800">{scholarship.degree}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Subject Category
                </p>
                <p className="text-slate-800">{scholarship.subject_category}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  World Rank
                </p>
                <p className="flex items-center gap-1.5 text-slate-800">
                  <FiAward className="text-primary text-sm" />
                  #{scholarship.world_rank}
                </p>
              </div>

              {/* Deadline */}
              {scholarship.deadline && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Deadline</p>
                  <p className="text-slate-800">{scholarship.deadline}</p>
                </div>
              )}

              {/* ✅ Application Fees */}
              {applicationFees > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Application Fees
                  </p>
                  <p className="text-slate-800">${applicationFees}</p>
                </div>
              )}

              {/* ✅ Service Charge */}
              {serviceCharge > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Service Charge
                  </p>
                  <p className="text-slate-800">${serviceCharge}</p>
                </div>
              )}

              {/* Coverage */}
              {scholarship.coverage && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Stipend / Coverage
                  </p>
                  <p className="text-slate-800">{scholarship.coverage}</p>
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
                ${scholarship.tuition_fees}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h2 className="text-sm font-semibold text-secondary">
              About this scholarship
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              This program supports outstanding students for advanced studies at{" "}
              {scholarship.university_name}.
            </p>
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

        {/* Reviews */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-secondary">
              Student Reviews
            </h2>
            <p className="text-[11px] text-slate-500">
              {demoReviews.length} reviews (demo)
            </p>
          </div>

          {demoReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-black/10 bg-white px-4 py-3.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {review.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary">{review.name}</p>
                      <p className="text-[11px] text-slate-500">{review.degree}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 mt-2">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ScholarshipDetails;

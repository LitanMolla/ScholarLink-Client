import React from "react";
import { Link, useParams } from "react-router";
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

const ScholarshipDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();

  const {
    data: scholarship = {},
    isPending,
  } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/scholarships/${id}`);
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  const demoReviews = [
    {
      id: 1,
      name: "Ayesha Rahman",
      degree: "Masters in Computer Science",
      rating: 5,
      comment:
        "The scholarship not only covered my tuition but also gave me great networking opportunities and mentorship.",
      date: "Jan 10, 2025",
    },
    {
      id: 2,
      name: "Tanvir Ahmed",
      degree: "PhD in Data Science",
      rating: 4,
      comment:
        "The application process was competitive but well structured. ScholarLink helped me understand the requirements clearly.",
      date: "Dec 22, 2024",
    },
    {
      id: 3,
      name: "Sara Islam",
      degree: "Masters in Electrical Engineering",
      rating: 5,
      comment:
        "Amazing support and global exposure. Highly recommended for students who want a challenging but rewarding experience.",
      date: "Nov 05, 2024",
    },
  ];

  const renderStars = (count) => {
    return (
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
          {/* Header with small rounded logo */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Small rounded logo-style image */}
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

          {/* Summary info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Location
                </p>
                <p className="flex items-center gap-1.5 text-slate-800">
                  <FiMapPin className="text-primary text-sm" />
                  <span>
                    {scholarship.city}, {scholarship.country}
                  </span>
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
                  <span>#{scholarship.world_rank}</span>
                </p>
              </div>

              {/* Optional: Deadline */}
              {scholarship.deadline && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Deadline
                  </p>
                  <p className="text-slate-800">{scholarship.deadline}</p>
                </div>
              )}

              {/* Optional: Application Fees */}
              {scholarship.applicationFees && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Application Fees
                  </p>
                  <p className="text-slate-800">
                    ${scholarship.applicationFees}
                  </p>
                </div>
              )}

              {/* Optional: Coverage / Stipend */}
              {scholarship.coverage && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Stipend / Coverage
                  </p>
                  <p className="text-slate-800">{scholarship.coverage}</p>
                </div>
              )}
            </div>

            {/* Tuition fees box */}
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
              {scholarship.university_name}. It aims to develop future leaders
              with strong academic background and multidisciplinary skills.
              Applicants are encouraged to review all requirements carefully
              before applying.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500 max-w-xs">
              Make sure your documents and eligibility match the scholarship
              requirements before starting your application.
            </p>
            <Link
              to={`/checkout/${scholarship._id}`}
              className="btn btn-primary text-sm w-full sm:w-auto text-center duration-300"
            >
              Apply for Scholarship
            </Link>
          </div>
        </div>

        {/* 🔹 Reviews Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-secondary">
              Student Reviews
            </h2>
            <p className="text-[11px] text-slate-500">
              {demoReviews.length} reviews (demo)
            </p>
          </div>

          <div className="space-y-3">
            {demoReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-black/10 bg-white px-4 py-3.5 sm:px-5 sm:py-4 shadow-[0_4px_10px_rgba(15,23,42,0.02)]"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {review.name.charAt(0)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div>
                        <p className="text-sm font-medium text-secondary">
                          {review.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {review.degree}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        {renderStars(review.rating)}
                        <span className="text-[10px] text-slate-400">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">
            * These are sample reviews for design purposes. Later this section
            will be connected with real data from the server.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipDetails;

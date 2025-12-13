// src/pages/Payment/PaymentSuccess/PaymentSuccess.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [saving, setSaving] = useState(true);
  const [scholarship, setScholarship] = useState(null);
  const [loadingScholarship, setLoadingScholarship] = useState(true);

  const savedOnceRef = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const scholarshipId = searchParams.get("scholarshipId");
  const amount = searchParams.get("amount");

  // 🔹 fetch scholarship details
  useEffect(() => {
    let mounted = true;

    const loadScholarship = async () => {
      if (!scholarshipId) {
        setLoadingScholarship(false);
        return;
      }

      try {
        setLoadingScholarship(true);
        const res = await axiosPublic.get(`/scholarships/${scholarshipId}`);
        if (mounted) setScholarship(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingScholarship(false);
      }
    };

    loadScholarship();
    return () => {
      mounted = false;
    };
  }, [axiosPublic, scholarshipId]);

  // 🔹 save application (only once)
  useEffect(() => {
    const saveApplication = async () => {
      if (savedOnceRef.current) return;
      if (!scholarshipId || !user?.email) {
        setSaving(false);
        return;
      }

      savedOnceRef.current = true;

      try {
        setSaving(true);
        await axiosPublic.post("/applications", {
          scholarshipId,
          userEmail: user.email,
          userName: user.displayName || "Anonymous",
          paymentStatus: "paid",
          paidAmount: Number(amount) || 0,
          paidAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    };

    saveApplication();
  }, [axiosPublic, scholarshipId, user?.email, user?.displayName, amount]);

  const totalFees =
    (scholarship?.applicationFees || 0) + (scholarship?.serviceCharge || 0);

  return (
    <section className="py-10 lg:py-16">
      <div className="container max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Top banner */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-400 px-6 sm:px-8 py-7 sm:py-9">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  ✅ Payment Completed
                </div>
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
                  Payment Successful 🎉
                </h1>
                <p className="mt-1 text-sm text-white/90">
                  Your payment is successful. We’re saving your application now.
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 border border-white/20 px-4 py-3 text-white">
                <p className="text-xs text-white/85">Amount Paid</p>
                <p className="text-2xl font-extrabold">${amount || "0"}</p>
              </div>
            </div>

            {/* soft glow */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            {/* Scholarship Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              {loadingScholarship ? (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-56 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-72 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ) : scholarship ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Round Logo */}
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-emerald-200 bg-white shadow-md flex items-center justify-center">
                      <img
                        src={scholarship.image}
                        alt={scholarship.scholarship_name}
                        className="h-14 w-14 sm:h-16 sm:w-16 object-contain rounded-full"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Title + Meta */}
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {scholarship.scholarship_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {scholarship.university_name} • {scholarship.city},{" "}
                      {scholarship.country}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border">
                        🎓 {scholarship.degree}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border">
                        🧭 {scholarship.subject_category}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border">
                        🏅 {scholarship.scholarship_category}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border">
                        🌍 Rank #{scholarship.world_rank}
                      </span>
                    </div>
                  </div>

                  {/* Deadline pill */}
                  <div className="sm:text-right">
                    <p className="text-xs text-slate-500">Deadline</p>
                    <p className="text-sm font-bold text-slate-900">
                      {scholarship.applicationDeadline}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">Posted</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {scholarship.scholarshipPostDate}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  Scholarship details not found.
                </div>
              )}
            </div>

            {/* Payment Breakdown */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-xs text-slate-500">Tuition Fees</p>
                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  ${scholarship?.tuition_fees ?? "--"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-4">
                <p className="text-xs text-slate-500">Application + Service</p>
                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  ${Number.isFinite(totalFees) ? totalFees : "--"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  App: ${scholarship?.applicationFees ?? "--"} • Service: $
                  {scholarship?.serviceCharge ?? "--"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-4">
                <p className="text-xs text-slate-500">Your Payment</p>
                <p className="mt-1 text-lg font-extrabold text-emerald-700">
                  ${amount || "0"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {saving ? "Saving application..." : "Application saved ✅"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => navigate("/")}
                className="btn btn-secondary"
                type="button"
              >
                Back to Home
              </button>

              <button
                onClick={() => navigate("/dashboard/my-applications")}
                className="btn btn-primary"
                disabled={saving}
                type="button"
              >
                Go to My Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;

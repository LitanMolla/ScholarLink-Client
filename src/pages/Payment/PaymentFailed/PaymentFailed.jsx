// src/pages/Payment/PaymentFailed/PaymentFailed.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [saving, setSaving] = useState(true);
  const [scholarship, setScholarship] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const scholarshipId = searchParams.get("scholarshipId");
  const amount = searchParams.get("amount");
  const error = searchParams.get("error"); // optional error from Stripe / backend

  // 🔹 Load scholarship info
  useEffect(() => {
    if (!scholarshipId) return;

    axiosPublic
      .get(`/scholarships/${scholarshipId}`)
      .then((res) => setScholarship(res.data?.data))
      .catch(() => setScholarship(null));
  }, [axiosPublic, scholarshipId]);

  // 🔹 Save failed application (unpaid)
  useEffect(() => {
    const saveApplication = async () => {
      if (!scholarshipId || !user?.email) {
        setSaving(false);
        return;
      }

      try {
        await axiosPublic.post("/applications", {
          scholarshipId,
          userEmail: user.email,
          userName: user.displayName || "Anonymous",
          paymentStatus: "unpaid",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    };

    saveApplication();
  }, [axiosPublic, scholarshipId, user]);

  // 🔹 Set error message
  useEffect(() => {
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    } else {
      setErrorMessage(
        "The payment process was interrupted or cancelled. Please try again."
      );
    }
  }, [error]);

  return (
    <section className="py-10 lg:py-14">
      <div className="container max-w-lg text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 space-y-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-red-600">
            Payment Failed ❌
          </h1>

          <p className="text-sm text-red-700">
            Unfortunately, your payment could not be completed.
          </p>

          {/* Scholarship info */}
          {scholarship && (
            <div className="bg-white rounded-xl p-4 text-left text-sm border border-red-100">
              <p>
                <span className="font-medium">Scholarship:</span>{" "}
                {scholarship.scholarship_name}
              </p>
              <p className="text-xs text-slate-600">
                {scholarship.university_name}
              </p>
            </div>
          )}

          {/* Error message */}
          <div className="text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg p-3">
            <span className="font-medium">Error:</span> {errorMessage}
          </div>

          {/* Amount */}
          {amount && (
            <p className="text-sm text-red-900">
              <span className="font-medium">Amount:</span> ${amount}
            </p>
          )}

          {/* Action */}
          <button
            onClick={() => navigate("/dashboard/my-applications")}
            className="btn btn-secondary mt-3 text-sm"
            disabled={saving}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentFailed;

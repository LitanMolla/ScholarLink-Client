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

  const searchParams = new URLSearchParams(location.search);
  const scholarshipId = searchParams.get("scholarshipId");
  const amount = searchParams.get("amount");

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

  return (
    <section className="py-10 lg:py-14">
      <div className="container max-w-lg text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-red-600">
            Payment Failed ❌
          </h1>
          <p className="mt-2 text-sm text-red-700">
            Your payment could not be completed. You can try again later from your dashboard.
          </p>

          <div className="mt-4 text-sm text-red-900 space-y-1">
            <p>
              <span className="font-medium">Amount:</span> ${amount}
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/my-applications")}
            className="btn btn-secondary mt-5 text-sm"
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

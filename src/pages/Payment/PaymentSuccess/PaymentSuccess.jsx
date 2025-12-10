// src/pages/Payment/PaymentSuccess/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";

const PaymentSuccess = () => {
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
          paymentStatus: "paid",
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
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-emerald-700">
            Payment Successful 🎉
          </h1>
          <p className="mt-2 text-sm text-emerald-800">
            Thank you! Your payment has been completed successfully.
          </p>

          <div className="mt-4 text-sm text-emerald-900 space-y-1">
            <p>
              <span className="font-medium">Amount Paid:</span> ${amount}
            </p>
            <p className="text-xs text-emerald-700">
              We are saving your application information...
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/my-applications")}
            className="btn btn-primary mt-5 text-sm"
            disabled={saving}
          >
            Go to My Applications
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;

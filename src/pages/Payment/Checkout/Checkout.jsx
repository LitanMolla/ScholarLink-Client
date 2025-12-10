// src/pages/Payment/Checkout/Checkout.jsx
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const Checkout = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: scholarship = {}, isPending } = useQuery({
    queryKey: ["checkout-scholarship", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/scholarships/${id}`);
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  // 🔥 MAIN FIX: fallback field names EXACT MATCH WITH DATABASE
  const applicationFees = Number(
    scholarship.applicationFees ??
    scholarship.application_fees ??   // <-- REAL DB FIELD
    0
  );

  const serviceCharge = Number(
    scholarship.serviceCharge ??
    scholarship.service_charge ??     // <-- REAL DB FIELD
    0
  );

  const totalAmount = applicationFees + serviceCharge;

  const handleStripeCheckout = async () => {
    try {
      const res = await axiosPublic.post("/create-checkout-session", {
        scholarshipId: scholarship._id,
        userEmail: user?.email,
        userName: user?.displayName,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-10 lg:py-14">
      <div className="container max-w-xl">
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 lg:p-7 space-y-4">
          <h1 className="text-lg sm:text-xl font-semibold text-secondary">
            Checkout – {scholarship.scholarship_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            You are about to apply for{" "}
            <span className="font-medium">{scholarship.university_name}</span>.
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Application Fees</span>
              <span className="font-medium text-secondary">
                ${applicationFees}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Service Charge</span>
              <span className="font-medium text-secondary">
                ${serviceCharge}
              </span>
            </div>

            <div className="border-t border-slate-200 my-2" />

            <div className="flex justify-between">
              <span className="font-semibold text-secondary">Total</span>
              <span className="font-semibold text-secondary">
                ${totalAmount}
              </span>
            </div>
          </div>

          <button
            onClick={handleStripeCheckout}
            className="btn btn-primary w-full text-sm"
          >
            Pay with Stripe
          </button>

          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary w-full text-xs mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

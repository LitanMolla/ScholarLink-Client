import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import successToast from "../../../utils/successToast";
import errorToast from "../../../utils/errorToast";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // ScholarshipDetails theke pathano data
  const scholarship = location.state;

  const [clientSecret, setClientSecret] = useState("");
  const [pending, setPending] = useState(false);
  const [loadingIntent, setLoadingIntent] = useState(true);

  const applicationFees = scholarship?.applicationFees || 0;
  const serviceCharge = scholarship?.serviceCharge || 0;
  const totalAmount = applicationFees + serviceCharge;

  // 🔹 Payment Intent create
  useEffect(() => {
    if (!totalAmount) {
      setLoadingIntent(false);
      return;
    }

    const createIntent = async () => {
      try {
        const res = await axiosPublic.post("/create-payment-intent", {
          amount: totalAmount,
        });

        if (res.data?.success) {
          setClientSecret(res.data.clientSecret);
        } else {
          errorToast({
            code: "custom/error",
            message: "Failed to initialize payment.",
          });
        }
      } catch (error) {
        errorToast(error);
      } finally {
        setLoadingIntent(false);
      }
    };

    createIntent();
  }, [axiosPublic, totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setPending(true);
    const card = elements.getElement(CardElement);
    if (!card) {
      setPending(false);
      return;
    }

    try {
      // Optional: payment method create (error check er jonno)
      const { error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: user?.displayName || "Anonymous",
          email: user?.email || "no-email@example.com",
        },
      });

      if (pmError) {
        errorToast(pmError);
        setPending(false);
        return;
      }

      // Confirm Card Payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Anonymous",
              email: user?.email || "no-email@example.com",
            },
          },
        });

      if (confirmError) {
        errorToast(confirmError);
        setPending(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // ✅ Payment success hole Applications collection e data save
        const payload = {
          scholarshipId: scholarship?.scholarshipId || id,
          userId: user?.uid,
          userName: user?.displayName || "User",
          userEmail: user?.email,
          universityName: scholarship?.universityName,
          scholarshipCategory: scholarship?.scholarshipCategory,
          degree: scholarship?.degree,
          applicationFees,
          serviceCharge,
        };

        const res = await axiosPublic.post("/applications", payload);

        if (res.data?.success) {
          successToast(
            "Payment Successful!",
            "Your scholarship application has been submitted."
          );
          navigate("/dashboard/applications");
        } else {
          errorToast({
            code: "custom/error",
            message: "Payment succeeded but saving failed.",
          });
        }
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setPending(false);
    }
  };

  // jodi state na thake (direct URL diye ashe)
  if (!scholarship) {
    return (
      <section className="py-10 lg:py-14">
        <div className="container max-w-md text-center space-y-3">
          <p className="text-sm text-slate-600">
            No scholarship data found for checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-primary text-sm"
          >
            Go Back Home
          </button>
        </div>
      </section>
    );
  }

  if (loadingIntent) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-10 lg:py-14">
      <div className="container max-w-lg">
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-primary uppercase tracking-wide">
              Checkout
            </p>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary">
              {scholarship.scholarshipName}
            </h2>
            <p className="text-sm text-slate-600">
              {scholarship.universityName}
            </p>
          </div>

          {/* Applicant info */}
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium">Applicant:</span>{" "}
              {user?.displayName || user?.email}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>

          {/* Amount summary */}
          <div className="mt-3 border border-dashed border-black/15 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Application Fees</span>
              <span>${applicationFees}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge</span>
              <span>${serviceCharge}</span>
            </div>
            <hr className="border-slate-200 my-2" />
            <div className="flex justify-between font-semibold text-secondary">
              <span>Total Payable</span>
              <span>${totalAmount}</span>
            </div>
          </div>

          {/* Stripe Card form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <div className="border border-black/10 rounded-md p-3 bg-slate-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "14px",
                      color: "#0f172a",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                    },
                    invalid: {
                      color: "#ef4444",
                    },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!stripe || !clientSecret || pending}
              className="btn btn-primary w-full text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                "Confirm & Pay"
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 mt-2">
            Use Stripe test card:{" "}
            <span className="font-mono">4242 4242 4242 4242</span>, any future
            expiry date, any CVC, any ZIP.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

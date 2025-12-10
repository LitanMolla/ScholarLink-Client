import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import successToast from "../../../utils/successToast";
import errorToast from "../../../utils/errorToast";
import LoginWithGoogle from "../components/LoginWithGoogle";

const Login = () => {
  const [pending, setPending] = useState(false);
  const { userLogin, user } = useAuth();
  const navigate = useNavigate()
  const { state } = useLocation()
  useEffect(() => {
    if (user) {
      navigate(state || '/')
    }
  }, [state,user])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setPending(true);
    try {
      const result = await userLogin(data?.email, data?.password);
      if (result.user) {
        successToast(
          "Login Successful!",
          "Welcome back! You’re now logged in."
        );
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="container max-w-md bg-white border border-black/10 rounded-xl shadow-sm p-6 md:p-8">
        {/* Title */}
        <h2 className="text-xl font-semibold text-secondary mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Login to access your scholarships and dashboard.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2.5 rounded-md bg-slate-50 duration-300 focus:outline-none ${errors.email
                  ? "border border-red-400 focus:ring-2 focus:ring-red-300"
                  : "border border-black/10 focus:ring-2 focus:ring-primary/30"
                }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-2.5 rounded-md bg-slate-50 duration-300 focus:outline-none ${errors.password
                  ? "border border-red-400 focus:ring-2 focus:ring-red-300"
                  : "border border-black/10 focus:ring-2 focus:ring-primary/30"
                }`}
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full text-sm mt-4 duration-300"
            disabled={pending}
          >
            {pending ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-black/10"></span>
          <span className="text-[12px] text-slate-500">OR</span>
          <span className="flex-1 h-px bg-black/10"></span>
        </div>

        {/* Google Sign-in */}
        <LoginWithGoogle />

        {/* Register link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline duration-300"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;

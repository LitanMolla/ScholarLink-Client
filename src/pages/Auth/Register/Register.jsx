import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import uploadImageToImgBB from "../../../utils/uploadImageToImgBB";
import successToast from "../../../utils/successToast";
import errorToast from "../../../utils/errorToast";
import LoginWithGoogle from "../components/LoginWithGoogle";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import setToken from "../../../utils/setToken";
const Register = () => {
  const [pending, setPending] = useState(false)
  const { userRegister, userUpdate, user } = useAuth()
  const axiosPublic = useAxiosPublic()
  const navigate = useNavigate()
  const { state } = useLocation()
  useEffect(() => {
    if (user) {
      navigate(state?.from || '/')
    }
  }, [state?.from, user])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setPending(true)
    const photoURL = await uploadImageToImgBB(data?.photo[0])
    try {
      const result = await userRegister(data?.email, data?.password)
      if (result.user) {
        userUpdate({ displayName: data?.name, photoURL })
          .then(() => successToast('Register Successful!', 'Your account has been created successfully.'))
          .catch(error => errorToast(error))
        navigate(state?.from|| '/')
        axiosPublic.post('/users', { photoURL, email: result.user.email, name: data?.name })
        setPending(false)
      }
    } catch (error) {
      errorToast(error)
      setPending(false)
    }

  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="container max-w-md bg-white border border-black/10 rounded-xl shadow-sm p-6 md:p-8">

        {/* Title */}
        <h2 className="text-xl font-semibold text-secondary mb-1">
          Create an Account
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Join ScholarLink and start your scholarship journey.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-2.5 rounded-md bg-slate-50 duration-300 focus:outline-none ${errors.name
                ? "border border-red-400 focus:ring-2 focus:ring-red-300"
                : "border border-black/10 focus:ring-2 focus:ring-primary/30"
                }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">Email Address</label>
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
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className={`w-full px-4 py-2.5 rounded-md bg-slate-50 duration-300 focus:outline-none ${errors.password
                ? "border border-red-400 focus:ring-2 focus:ring-red-300"
                : "border border-black/10 focus:ring-2 focus:ring-primary/30"
                }`}
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]|:;"'<>,.?/~`]{6,}$/,
                  message:
                    "Must contain uppercase, lowercase & number.",
                },
              })}
            />
            {/* Show helper text ONLY if error */}
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Photo Upload (File Input) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              className={`w-full px-4 py-2.5 rounded-md bg-slate-50 border ${errors.photo
                ? "border-red-400 focus:ring-2 focus:ring-red-300"
                : "border-black/10 focus:ring-2 focus:ring-primary/30"
                } duration-300`}
              {...register("photo", { required: "Photo upload is required" })}
            />
            {errors.photo && (
              <p className="text-xs text-red-500 mt-1">{errors.photo.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full text-sm mt-4 duration-300"
          >
            {pending ? <span className="animate-pulse">Loading...</span> : 'Register'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-black/10"></span>
          <span className="text-[12px] text-slate-500">OR</span>
          <span className="flex-1 h-px bg-black/10"></span>
        </div>

        {/* Google Sign-in */}
        <LoginWithGoogle state={state} />

        {/* Already have account */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline duration-300">
            Login
          </Link>
        </p>

      </div>
    </section>
  );
};

export default Register;

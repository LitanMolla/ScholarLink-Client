import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import errorToast from "../../../utils/errorToast";
import successAlert from "../../../utils/successToast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Navigate, useNavigation } from "react-router";

const LoginWithGoogle = ({state}) => {
  const [pending, setPending] = useState(false);
  const { googleLogin } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigation()
  const handleLogin = async () => {
    setPending(true);
    try {
      const result = await googleLogin();

      if (result.user) {
        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };

        // 🔹 Backend e user save / update
        await axiosPublic.post("/users", userInfo);
        successAlert(
          "Login Successful!",
          "Welcome back! You’re now logged in."
        );
        <Navigate to={state?.from||'/'} />
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full border border-black/10 rounded-md py-2.5 flex items-center justify-center gap-2 hover:bg-slate-50 duration-300 cursor-pointer"
    >
      {pending ? (
        <span className="animate-pulse text-sm text-secondary">Loading...</span>
      ) : (
        <>
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium text-secondary">
            Continue with Google
          </span>
        </>
      )}
    </button>
  );
};

export default LoginWithGoogle;

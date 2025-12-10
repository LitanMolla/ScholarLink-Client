import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Load user info from DB
  const { data: dbUser = {}, isPending } = useQuery({
    queryKey: ["db-user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data?.data || {};
    },
  });

  if (isPending) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      {/* Header */}
      <h1 className="text-lg sm:text-xl font-semibold text-secondary">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="rounded-xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm space-y-5">

        {/* Avatar + Basic info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-full overflow-hidden bg-primary/10 border border-black/10 flex items-center justify-center text-primary font-semibold text-xl">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              (user?.displayName || user?.email || "U")[0].toUpperCase()
            )}
          </div>

          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-secondary">
              {user?.displayName || "Unnamed User"}
            </h2>
            <p className="text-sm text-slate-600">{user?.email}</p>
            <span className="inline-flex mt-1 px-3 py-1 rounded-full text-[11px] bg-primary/10 text-primary font-medium">
              {dbUser?.role || "Student"}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="text-sm font-semibold text-secondary">
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Full Name
              </p>
              <p className="text-slate-700">{user?.displayName || "Not set"}</p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Email Address
              </p>
              <p className="text-slate-700">{user?.email}</p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Role
              </p>
              <p className="text-slate-700">{dbUser?.role || "Student"}</p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Account Created
              </p>
              <p className="text-slate-700">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="pt-3 border-t border-slate-200">
          <button
            type="button"
            className="btn btn-primary text-sm w-full sm:w-auto"
            disabled
          >
            Update Profile (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;

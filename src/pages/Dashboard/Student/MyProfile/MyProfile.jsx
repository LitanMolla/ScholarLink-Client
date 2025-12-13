import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: dbUser = {}, isPending } = useQuery({
    queryKey: ["db-user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data?.data || {};
    },
  });

  if (isPending) return <LoadingSpinner />;

  const initials = (user?.displayName || user?.email || "U")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const role = dbUser?.role || "Student";
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime)
    : null;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Your account details at a glance.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-700 px-5 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Avatar + Role (locked together) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white text-xl font-extrabold">
                    {initials}
                  </span>
                )}
              </div>

              {/* Role badge (stays near avatar always) */}
              <div className="flex flex-col justify-center">
                <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-900 shadow-sm border border-slate-200">
                  {role}
                </span>
                <span className="mt-1 inline-flex w-fit items-center gap-2 text-xs text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
            </div>

            {/* Name + Email */}
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                {user?.displayName || "Unnamed User"}
              </h2>
              <p className="mt-1 text-sm text-white/80 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* Body */}
        <div className="px-5 sm:px-8 py-6 sm:py-8">
          {/* Summary row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Full Name
              </p>
              <p className="mt-1 text-base font-extrabold text-slate-900">
                {user?.displayName || "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Email
              </p>
              <p className="mt-1 text-base font-extrabold text-slate-900 break-all">
                {user?.email || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Account Created
              </p>
              <p className="mt-1 text-base font-extrabold text-slate-900">
                {createdAt ? createdAt.toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-extrabold text-slate-900">
              Account Information
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Role
                </p>
                <p className="mt-1 font-bold text-slate-900">{role}</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <p className="mt-1 font-bold text-emerald-700">Active</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Created (Full)
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  {createdAt ? createdAt.toLocaleString() : "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  User ID
                </p>
                <p className="mt-1 font-bold text-slate-900 break-all">
                  {user?.uid || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import {
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isPending } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics");
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  const {
    totalUsers = 0,
    totalScholarships = 0,
    totalApplications = 0,
    totalReviews = 0,
    applicationStats = [],
  } = data || {};

  const getStatusCount = (status) =>
    applicationStats.find((s) => s._id === status)?.count || 0;

  const pending = getStatusCount("pending");
  const completed = getStatusCount("completed");
  const rejected = getStatusCount("rejected");

  return (
    <section className="py-6 w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-secondary">
            Analytics Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System stats, performance & insights
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-black/10 bg-white">
          <FiTrendingUp className="text-primary" />
          <span className="text-slate-600">Live Summary</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<FiUsers />}
          gradient="from-blue-500/10 via-blue-400/5 to-transparent"
          ring="ring-blue-500/15"
          badge="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Scholarships"
          value={totalScholarships}
          icon={<FiBookOpen />}
          gradient="from-purple-500/10 via-purple-400/5 to-transparent"
          ring="ring-purple-500/15"
          badge="text-purple-600 bg-purple-50"
        />
        <StatCard
          title="Applications"
          value={totalApplications}
          icon={<FiFileText />}
          gradient="from-emerald-500/10 via-emerald-400/5 to-transparent"
          ring="ring-emerald-500/15"
          badge="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Reviews"
          value={totalReviews}
          icon={<FiStar />}
          gradient="from-amber-500/10 via-amber-400/5 to-transparent"
          ring="ring-amber-500/15"
          badge="text-amber-700 bg-amber-50"
        />
      </div>

      {/* Status Breakdown */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-secondary">
              Application Status
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pending vs Completed vs Rejected
            </p>
          </div>

          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Total: {pending + completed + rejected}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatusBox
            title="Pending"
            count={pending}
            pill="bg-amber-50 text-amber-700"
            bar="bg-amber-200"
          />
          <StatusBox
            title="Completed"
            count={completed}
            pill="bg-emerald-50 text-emerald-700"
            bar="bg-emerald-200"
          />
          <StatusBox
            title="Rejected"
            count={rejected}
            pill="bg-red-50 text-red-700"
            bar="bg-red-200"
          />
        </div>

        {/* tiny progress bar feel */}
        <div className="mt-5">
          <p className="text-[11px] text-slate-500 mb-2">
            Quick visual ratio
          </p>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="h-full bg-amber-300"
              style={{
                width:
                  pending + completed + rejected === 0
                    ? "0%"
                    : `${(pending / (pending + completed + rejected)) * 100}%`,
              }}
            />
            <div
              className="h-full bg-emerald-300"
              style={{
                width:
                  pending + completed + rejected === 0
                    ? "0%"
                    : `${(completed / (pending + completed + rejected)) * 100}%`,
              }}
            />
            <div
              className="h-full bg-red-300"
              style={{
                width:
                  pending + completed + rejected === 0
                    ? "0%"
                    : `${(rejected / (pending + completed + rejected)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Components ---------- */

const StatCard = ({ title, value, icon, gradient, ring }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)] ring-1 ${ring}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-semibold text-secondary mt-1">
            {value ?? 0}
          </p>
        </div>

        {/* Icon only (Live badge removed) */}
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-black/10 text-secondary">
          <span className="text-lg">{icon}</span>
        </span>
      </div>

      <div className="relative mt-3">
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-2/3 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};


const StatusBox = ({ title, count, pill, bar }) => {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-700 font-medium">{title}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pill}`}>
          {count}
        </span>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full w-2/3 ${bar} rounded-full`} />
      </div>
    </div>
  );
};

export default Analytics;

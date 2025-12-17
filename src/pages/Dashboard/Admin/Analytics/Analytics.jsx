import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp, FiFileText } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: analyticsRes, isPending: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics");
      return res.data?.data;
    },
  });

  const { data: appsRes, isPending: appsLoading } = useQuery({
    queryKey: ["admin-applications-all"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications");
      return res.data?.data || [];
    },
  });

  // ✅ ALWAYS define safe defaults (no conditional hooks)
  const analyticsData = analyticsRes || {};
  const applications = Array.isArray(appsRes) ? appsRes : [];

  const {
    totalUsers = 0,
    totalScholarships = 0,
    totalApplications = 0,
    applicationStats = [],
  } = analyticsData;

  const getStatusCount = (status) =>
    applicationStats.find((s) => s._id === status)?.count || 0;

  const pending = getStatusCount("pending");
  const processing = getStatusCount("processing");
  const completed = getStatusCount("completed");
  const rejected = getStatusCount("rejected");

  // ✅ useMemo ALWAYS runs (but uses empty data if loading)
  const totalFeesCollected = useMemo(() => {
    return applications
      .filter((a) => a.paymentStatus === "paid")
      .reduce((sum, a) => {
        const appFee = Number(a.applicationFees || 0);
        const service = Number(a.serviceCharge || 0);
        return sum + appFee + service;
      }, 0);
  }, [applications]);

  const categoryChartData = useMemo(() => {
    const map = new Map();
    applications.forEach((a) => {
      const key = a.scholarshipCategory || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [applications]);

  const statusPieData = useMemo(
    () => [
      { name: "Pending", value: pending },
      { name: "Processing", value: processing },
      { name: "Completed", value: completed },
      { name: "Rejected", value: rejected },
    ],
    [pending, processing, completed, rejected]
  );

  const PIE_COLORS = ["#fbbf24", "#60a5fa", "#34d399", "#f87171"];

  // ✅ ONLY NOW return loading UI
  if (analyticsLoading || appsLoading) return <LoadingSpinner />;

  return (
    <section className="py-6 w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-secondary">Analytics Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Platform stats, fees & application insights
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-black/10 bg-white">
          <FiTrendingUp className="text-primary" />
          <span className="text-slate-600">Live Summary</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={<FiUsers />} />
        <StatCard title="Total Scholarships" value={totalScholarships} icon={<FiBookOpen />} />
        <StatCard title="Total Applications" value={totalApplications} icon={<FiFileText />} />
        <StatCard title="Total Fees Collected" value={`$${totalFeesCollected.toFixed(0)}`} icon={<FiDollarSign />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-secondary">
            Applications by Scholarship Category
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">Top categories</p>

          <div className="h-[280px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-secondary">
            Application Status Breakdown
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Pending vs Processing vs Completed vs Rejected
          </p>

          <div className="h-[280px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {statusPieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold text-secondary mt-1">
            {value ?? 0}
          </p>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-black/10 text-secondary">
          <span className="text-lg">{icon}</span>
        </span>
      </div>
    </div>
  );
};

export default Analytics;

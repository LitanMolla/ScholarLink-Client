import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";

const ManageApplications = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: applications = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["all-applications"],
    queryFn: async () => {
      const res = await axiosPublic.get("/applications");
      return res.data.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  const handleApprove = async (app) => {
    const result = await Swal.fire({
      title: "Approve application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    await axiosPublic.patch(`/applications/${app._id}`, {
      applicationStatus: "completed",
      feedback: "Approved by moderator",
    });

    Swal.fire({
      icon: "success",
      title: "Application approved",
      timer: 1500,
      showConfirmButton: false,
    });

    refetch();
  };

  const handleReject = async (app) => {
    const { value: feedback } = await Swal.fire({
      title: "Reject application",
      input: "textarea",
      inputLabel: "Feedback (required)",
      inputPlaceholder: "Reason for rejection...",
      inputValidator: (value) => {
        if (!value) return "Feedback is required";
      },
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    });

    if (!feedback) return;

    await axiosPublic.patch(`/applications/${app._id}`, {
      applicationStatus: "rejected",
      feedback,
    });

    Swal.fire({
      icon: "success",
      title: "Application rejected",
      timer: 1500,
      showConfirmButton: false,
    });

    refetch();
  };

  const statusBadge = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-600";
    if (status === "completed") return "bg-emerald-50 text-emerald-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-slate-50 text-slate-600";
  };

  return (
    <section className="py-6 space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-secondary">
          Manage Applications
        </h1>
        <p className="text-xs text-slate-500">
          Total: {applications.length}
        </p>
      </div>

      {/* 🔹 Desktop (md+) */}
      <div className="hidden md:block w-full">
        <div className="w-full overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">University</th>
                <th className="px-3 py-2 text-left">Degree</th>
                <th className="px-3 py-2 text-left">Payment</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3">
                    <p className="font-medium text-secondary">
                      {app.userName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {app.userEmail}
                    </p>
                  </td>

                  <td className="px-3 py-3">{app.universityName}</td>
                  <td className="px-3 py-3">{app.degree}</td>
                  <td className="px-3 py-3">{app.paymentStatus}</td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${statusBadge(
                        app.applicationStatus
                      )}`}
                    >
                      {app.applicationStatus}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setShowDetails(true);
                      }}
                      className="btn btn-secondary btn-xs"
                    >
                      Details
                    </button>

                    {app.applicationStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(app)}
                          className="btn btn-primary btn-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          className="btn btn-danger btn-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Mobile (md-) */}
      <div className="grid gap-3 md:hidden">
        {applications.map((app) => (
          <div
            key={app._id}
            className="rounded-xl border border-black/10 bg-white p-4 space-y-2 shadow-sm"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-semibold text-secondary">
                  {app.userName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {app.userEmail}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusBadge(
                  app.applicationStatus
                )}`}
              >
                {app.applicationStatus}
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">University:</span>{" "}
              {app.universityName}
            </p>
            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Degree:</span> {app.degree}
            </p>
            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Payment:</span>{" "}
              {app.paymentStatus}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              <button
                onClick={() => {
                  setSelectedApp(app);
                  setShowDetails(true);
                }}
                className="btn btn-secondary btn-xs"
              >
                Details
              </button>

              {app.applicationStatus === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(app)}
                    className="btn btn-primary btn-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(app)}
                    className="btn btn-danger btn-xs"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <p className="text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl py-6 bg-white">
            No applications found.
          </p>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-secondary mb-3">
              Application Details
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              <p>
                <span className="font-medium">Student:</span>{" "}
                {selectedApp.userName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedApp.userEmail}
              </p>
              <p>
                <span className="font-medium">University:</span>{" "}
                {selectedApp.universityName}
              </p>
              <p>
                <span className="font-medium">Degree:</span>{" "}
                {selectedApp.degree}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedApp.applicationStatus}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {selectedApp.paymentStatus}
              </p>
              {selectedApp.feedback && (
                <p>
                  <span className="font-medium">Feedback:</span>{" "}
                  {selectedApp.feedback}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="btn btn-secondary btn-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageApplications;

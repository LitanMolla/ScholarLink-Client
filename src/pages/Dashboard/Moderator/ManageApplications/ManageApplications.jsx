import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";

const ManageApplications = () => {
  const axiosPublic = useAxiosPublic();

  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

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

  const statusBadge = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-600";
    if (status === "processing") return "bg-blue-50 text-blue-600";
    if (status === "completed") return "bg-emerald-50 text-emerald-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-slate-50 text-slate-600";
  };

  const paymentBadge = (status) => {
    if (status === "paid") return "bg-emerald-50 text-emerald-600";
    return "bg-red-50 text-red-600";
  };

  // ✅ Details
  const openDetails = (app) => {
    setSelectedApp(app);
    setShowDetails(true);
  };

  // ✅ Feedback modal open
  const openFeedbackModal = (app) => {
    setFeedbackTarget(app);
    setFeedbackText(app.feedback || "");
    setShowFeedbackModal(true);
  };

  // ✅ Feedback save
  const handleFeedbackSave = async (e) => {
    e.preventDefault();
    if (!feedbackTarget) return;

    const text = feedbackText.trim();

    try {
      await axiosPublic.patch(`/applications/${feedbackTarget._id}`, {
        feedback: text,
      });

      Swal.fire({
        icon: "success",
        title: "Feedback saved",
        timer: 1400,
        showConfirmButton: false,
      });

      setShowFeedbackModal(false);
      setFeedbackTarget(null);
      setFeedbackText("");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Could not save feedback.",
      });
    }
  };

  // ✅ Status update (processing / completed)
  const handleStatusChange = async (app, nextStatus) => {
    const result = await Swal.fire({
      title: "Update status?",
      text: `Change to "${nextStatus}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPublic.patch(`/applications/${app._id}`, {
        applicationStatus: nextStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Status updated",
        timer: 1200,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Could not update status.",
      });
    }
  };

  // ✅ Cancel / Reject
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

    try {
      await axiosPublic.patch(`/applications/${app._id}`, {
        applicationStatus: "rejected",
        feedback: feedback.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "Application rejected",
        timer: 1300,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Could not reject application.",
      });
    }
  };

  // ✅ helper: status options (requirement অনুযায়ী)
  const getStatusOptions = (status) => {
    if (status === "pending") return ["processing"];
    if (status === "processing") return ["completed"];
    return []; // completed/rejected -> no changes
  };

  return (
    <section className="py-6 space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-secondary">
          Manage Applied Applications
        </h1>
        <p className="text-xs text-slate-500">Total: {applications.length}</p>
      </div>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block w-full">
        <div className="w-full overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Applicant Name</th>
                <th className="px-3 py-2 text-left">Applicant Email</th>
                <th className="px-3 py-2 text-left">University Name</th>
                <th className="px-3 py-2 text-left">Feedback</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Payment</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => {
                const statusOptions = getStatusOptions(app.applicationStatus);

                return (
                  <tr
                    key={app._id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-3 py-3 font-medium text-secondary">
                      {app.userName}
                    </td>

                    <td className="px-3 py-3 text-slate-600">{app.userEmail}</td>

                    <td className="px-3 py-3">{app.universityName}</td>

                    <td className="px-3 py-3">
                      <p className="text-[11px] text-slate-600 line-clamp-2 max-w-[220px]">
                        {app.feedback ? app.feedback : "—"}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium capitalize ${statusBadge(
                          app.applicationStatus
                        )}`}
                      >
                        {app.applicationStatus}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium capitalize ${paymentBadge(
                          app.paymentStatus
                        )}`}
                      >
                        {app.paymentStatus}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end flex-wrap gap-2">
                        <button
                          onClick={() => openDetails(app)}
                          className="btn btn-secondary btn-xs"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => openFeedbackModal(app)}
                          className="btn btn-outline btn-xs"
                        >
                          Feedback
                        </button>

                        {/* ✅ Status Update dropdown */}
                        <select
                          className="select select-bordered select-xs border border-slate-300 py-2 px-2 rounded-md"
                          value=""
                          disabled={statusOptions.length === 0}
                          onChange={(e) => {
                            const next = e.target.value;
                            if (!next) return;
                            handleStatusChange(app, next);
                          }}
                        >
                          <option value="" disabled>
                            Status Update
                          </option>
                          {statusOptions.map((s) => (
                            <option className="capitalize" key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {/* ✅ Cancel (Reject) */}
                        {app.applicationStatus !== "completed" &&
                          app.applicationStatus !== "rejected" && (
                            <button
                              onClick={() => handleReject(app)}
                              className="btn btn-danger btn-xs"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
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

      {/* ✅ Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {applications.map((app) => {
          const statusOptions = getStatusOptions(app.applicationStatus);

          return (
            <div
              key={app._id}
              className="rounded-xl border border-black/10 bg-white p-4 space-y-2 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-secondary truncate">
                    {app.userName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {app.userEmail}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    <span className="font-medium">University:</span>{" "}
                    {app.universityName}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] capitalize font-medium ${statusBadge(
                      app.applicationStatus
                    )}`}
                  >
                    {app.applicationStatus}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-[10px] capitalize font-medium ${paymentBadge(
                      app.paymentStatus
                    )}`}
                  >
                    {app.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-700">
                <span className="font-medium">Feedback:</span>{" "}
                {app.feedback ? app.feedback : "—"}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => openDetails(app)}
                  className="btn btn-secondary btn-xs"
                >
                  Details
                </button>

                <button
                  onClick={() => openFeedbackModal(app)}
                  className="btn btn-outline btn-xs"
                >
                  Feedback
                </button>

                <select
                  className="select select-bordered select-xs border border-slate-300"
                  value=""
                  disabled={statusOptions.length === 0}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (!next) return;
                    handleStatusChange(app, next);
                  }}
                >
                  <option value="" disabled>
                    Status Update
                  </option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {app.applicationStatus !== "completed" &&
                  app.applicationStatus !== "rejected" && (
                    <button
                      onClick={() => handleReject(app)}
                      className="btn btn-danger btn-xs"
                    >
                      Cancel
                    </button>
                  )}
              </div>
            </div>
          );
        })}

        {applications.length === 0 && (
          <p className="text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl py-6 bg-white">
            No applications found.
          </p>
        )}
      </div>

      {/* ✅ Details Modal (full applicant + scholarship) */}
      {showDetails && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-sm font-semibold text-secondary">
                Application Details
              </h2>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium capitalize ${statusBadge(
                  selectedApp.applicationStatus
                )}`}
              >
                {selectedApp.applicationStatus}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-xs text-slate-700">
              <p>
                <span className="font-medium">Applicant Name:</span>{" "}
                {selectedApp.userName}
              </p>
              <p>
                <span className="font-medium">Applicant Email:</span>{" "}
                {selectedApp.userEmail}
              </p>

              <hr className="my-2" />

              <p>
                <span className="font-medium">Scholarship Name:</span>{" "}
                {selectedApp.scholarshipName || "N/A"}
              </p>
              <p>
                <span className="font-medium">University:</span>{" "}
                {selectedApp.universityName}
              </p>
              <p>
                <span className="font-medium">Degree:</span> {selectedApp.degree}
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                {selectedApp.scholarshipCategory}
              </p>
              <p>
                <span className="font-medium">Subject:</span>{" "}
                {selectedApp.subjectCategory}
              </p>

              <hr className="my-2" />

              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {selectedApp.paymentStatus}
              </p>

              <p>
                <span className="font-medium">Feedback:</span>{" "}
                {selectedApp.feedback ? selectedApp.feedback : "—"}
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
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

      {/* ✅ Feedback Modal */}
      {showFeedbackModal && feedbackTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <form
            onSubmit={handleFeedbackSave}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-lg space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-secondary">
                  Write Feedback
                </h2>
                <p className="text-[11px] text-slate-500 truncate">
                  {feedbackTarget.userName} · {feedbackTarget.userEmail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="btn btn-ghost btn-xs"
              >
                ✕
              </button>
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write feedback for the applicant..."
              className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="btn btn-secondary btn-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-xs">
                Save Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ManageApplications;

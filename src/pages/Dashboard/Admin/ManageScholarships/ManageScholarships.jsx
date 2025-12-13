import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selected, setSelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const { data, isPending, refetch, isFetching } = useQuery({
    queryKey: ["admin-scholarships", search, page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/scholarships?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchText.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchText]);

  const scholarships = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1, limit };

  // ✅ useMemo বাদ — hook issue fix
  const pages = [];
  for (let i = 1; i <= (meta.totalPages || 1); i++) pages.push(i);

  // if (isPending)  <LoadingSpinner />;
  const openEdit = (item) => {
    setSelected(item);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setSelected(null);
    setShowEdit(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this scholarship?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/scholarships/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      Swal.fire("Error", error.message || "Delete failed", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected?._id) return;

    const form = e.target;

    const updateDoc = {
      scholarship_name: form.scholarship_name.value,
      university_name: form.university_name.value,
      country: form.country.value,
      city: form.city.value,
      degree: form.degree.value,
      subject_category: form.subject_category.value,
      scholarship_category: form.scholarship_category.value,
      applicationFees: Number(form.applicationFees.value),
      serviceCharge: Number(form.serviceCharge.value),
      tuition_fees: Number(form.tuition_fees.value),
      world_rank: Number(form.world_rank.value),
    };

    try {
      await axiosPublic.patch(`/scholarships/${selected._id}`, updateDoc);
      Swal.fire({
        icon: "success",
        title: "Updated",
        timer: 1200,
        showConfirmButton: false,
      });
      closeEdit();
      refetch();
    } catch (error) {
      Swal.fire("Error", error.message || "Update failed", "error");
    }
  };

  return (
    <section className="py-6 w-full space-y-4">
      {isPending && <p>Loading...</p>}
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-secondary">
            Manage Scholarships
          </h1>
          <p className="text-xs text-slate-500">
            Total: {meta.total} {isFetching ? "• updating..." : ""}
          </p>
        </div>

        <div className="w-full sm:w-80">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by scholarship or university..."
            className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
          />
        </div>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block w-full">
        <div className="w-full overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Scholarship</th>
                <th className="px-3 py-2 text-left">University</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Fees</th>
                <th className="px-3 py-2 text-left">Rank</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {scholarships.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    No scholarships found.
                  </td>
                </tr>
              )}

              {scholarships.map((s) => (
                <tr
                  key={s._id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-black/10 shrink-0">
                        <img
                          src={s.image}
                          alt={s.scholarship_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">
                          {s.scholarship_name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {s.scholarship_category} • {s.degree}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">{s.university_name}</td>

                  <td className="px-3 py-3 text-slate-700">
                    {s.city}, {s.country}
                  </td>

                  <td className="px-3 py-3 text-slate-700">
                    <p>
                      App:{" "}
                      <span className="font-semibold">
                        ${s.applicationFees || 0}
                      </span>
                    </p>
                    <p>
                      Svc:{" "}
                      <span className="font-semibold">
                        ${s.serviceCharge || 0}
                      </span>
                    </p>
                  </td>

                  <td className="px-3 py-3 text-slate-700">
                    #{s.world_rank || "-"}
                  </td>

                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="btn btn-secondary btn-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="btn btn-danger btn-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards (md-) */}
      <div className="grid gap-3 md:hidden">
        {scholarships.map((s) => (
          <div
            key={s._id}
            className="rounded-xl border border-black/10 bg-white p-4 space-y-2"
          >
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-full overflow-hidden border border-black/10 shrink-0">
                <img
                  src={s.image}
                  alt={s.scholarship_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-secondary">
                  {s.scholarship_name}
                </p>
                <p className="text-[11px] text-slate-500">{s.university_name}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Location:</span> {s.city},{" "}
              {s.country}
            </p>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Fees:</span> App $
              {s.applicationFees || 0} • Svc ${s.serviceCharge || 0}
            </p>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Rank:</span> #{s.world_rank || "-"}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              <button
                onClick={() => openEdit(s)}
                className="btn btn-secondary btn-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="btn btn-danger btn-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {scholarships.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
            No scholarships found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            className="btn btn-secondary btn-xs"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn btn-xs ${p === page ? "btn-primary" : "btn-secondary"
                }`}
            >
              {p}
            </button>
          ))}

          <button
            className="btn btn-secondary btn-xs"
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleUpdate}
            className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-lg border border-black/10"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-secondary">
                Edit Scholarship
              </h2>
              <button
                type="button"
                onClick={closeEdit}
                className="text-xs text-slate-500 hover:text-red-500"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Scholarship Name
                </label>
                <input
                  name="scholarship_name"
                  defaultValue={selected.scholarship_name}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  University Name
                </label>
                <input
                  name="university_name"
                  defaultValue={selected.university_name}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Country
                </label>
                <input
                  name="country"
                  defaultValue={selected.country}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  City
                </label>
                <input
                  name="city"
                  defaultValue={selected.city}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Degree
                </label>
                <input
                  name="degree"
                  defaultValue={selected.degree}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Subject Category
                </label>
                <input
                  name="subject_category"
                  defaultValue={selected.subject_category}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Scholarship Category
                </label>
                <input
                  name="scholarship_category"
                  defaultValue={selected.scholarship_category}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Application Fees
                </label>
                <input
                  type="number"
                  name="applicationFees"
                  defaultValue={selected.applicationFees || 0}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Service Charge
                </label>
                <input
                  type="number"
                  name="serviceCharge"
                  defaultValue={selected.serviceCharge || 0}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Tuition Fees
                </label>
                <input
                  type="number"
                  name="tuition_fees"
                  defaultValue={selected.tuition_fees || 0}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  World Rank
                </label>
                <input
                  type="number"
                  name="world_rank"
                  defaultValue={selected.world_rank || 1}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={closeEdit}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ManageScholarships;

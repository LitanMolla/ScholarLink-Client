import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchText.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchText]);

  const { data, isPending, refetch, isFetching } = useQuery({
    queryKey: ["all-users", search, page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  if (isPending) return <LoadingSpinner />;

  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1, limit };

  const pages = [];
  for (let i = 1; i <= (meta.totalPages || 1); i++) pages.push(i);

  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;

    const result = await Swal.fire({
      title: "Change user role?",
      text: `${user.email} → ${newRole}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPublic.patch(`/users/${user._id}`, { role: newRole });
      Swal.fire({
        icon: "success",
        title: "Role updated",
        timer: 1200,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update role", "error");
    }
  };

  const getPhoto = (user) => {
    return (
      user.photoURL ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || user.email
      )}`
    );
  };

  return (
    <section className="py-6 w-full space-y-4">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-secondary">Manage Users</h1>
          <p className="text-xs text-slate-500">
            Total users: {meta.total} {isFetching ? "• updating..." : ""}
          </p>
        </div>

        <div className="w-full sm:w-80">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:bg-white focus:border-primary transition"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block w-full">
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white ">
          <table className="w-full text-xs sm:text-sm ">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 ">
              <tr>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}

              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-t border-slate-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-slate-100 transition`}
                >
                  {/* User with photo */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={getPhoto(user)}
                        alt={user.name || "User"}
                        className="h-9 w-9 rounded-full object-cover border border-slate-300"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || user.email
                          )}`;
                        }}
                      />
                      <span className="font-medium text-secondary">
                        {user?.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-slate-700">{user.email}</td>

                  <td className="px-3 py-3">
                    <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="px-2 py-1 text-xs bg-slate-100 border border-slate-300 rounded-md focus:outline-none"
                    >
                      <option value="Student">Student</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="rounded-xl border border-black/10 bg-white p-4 space-y-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={getPhoto(user)}
                alt={user.name || "User"}
                className="h-10 w-10 rounded-full object-cover border border-slate-300"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || user.email
                  )}`;
                }}
              />

              <div className="flex-1">
                <p className="text-sm font-semibold text-secondary">
                  {user?.name || "N/A"}
                </p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600">
              <span className="font-medium">Role:</span> {user.role}
            </p>

            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user, e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-xs focus:outline-none"
            >
              <option value="Student">Student</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        ))}

        {users.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
            No users found.
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
              className={`btn btn-xs ${p === page ? "btn-primary" : "btn-secondary"}`}
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
    </section>
  );
};

export default ManageUsers;

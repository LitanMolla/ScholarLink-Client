import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import ScholarshipCard from "../../Home/components/ScholarshipCard";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Spinner from "../../../components/Spinner/Spinner";

const AllScholarships = () => {
  const axiosPublic = useAxiosPublic();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [country, setCountry] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 9; // per page

  // 🔹 Main list
  const {
    data: scholarshipsResponse = {},
    isPending,     // first time load
    isError,
    isFetching,    // refetching on search/sort/filter/page change
  } = useQuery({
    queryKey: ["scholarships", searchTerm, category, country, sortBy, currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get("/scholarships", {
        params: {
          search: searchTerm || undefined,
          category: category !== "all" ? category : undefined,
          country: country !== "all" ? country : undefined,
          sortBy,
          page: currentPage,
          limit,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const scholarships = scholarshipsResponse?.data || [];
  const meta = scholarshipsResponse?.meta || {};
  const total = meta.total || scholarships.length;
  const totalPages = meta.totalPages || 1;

  // 🔹 Extra query: dropdown er option er jonno
  const { data: allScholarshipsForFilter = [] } = useQuery({
    queryKey: ["scholarships-filters"],
    queryFn: async () => {
      const res = await axiosPublic.get("/scholarships", {
        params: {
          page: 1,
          limit: 200,
        },
      });
      return res.data?.data || [];
    },
  });

  const uniqueCountries = Array.from(
    new Set(allScholarshipsForFilter.map((s) => s.country).filter(Boolean))
  );

  const uniqueCategories = Array.from(
    new Set(
      allScholarshipsForFilter
        .map((s) => s.scholarship_category)
        .filter(Boolean)
    )
  );

  // ❌ full page loading/return আর করব না
  if (isError) {
    return (
      <section className="py-8 lg:py-12">
        <div className="container">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6">
            <p className="text-sm font-medium text-red-600">
              Something went wrong while loading scholarships.
            </p>
            <p className="text-xs text-red-500 mt-1">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="container space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-secondary">
              All Scholarships
            </h1>
            <p className="text-sm text-slate-600">
              Browse, search, and filter scholarships to find the right match
              for you.
            </p>
          </div>

          {/* Small "updating" hint on refetch */}
          {isFetching && !isPending && (
            <p className="text-[11px] text-slate-500">
              Updating results...
            </p>
          )}
        </div>

        {/* Search + Filters panel */}
        <div className="grid gap-3 rounded-xl border border-black/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          {/* Search */}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-secondary mb-1 block">
              Search by name, university, or degree
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="e.g. Computer Science, Stanford, Masters"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-black/10 bg-slate-50 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300"
              />
            </div>
          </div>

          {/* Scholarship Category */}
          <div>
            <label className="text-xs font-medium text-secondary mb-1 block">
              Scholarship Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-black/10 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="text-xs font-medium text-secondary mb-1 block">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-black/10 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300 cursor-pointer"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort + small meta */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold">{scholarships.length}</span>{" "}
            of <span className="font-semibold">{total}</span> scholarships
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="fee-low">Application Fee (Low → High)</option>
              <option value="fee-high">Application Fee (High → Low)</option>
            </select>
          </div>
        </div>

        {/* Scholarships grid / loading / empty */}
        {isPending ? (
          // 🔹 First time load: শুধু নিচে loader
          <div className="py-10 flex justify-center">
            <Spinner />
          </div>
        ) : scholarships.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-white py-10 text-center">
            <p className="text-sm font-medium text-secondary">
              No scholarships found.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try changing your search or filter options.
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative">
              {/* Optional small overlay when refetching */}
              {isFetching && !isPending && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-lg pointer-events-none"></div>
              )}

              {scholarships.map((sch) => (
                <ScholarshipCard key={sch._id} scholarship={sch} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-md border border-black/10 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed duration-300"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 rounded-md text-xs sm:text-sm flex items-center justify-center border duration-300 ${
                          currentPage === page
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-black/10 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-md border border-black/10 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllScholarships;

import React from "react";
import { data, Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import ScholarshipCard from "../components/ScholarshipCard";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";


const TopScholarships = () => {
  const axiosPublic = useAxiosPublic()
  const { data:top_scholarships=[], isError, isPending } = useQuery({
    queryKey: ['top-scholarships'],
    queryFn: async () => {
      const {data} = await axiosPublic.get('/top-scholarships')
      return data.data
    }
  })
  if (isPending) return <LoadingSpinner/>
  return (
    <section className="py-10 lg:py-14">
      <div className="container space-y-6">
        {/* Section header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-secondary">
              Top Scholarships
            </h2>
            <p className=" text-slate-600">
              A snapshot of highlighted scholarships for you.
            </p>
          </div>
          <Link
            to="/scholarships"
            className=" text-primary hover:underline duration-300"
          >
            View all scholarships
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {top_scholarships?.map((item, i) => (
            <ScholarshipCard key={i} scholarship={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopScholarships;

import React from "react";
import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import ScholarshipCard from "../components/ScholarshipCard";

const dummyScholarships = [
  {
    id: "sch-1",
    title: "Global Excellence Scholarship",
    country: "Canada",
    level: "Undergraduate",
    fee: "$0 Application Fee",
    deadline: "15 Feb 2026",
  },
  {
    id: "sch-2",
    title: "European STEM Talent Grant",
    country: "Germany",
    level: "Masters",
    fee: "$10 Application Fee",
    deadline: "28 Jan 2026",
  },
  {
    id: "sch-3",
    title: "Asia Pacific Merit Scholarship",
    country: "Singapore",
    level: "Undergraduate",
    fee: "$5 Application Fee",
    deadline: "10 Mar 2026",
  },
  {
    id: "sch-4",
    title: "Research Impact Fellowship",
    country: "Netherlands",
    level: "PhD",
    fee: "$0 Application Fee",
    deadline: "05 Feb 2026",
  },
  {
    id: "sch-5",
    title: "Emerging Leaders Award",
    country: "United Kingdom",
    level: "Masters",
    fee: "$15 Application Fee",
    deadline: "20 Feb 2026",
  },
  {
    id: "sch-6",
    title: "Future Innovators Scholarship",
    country: "Australia",
    level: "Undergraduate",
    fee: "$0 Application Fee",
    deadline: "01 Mar 2026",
  },
];

const TopScholarships = () => {
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
          {dummyScholarships.map((item,i) => (
            <ScholarshipCard key={i} scholarship={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopScholarships;

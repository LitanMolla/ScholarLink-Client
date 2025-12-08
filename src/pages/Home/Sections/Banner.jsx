import React from "react";
import { Link } from "react-router";
import { FiSearch } from "react-icons/fi";

const Banner = () => {
  const bgUrl =
    "https://static.vecteezy.com/system/resources/thumbnails/047/373/205/small/high-angle-3d-rendering-graduation-cap-and-diploma-with-golden-tassel-vivid-blue-backdrop-clear-and-defined-realistic-textures-perfect-for-celebratory-themes-spacious-layout-photo.jpeg";

  return (
    <section className="relative flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgUrl}
          alt="Graduation cap and diploma"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      {/* Foreground content */}
      <div className="container relative z-10 py-16">
        <div className="max-w-xl space-y-5">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[11px] font-medium text-slate-100 backdrop-blur">
            🎓 Find scholarships that truly fit you
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white">
            Search, filter & discover  
            <span className="block text-primary">
              the right scholarship for you.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-100/90 max-w-md leading-relaxed">
            Explore verified scholarships worldwide, compare eligibility, and
            apply with confidence — all in one place with ScholarLink.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              to="/scholarships"
              className="btn btn-primary inline-flex items-center gap-2 text-sm px-6 py-3 shadow-lg shadow-black/30 hover:shadow-black/40 duration-300"
            >
              <FiSearch className="text-lg" />
              <span>Search Scholarship</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

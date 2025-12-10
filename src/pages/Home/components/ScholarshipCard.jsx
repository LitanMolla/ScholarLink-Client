import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { Link } from "react-router";

const ScholarshipCard = ({ scholarship }) => {
  const {
    _id,
    scholarship_name,
    university_name,
    image,
    country,
    city,
    subject_category,
    scholarship_category,
    degree,
    tuition_fees,
  } = scholarship || {};

  const handleApply = () => {

  }
  return (
    <div className="flex h-full flex-col rounded-xl border border-black/10 bg-white p-4 hover:border-primary/40 hover:bg-white duration-300">

      {/* Logo + Title */}
      <div className="flex items-center gap-3 mb-4">
        {/* Logo (small rounded image) */}
        <div className="h-12 w-12 rounded-full overflow-hidden border border-black/10">
          <img
            src={image}
            alt={scholarship_name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title + University */}
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-secondary leading-snug line-clamp-2">
            {scholarship_name}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1">
            {university_name}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="space-y-1 text-xs text-slate-600 mb-4">
        <p className="flex items-center gap-1 line-clamp-1">
          <FiMapPin className="text-[13px] text-primary" />
          {city}, {country}
        </p>
        <p>
          <span className="font-medium text-secondary">Degree:</span> {degree}
        </p>
        <p>
          <span className="font-medium text-secondary">Subject:</span>{" "}
          {subject_category}
        </p>
      </div>

      {/* Badge + tuition */}
      <div className="flex items-center justify-between gap-2 text-[11px] mt-auto">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
          {scholarship_category}
        </span>

        <span className="text-slate-600">
          Tuition:{" "}
          <span className="font-semibold text-secondary">
            ${tuition_fees}
          </span>
        </span>
      </div>

      {/* Button */}
      <Link
        to={`/scholarships-details/${_id}`}
        className="btn btn-secondary w-full text-xs sm:text-sm mt-3 inline-flex items-center justify-center gap-2 duration-300"
      >
        View Details
        <FiArrowRight className="text-sm" />
      </Link>
    </div>
  );
};

export default ScholarshipCard;

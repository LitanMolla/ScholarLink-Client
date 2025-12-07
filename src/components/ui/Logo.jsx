import { PiGraduationCapLight } from "react-icons/pi";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-semibold text-secondary hover:opacity-90 transition"
    >
      {/* Icon */}
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <PiGraduationCapLight className="text-xl" />
      </span>

      {/* Brand Name */}
      <span className="text-base lg:text-lg tracking-tight">
        ScholarLink
      </span>
    </Link>
  );
};

export default Logo;

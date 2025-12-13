import { Link, useNavigate } from "react-router";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const Error = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="container flex flex-col items-center justify-center text-center gap-6 py-16">
        {/* Graphic */}
        <div className="relative">
          <h1 className="text-7xl lg:text-9xl font-bold text-purple-600 animate-bounce">404</h1>
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-md">
          <h1 className="text-xl md:text-2xl font-semibold text-secondary">
            Oops! We couldn’t find that page.
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            The page you’re looking for might have been moved, removed,
            renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={handleGoBack}
            className="btn btn-secondary flex items-center justify-center gap-2 text-sm duration-300"
          >
            <FiArrowLeft className="text-sm" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="btn btn-primary flex items-center justify-center gap-2 text-sm duration-300"
          >
            <FiHome className="text-sm" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Small helper text */}
        <p className="text-[11px] text-slate-500 mt-4">
          If you believe this is a mistake, please try refreshing the page or
          return to the homepage.
        </p>
      </div>
    </section>
  );
};

export default Error;

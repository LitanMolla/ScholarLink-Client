import React from "react";
import { PiGraduationCapLight } from "react-icons/pi";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 min-h-screen fixed inset-0 bg-black/20 z-50">
      {/* Spinner with logo */}
      <div className="relative h-12 w-12">
        {/* Outer soft ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>

        {/* Rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>

        {/* Center education logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PiGraduationCapLight className="text-primary text-2xl animate-pulse" />
        </div>
      </div>

      {/* Brand Text */}
      <p className="text-sm font-semibold text-secondary tracking-tight animate-pulse">
        ScholarLink
      </p>
    </div>
  );
};

export default LoadingSpinner;

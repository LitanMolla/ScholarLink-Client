import React from "react";
import { FaQuoteLeft } from "react-icons/fa"; // FIXED ICON

const testimonials = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Undergraduate Student",
    university: "University of Dhaka",
    feedback:
      "ScholarLink helped me quickly find scholarships that matched my profile. The interface is simple and the details are very clear.",
  },
  {
    id: 2,
    name: "Tanvir Ahmed",
    role: "Masters Applicant",
    university: "Technical University of Munich",
    feedback:
      "I could filter scholarships by country and degree level in minutes. It saved me hours of manual searching.",
  },
  {
    id: 3,
    name: "Sara Islam",
    role: "PhD Candidate",
    university: "National University of Singapore",
    feedback:
      "The deadline highlights and clear fee information made it easier to prioritize which scholarships to apply for first.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-secondary">
            What students say about ScholarLink
          </h2>
          <p className="text-sm text-slate-600">
            Real experiences from users discovering scholarships through our platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex h-full flex-col rounded-xl border border-black/10 bg-white p-5 shadow-[0_4px_10px_rgba(15,23,42,0.04)]"
            >
              {/* Quote Icon */}
              <div className="mb-3 text-primary">
                <FaQuoteLeft className="text-xl" />
              </div>

              {/* Feedback */}
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {item.feedback}
              </p>

              {/* User Info */}
              <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col">
                <span className="text-sm font-semibold text-secondary">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {item.role} • {item.university}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;

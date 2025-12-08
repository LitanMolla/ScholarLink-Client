import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="py-14 lg:py-20">
      <div className="container flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

        {/* LEFT — Better, stronger, full section */}
        <div className="w-full lg:w-1/2 space-y-6">
          
          {/* Bigger heading */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-secondary leading-tight">
              Get in Touch  
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              Have questions about scholarships, application requirements, or using ScholarLink?  
              Our support team is here to assist you every step of the way.
            </p>
          </div>

          {/* Additional info line */}
          <p className="text-sm text-slate-500 max-w-md">
            You can reach out via email or phone, or send us a message using the form.  
            We typically respond within <span className="font-medium text-secondary">24 hours</span>.
          </p>

          {/* Contact Items */}
          <div className="space-y-6 pt-2">

            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiMail className="text-xl" />
              </span>
              <div>
                <p className="font-semibold text-secondary text-base">Email</p>
                <p className="text-slate-600 text-sm">support@scholarlink.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiPhone className="text-xl" />
              </span>
              <div>
                <p className="font-semibold text-secondary text-base">Phone</p>
                <p className="text-slate-600 text-sm">+880 1234-567890</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiMapPin className="text-xl" />
              </span>
              <div>
                <p className="font-semibold text-secondary text-base">Location</p>
                <p className="text-slate-600 text-sm">Dhaka, Bangladesh</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT — Contact Form */}
        <div className="w-full lg:w-1/2 rounded-xl border border-black/10 bg-white shadow-sm p-6 md:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Full Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-slate-50 
                           focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-slate-50 
                           focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Subject</label>
              <input
                name="subject"
                placeholder="How can we assist you?"
                required
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-slate-50 
                           focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Message</label>
              <textarea
                name="message"
                rows={4}
                placeholder="Write your message here..."
                required
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-slate-50 resize-none 
                           focus:outline-none focus:ring-2 focus:ring-primary/30 duration-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-sm mt-2 duration-300"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

import React from "react";
import { Link } from "react-router";
import Logo from "../ui/Logo";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-black/10 bg-white">
      <div className="container py-10 flex flex-col gap-8 lg:flex-row lg:justify-between">
        
        {/* Left Section */}
        <div className="flex flex-col gap-3 max-w-xs">
          <Logo />
          <p className="text-sm text-slate-600 leading-relaxed">
            ScholarLink helps students find the right scholarship faster and smarter. 
            Browse verified opportunities and apply with confidence.
          </p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-14">
          
          {/* Main Links */}
          <div>
            <h4 className="text-sm font-semibold text-secondary mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Home</Link></li>
              <li><Link to="/scholarships" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Scholarships</Link></li>
              <li><Link to="/dashboard" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-secondary mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Terms of Use</Link></li>
              <li><Link to="#" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Support</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-secondary mb-3">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Facebook</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary transition duration-300 text-sm">Twitter</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary transition duration-300 text-sm">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-black/10 py-4">
        <p className="container text-center text-[12px] text-slate-500">
          © {new Date().getFullYear()} ScholarLink — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

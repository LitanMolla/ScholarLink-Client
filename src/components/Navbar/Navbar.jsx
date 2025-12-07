import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../ui/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Scholarships", path: "/scholarships" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const linkBaseClasses =
    "block px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const mobileLinkClasses =
    "block w-full text-left px-4 py-2 rounded-md text-sm font-medium";

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur">
      <nav className="container flex items-center justify-between h-16 lg:h-20 gap-4">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${linkBaseClasses} ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary text-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary text-sm">
              Register
            </Link>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 duration-300 cursor-pointer"
          >
            {isOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-2/3 bg-white shadow-xl transition-transform duration-500 lg:hidden flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3.5">
          <Logo />
          <button
            onClick={closeMenu}
            className="inline-flex items-center justify-center cursor-pointer rounded-md p-2 text-slate-600 hover:bg-slate-100 duration-300"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto duration-300">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `${mobileLinkClasses} ${isActive ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"
                } duration-300`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <hr className="my-3 border-slate-200" />

          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="btn btn-secondary w-full text-sm text-center duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="btn btn-primary w-full text-sm text-center duration-300"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="border-t border-black/10 px-4 py-3 text-[11px] text-slate-400">
          © {new Date().getFullYear()} ScholarLink. All rights reserved.
        </div>
      </div>
    </header>

  );
};

export default Navbar;

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import Logo from "../ui/Logo";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, userLogout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Scholarships", path: "/scholarships" },
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const toggleProfileMenu = () => setIsProfileOpen((prev) => !prev);
  const closeProfileMenu = () => setIsProfileOpen(false);

  const openLogoutConfirm = () => setShowLogoutConfirm(true);
  const closeLogoutConfirm = () => setShowLogoutConfirm(false);

  const handleLogout = async () => {
    try {
      await userLogout();
      closeProfileMenu();
      closeMenu();
      closeLogoutConfirm();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const linkBaseClasses =
    "block px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const mobileLinkClasses =
    "block w-full text-left px-4 py-2 rounded-md text-sm font-medium";

  const avatarLetter =
    user?.displayName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur">
        <nav className="container flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Left links */}
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

              {/* Dashboard — only if logged in */}
              {user && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${linkBaseClasses} ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:text-primary"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </div>

            {/* Right side: auth / user */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 pl-1.5 pr-3 text-sm text-secondary hover:border-primary/40 duration-300"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold overflow-hidden">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        avatarLetter
                      )}
                    </span>
                    <span className="hidden md:inline-block max-w-[120px] truncate text-xs font-medium">
                      {user.displayName || user.email}
                    </span>
                    <FiChevronDown className="text-xs text-slate-500" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl border border-black/10 bg-white shadow-lg py-2 text-sm z-50">
                      <div className="px-3 pb-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-secondary truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={closeProfileMenu}
                        className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 text-secondary duration-300"
                      >
                        <FiUser className="text-sm" />
                        <span>Dashboard</span>
                      </Link>

                      <button
                        type="button"
                        onClick={openLogoutConfirm}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50 duration-300"
                      >
                        <FiLogOut className="text-sm" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary text-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile drawer */}
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
            {/* Common links */}
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${mobileLinkClasses} ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-50"
                  } duration-300`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Dashboard — only if logged in */}
            {user && (
              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${mobileLinkClasses} ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-50"
                  } duration-300`
                }
              >
                Dashboard
              </NavLink>
            )}

            <hr className="my-3 border-slate-200" />

            {/* Mobile auth/profile */}
            {user ? (
              <div className="space-y-4">
                {/* profile info */}
                <div className="flex items-center gap-3 px-1">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold overflow-hidden">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-full w-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      avatarLetter
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-secondary">
                      {user.displayName || "User"}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* actions: Dashboard + Logout side-by-side */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-black/10 bg-white px-3 py-2 text-[11px] font-medium text-secondary hover:border-primary/40 hover:bg-primary/5 duration-300"
                  >
                    <FiUser className="text-xs" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    type="button"
                    onClick={openLogoutConfirm}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600 hover:bg-red-100 duration-300"
                  >
                    <FiLogOut className="text-xs" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              // guest buttons same thakbe
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
            )}

          </div>

          <div className="border-t border-black/10 px-4 py-3 text-[11px] text-slate-400">
            © {new Date().getFullYear()} ScholarLink. All rights reserved.
          </div>
        </div>
      </header>

      {/* 🔹 Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-black/10 p-5 sm:p-6 shadow-lg">
            <h3 className="text-sm sm:text-base font-semibold text-secondary mb-1">
              Logout from ScholarLink?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              You will be signed out from your account. You can log in again anytime.
            </p>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={closeLogoutConfirm}
                className="px-3 py-2 rounded-md text-xs sm:text-sm border border-black/10 text-slate-600 hover:bg-slate-50 duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-xs sm:text-sm bg-red-500 text-white hover:bg-red-600 duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

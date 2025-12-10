// src/layouts/DashboardLayout/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiFileText,
  FiStar,
  FiLayers,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/ui/Logo";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const linkBaseClasses =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const iconClasses = "text-[17px]";

  const studentLinks = [
    { to: "/dashboard/my-profile", label: "My Profile", icon: <FiUser className={iconClasses} /> },
    { to: "/dashboard/my-applications", label: "My Applications", icon: <FiFileText className={iconClasses} /> },
    { to: "/dashboard/my-reviews", label: "My Reviews", icon: <FiStar className={iconClasses} /> },
  ];

  const moderatorLinks = [
    { to: "/dashboard/manage-applications", label: "Manage Applications", icon: <FiLayers className={iconClasses} /> },
    { to: "/dashboard/all-reviews", label: "All Reviews", icon: <FiStar className={iconClasses} /> },
  ];

  const adminLinks = [
    { to: "/dashboard/add-scholarship", label: "Add Scholarship", icon: <FiFileText className={iconClasses} /> },
    { to: "/dashboard/manage-scholarships", label: "Manage Scholarships", icon: <FiLayers className={iconClasses} /> },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: <FiUsers className={iconClasses} /> },
    { to: "/dashboard/analytics", label: "Analytics", icon: <FiBarChart2 className={iconClasses} /> },
  ];

  const renderLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={closeSidebar}
      className={({ isActive }) =>
        `${linkBaseClasses} ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-600 hover:bg-slate-100 hover:text-secondary"
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-black/10 bg-white/95 backdrop-blur">
        {/* Brand */}
        <div className="h-16 border-b border-black/10 px-4 flex items-center gap-2">
          <Logo />
          <span className="text-xs font-medium text-slate-500">
            Dashboard
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Back to Home */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Overview
            </p>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBaseClasses} ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-secondary"
                }`
              }
            >
              <FiHome className={iconClasses} />
              <span>Back to Home</span>
            </NavLink>
          </div>

          {/* Student */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Student
            </p>
            <div className="space-y-1">
              {studentLinks.map(renderLink)}
            </div>
          </div>

          {/* Moderator */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Moderator
            </p>
            <div className="space-y-1">
              {moderatorLinks.map(renderLink)}
            </div>
          </div>

          {/* Admin */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Admin
            </p>
            <div className="space-y-1">
              {adminLinks.map(renderLink)}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-black/10 px-4 py-3 text-[11px] text-slate-400">
          © {new Date().getFullYear()} ScholarLink
        </div>
      </aside>

      {/* Sidebar - Mobile (Drawer) */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-black/10 shadow-xl transform transition-transform lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 border-b border-black/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs font-medium text-slate-500">
              Dashboard
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="px-3 py-4 space-y-5 overflow-y-auto">
          {/* Overview */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Overview
            </p>
            <NavLink
              to="/"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `${linkBaseClasses} ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-secondary"
                }`
              }
            >
              <FiHome className={iconClasses} />
              <span>Back to Home</span>
            </NavLink>
          </div>

          {/* Student */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Student
            </p>
            <div className="space-y-1">
              {studentLinks.map(renderLink)}
            </div>
          </div>

          {/* Moderator */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Moderator
            </p>
            <div className="space-y-1">
              {moderatorLinks.map(renderLink)}
            </div>
          </div>

          {/* Admin */}
          <div>
            <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Admin
            </p>
            <div className="space-y-1">
              {adminLinks.map(renderLink)}
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-4 py-3 text-[11px] text-slate-400">
          © {new Date().getFullYear()} ScholarLink
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-black/10 bg-white/80 backdrop-blur flex items-center">
          <div className="container flex items-center justify-between gap-3">
            {/* Left */}
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                <FiMenu className="text-lg" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-secondary">
                  Dashboard
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Manage your profile, applications & reviews
                </p>
              </div>
            </div>

            {/* Right: user mini card */}
            <div className="flex items-center gap-2">
              {user && (
                <>
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold overflow-hidden">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-full w-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      (user.displayName || user.email || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-medium text-secondary max-w-[140px] truncate">
                      {user.displayName || "User"}
                    </span>
                    <span className="text-[10px] text-slate-500 max-w-[160px] truncate">
                      {user.email}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="container py-4 lg:py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-black/10 bg-white/80 backdrop-blur">
          <div className="container py-3 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} ScholarLink. All rights reserved.</span>
            <span className="text-[10px]">
              Built for{" "}
              <span className="font-semibold text-secondary">Student · Moderator · Admin</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

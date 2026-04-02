import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  BellIcon,
  BudgetIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DashboardIcon,
  LogoutIcon,
  MenuIcon,
  ProfileIcon,
  ReportsIcon,
  SearchIcon,
  SettingsIcon,
  SparkleIcon,
  TransactionIcon,
} from "./Icons";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", Icon: DashboardIcon },
  { to: "/transactions", label: "Transactions", Icon: TransactionIcon },
  { to: "/reports", label: "Reports", Icon: ReportsIcon },
  { to: "/budget", label: "Budget", Icon: BudgetIcon },
  { to: "/profile", label: "Profile", Icon: ProfileIcon },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("pref_sidebar_collapsed") === "1"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("pref_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    const syncPreference = () => {
      setCollapsed(localStorage.getItem("pref_sidebar_collapsed") === "1");
    };

    window.addEventListener("preferences-changed", syncPreference);
    return () => window.removeEventListener("preferences-changed", syncPreference);
  }, []);

  const currentPage = useMemo(
    () => NAV_ITEMS.find((item) => item.to === location.pathname) || NAV_ITEMS[0],
    [location.pathname]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <div
      className={`app-shell${collapsed ? " sidebar-collapsed" : ""}${
        mobileOpen ? " sidebar-mobile-open" : ""
      }`}
    >
      <aside className="app-sidebar glass-flat" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <SparkleIcon size={16} />
          </div>

          {!collapsed && (
            <div className="brand-text">
              <p>ExpenseTracker</p>
              <span>Daily Expense Log</span>
            </div>
          )}

          <button
            type="button"
            className="icon-btn desktop-only"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const NavIcon = item.Icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nav-item${isActive ? " is-active" : ""}${collapsed ? " is-collapsed" : ""}`
                }
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon-wrap">
                  <NavIcon size={17} />
                </span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-chip">
            <div className="avatar-glow">{userInitial}</div>
            {!collapsed && (
              <div className="profile-chip-text">
                <strong>{user?.name || "User"}</strong>
                <span>{user?.email || "account"}</span>
              </div>
            )}
          </div>

          <button type="button" className="btn-danger ghost-action" onClick={handleLogout}>
            <LogoutIcon size={15} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="app-body">
        <header className="app-topbar glass-flat">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-btn mobile-only"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon size={18} />
            </button>

            <div className="topbar-titles">
              <p className="eyebrow">Expense Tracker</p>
              <h2>{currentPage.label}</h2>
            </div>
          </div>

          <div className="topbar-right">
            <div className="search-glass">
              <SearchIcon size={14} />
              <span>Search pages, transactions, reports...</span>
            </div>
            <button type="button" className="icon-btn" aria-label="Notifications">
              <BellIcon size={16} />
            </button>
          </div>
        </header>

        <main className="app-main">
          <div className="app-main-inner">
            <Outlet />
          </div>
        </main>
      </div>

      <button
        type="button"
        className="sidebar-overlay"
        onClick={() => setMobileOpen(false)}
        aria-label="Close menu"
      />
    </div>
  );
}

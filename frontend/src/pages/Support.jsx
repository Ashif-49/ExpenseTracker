import React from "react";
import { Link } from "react-router-dom";
import { SparkleIcon, MailIcon, TransactionIcon } from "../components/Icons";

export default function Support() {
  return (
    <div className="auth-screen">
      <div className="glass-card fade-up" style={{ maxWidth: 800, width: "100%", padding: 40 }}>
        <header className="page-head">
          <div>
            <div className="auth-logo" style={{ marginBottom: 20 }}>
              <span className="auth-logo-mark">
                <SparkleIcon size={16} />
              </span>
              <strong>ExpenseTracker</strong>
            </div>
            <h1 className="page-title">Help & Support</h1>
            <p className="page-subtitle">We're here to help you manage your finances.</p>
          </div>
          <Link to="/login" className="btn-secondary">
            Back to Login
          </Link>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 40 }}>
          <div className="glass-card" style={{ padding: 24, background: "rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
              <div className="auth-feature-icon" style={{ background: "rgba(0, 255, 255, 0.1)", borderColor: "rgba(0, 255, 255, 0.3)" }}>
                <MailIcon size={16} />
              </div>
              <h3 style={{ color: "var(--text-strong)" }}>Contact Us</h3>
            </div>
            <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: 16 }}>
              Need assistance with your account? Our support team is available via email to help you.
            </p>
            <a href="mailto:support@expensetracker.com" className="btn-ghost" style={{ width: "100%" }}>
              Email Support
            </a>
          </div>

          <div className="glass-card" style={{ padding: 24, background: "rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
              <div className="auth-feature-icon" style={{ background: "rgba(168, 132, 255, 0.1)", borderColor: "rgba(168, 132, 255, 0.3)" }}>
                <TransactionIcon size={16} />
              </div>
              <h3 style={{ color: "var(--text-strong)" }}>FAQs</h3>
            </div>
            <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: 16 }}>
              Find quick answers to common questions about tracking, reporting, and account security.
            </p>
            <button className="btn-secondary" style={{ width: "100%" }}>
              Browse Topics
            </button>
          </div>
        </section>

        <footer style={{ marginTop: 60, pt: 20, borderTop: "1px solid var(--glass-border-soft)", textAlign: "center" }}>
          <p className="field-hint">© 2026 ExpenseTracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

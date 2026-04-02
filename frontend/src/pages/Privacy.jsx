import React from "react";
import { Link } from "react-router-dom";
import { SparkleIcon } from "../components/Icons";

export default function Privacy() {
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
            <h1 className="page-title">Privacy Policy</h1>
            <p className="page-subtitle">Last updated: April 1, 2026</p>
          </div>
          <Link to="/login" className="btn-secondary">
            Back to Login
          </Link>
        </header>

        <section style={{ display: "grid", gap: 24, marginTop: 40, lineHeight: 1.6 }}>
          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>1. Data Collection</h3>
            <p>
              We collect your name and email address to create and manage your personal expense tracking workspace. 
              All financial data you enter is stored securely and is only accessible by you.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>2. Data Usage</h3>
            <p>
              Your data is used solely to provide the ExpenseTracker service. We do not sell your personal or 
              financial information to third parties. We use industry-standard encryption to protect your data 
              both in transit and at rest.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>3. Security</h3>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. 
              Your account is protected by JWT (JSON Web Tokens) for secure session management.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>4. Contact Us</h3>
            <p>
              If you have any questions regarding this privacy policy, you can contact our support team.
            </p>
          </div>
        </section>

        <footer style={{ marginTop: 60, pt: 20, borderTop: "1px solid var(--glass-border-soft)", textAlign: "center" }}>
          <p className="field-hint">© 2026 ExpenseTracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

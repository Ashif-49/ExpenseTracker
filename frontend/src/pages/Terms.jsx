import React from "react";
import { Link } from "react-router-dom";
import { SparkleIcon } from "../components/Icons";

export default function Terms() {
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
            <h1 className="page-title">Terms of Service</h1>
            <p className="page-subtitle">Last updated: April 1, 2026</p>
          </div>
          <Link to="/login" className="btn-secondary">
            Back to Login
          </Link>
        </header>

        <section style={{ display: "grid", gap: 24, marginTop: 40, lineHeight: 1.6 }}>
          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>1. Agreement to Terms</h3>
            <p>
              By accessing ExpenseTracker, you agree to these Terms of Service. If you do not agree with any 
              part of these terms, you are prohibited from using the service.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>2. Use License</h3>
            <p>
              Permission is granted to use ExpenseTracker for personal or business bookkeeping. You shall 
              not attempt to decompile or reverse engineer any software contained in the application.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>3. Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for 
              all activities that occur under your account. ExpenseTracker cannot and will not be liable 
              for any loss or damage arising from your failure to comply with this security obligation.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--text-strong)", marginBottom: 12 }}>4. Limitation of Liability</h3>
            <p>
              ExpenseTracker shall not be liable for any damages arising out of the use or inability to use 
              the materials on our website.
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

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { INTRO_REPLAY_EVENT } from "../constants/intro";
import {
  DashboardIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  ReportsIcon,
  SparkleIcon,
  TransactionIcon,
} from "../components/Icons";

const FEATURES = [
  {
    title: "Smart Dashboard",
    text: "See totals, trends, and spending signals in one clear control panel.",
    Icon: DashboardIcon,
  },
  {
    title: "Instant Tracking",
    text: "Log income and expenses with polished workflows and clean categorization.",
    Icon: TransactionIcon,
  },
  {
    title: "Visual Reports",
    text: "Monitor category trends and monthly insights through high-readability analytics.",
    Icon: ReportsIcon,
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("remembered_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Use a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email, password);

      if (remember) {
        localStorage.setItem("remembered_email", email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      window.dispatchEvent(new Event(INTRO_REPLAY_EVENT));
      navigate("/");
    } catch (error) {
      setApiError(error.response?.data?.message || "Invalid email or password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-grid fade-up">
        <section className="auth-hero">
          <div>
            <span className="chip chip-cyan">Expense Tracking</span>
            <h1 style={{ marginTop: 14 }}>
              Track every <span className="auth-highlight">rupee</span> with a clean dashboard
            </h1>
            <p style={{ marginTop: 14 }}>
              Simple, minimal, and distraction-free. ExpenseTracker keeps your daily transactions organized and easy
              to review.
            </p>
          </div>

          <div className="list-stack">
            {FEATURES.map((feature) => (
              <article className="auth-feature" key={feature.title}>
                <div className="auth-feature-icon">
                  <feature.Icon size={16} />
                </div>
                <div>
                  <strong style={{ display: "block", color: "var(--text-strong)", marginBottom: 4 }}>
                    {feature.title}
                  </strong>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-mark">
              <SparkleIcon size={16} />
            </span>
            <div>
              <strong>ExpenseTracker</strong>
              <span>Secure Sign In</span>
            </div>
          </div>

          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue with your expense workspace.</p>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-with-icon">
                <MailIcon size={14} />
                <input
                  id="email"
                  className="input-glass"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="you@example.com"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                    setApiError("");
                  }}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="field">
              <div className="form-inline">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <span className="field-hint">Minimum 6 characters</span>
              </div>
              <div className="input-with-icon input-with-action">
                <LockIcon size={14} />
                <input
                  id="password"
                  className="input-glass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                    setApiError("");
                  }}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-inline" style={{ marginTop: 2 }}>
              <label className="checkbox-row" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Remember email
              </label>

              <span className="field-hint">Protected by JWT session</span>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="divider" />

          <p className="auth-footer">
            New to ExpenseTracker? <Link to="/register">Create account</Link>
          </p>

          <div className="auth-links">
            <Link to="/privacy">Privacy</Link>
            {" | "}
            <Link to="/terms">Terms</Link>
            {" | "}
            <Link to="/support">Support</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

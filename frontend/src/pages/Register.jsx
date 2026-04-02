import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LockIcon, MailIcon, ProfileIcon, SparkleIcon } from "../components/Icons";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!form.password) return "";
    if (form.password.length < 6) return "Weak";
    if (form.password.length < 10) return "Medium";
    return "Strong";
  }, [form.password]);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirm) {
      nextErrors.confirm = "Confirm your password";
    } else if (form.confirm !== form.password) {
      nextErrors.confirm = "Passwords do not match";
    }

    return nextErrors;
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/login");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to create account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-grid fade-up">
        <section className="auth-hero">
          <div>
            <span className="chip chip-purple">Create Your Space</span>
            <h1 style={{ marginTop: 14 }}>
              Build your <span className="auth-highlight">personal expense workspace</span> in seconds
            </h1>
            <p style={{ marginTop: 14 }}>
              Start with a clean dashboard, align your budgeting workflow, and manage all expenses in one place from
              day one.
            </p>
          </div>

          <div className="list-stack">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <SparkleIcon size={16} />
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--text-strong)", marginBottom: 4 }}>Unified Design</strong>
                <p>Glassmorphism components and smooth interactions across every screen.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <ProfileIcon size={16} />
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--text-strong)", marginBottom: 4 }}>
                  Personal Workspace
                </strong>
                <p>Set preferences once and keep your whole dashboard experience consistent.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-mark">
              <SparkleIcon size={16} />
            </span>
            <div>
              <strong>ExpenseTracker</strong>
              <span>New Account</span>
            </div>
          </div>

          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Create your account and start tracking expenses.</p>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="name">
                Full Name
              </label>
              <div className="input-with-icon">
                <ProfileIcon size={14} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input-glass"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={onChange}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-with-icon">
                <MailIcon size={14} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input-glass"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="input-with-icon">
                <LockIcon size={14} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input-glass"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={onChange}
                />
              </div>
              <span className="field-hint">Strength: {passwordStrength || "Not set"}</span>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="confirm">
                Confirm Password
              </label>
              <div className="input-with-icon">
                <LockIcon size={14} />
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  className="input-glass"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={onChange}
                />
              </div>
              {errors.confirm && <span className="error-text">{errors.confirm}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="divider" />

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
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

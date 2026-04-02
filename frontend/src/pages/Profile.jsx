import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LockIcon, MailIcon, ProfileIcon, SettingsIcon } from "../components/Icons";
import api from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [nameMessage, setNameMessage] = useState(null);
  const [savingName, setSavingName] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const updateName = async (event) => {
    event.preventDefault();
    setNameMessage(null);
    setSavingName(true);

    try {
      await api.put("/user/profile", { name });

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.name = name;
      localStorage.setItem("user", JSON.stringify(stored));

      setNameMessage({ type: "success", text: "Name updated. Reload to reflect it in all sections." });
    } catch (error) {
      setNameMessage({ type: "error", text: error.response?.data?.message || "Failed to update name." });
    } finally {
      setSavingName(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    if (passwordForm.next.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    setSavingPassword(true);

    try {
      await api.put("/user/password", {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });

      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setPasswordForm({ current: "", next: "", confirm: "" });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to update password. Check current password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="section-grid">
      <header className="page-head fade-up">
        <div>
          <span className="chip chip-cyan">Profile</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Account Center
          </h1>
          <p className="page-subtitle">Manage identity, credentials, and access preferences from one place.</p>
        </div>
      </header>

      <section className="two-col fade-up">
        <article className="glass-card" style={{ padding: 20, display: "grid", gap: 16 }}>
          <div className="inline-split" style={{ alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar-glow" style={{ width: 48, height: 48, borderRadius: 14 }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>{user?.name}</h3>
                <p className="field-hint">{user?.email}</p>
              </div>
            </div>
            <span className="badge badge-muted">Member</span>
          </div>

          {nameMessage && (
            <div className={`alert ${nameMessage.type === "success" ? "alert-success" : "alert-error"}`}>
              {nameMessage.text}
            </div>
          )}

          <form className="section-grid" onSubmit={updateName}>
            <div className="field">
              <label className="field-label" htmlFor="profile-name">
                Full Name
              </label>
              <div className="input-with-icon">
                <ProfileIcon size={14} />
                <input
                  id="profile-name"
                  type="text"
                  className="input-glass"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="profile-email">
                Email Address
              </label>
              <div className="input-with-icon">
                <MailIcon size={14} />
                <input id="profile-email" type="email" className="input-glass" value={user?.email || ""} disabled />
              </div>
              <span className="field-hint">Email updates are locked for security.</span>
            </div>

            <button className="btn-primary" type="submit" disabled={savingName}>
              {savingName ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </article>

        <article className="glass-card" style={{ padding: 20, display: "grid", gap: 16 }}>
          <div className="inline-split">
            <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>Security</h3>
            <span className="chip chip-purple">
              <SettingsIcon size={12} />
              Credentials
            </span>
          </div>

          {passwordMessage && (
            <div className={`alert ${passwordMessage.type === "success" ? "alert-success" : "alert-error"}`}>
              {passwordMessage.text}
            </div>
          )}

          <form className="section-grid" onSubmit={updatePassword}>
            <div className="field">
              <label className="field-label" htmlFor="current-password">
                Current Password
              </label>
              <div className="input-with-icon">
                <LockIcon size={14} />
                <input
                  id="current-password"
                  type="password"
                  className="input-glass"
                  value={passwordForm.current}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="next-password">
                New Password
              </label>
              <div className="input-with-icon">
                <LockIcon size={14} />
                <input
                  id="next-password"
                  type="password"
                  className="input-glass"
                  value={passwordForm.next}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div className="input-with-icon">
                <LockIcon size={14} />
                <input
                  id="confirm-password"
                  type="password"
                  className="input-glass"
                  value={passwordForm.confirm}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
                  required
                />
              </div>
            </div>

            <button className="btn-secondary" type="submit" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="divider" />

          <button className="btn-danger" onClick={signOut}>
            Sign Out
          </button>
        </article>
      </section>
    </div>
  );
}

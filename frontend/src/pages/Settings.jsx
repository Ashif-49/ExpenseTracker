import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { BellIcon, LogoutIcon, SettingsIcon, SparkleIcon } from "../components/Icons";
import { INTRO_REPLAY_EVENT } from "../constants/intro";

const SETTINGS_KEY = "expense_tracker_preferences_v1";

function readSettings() {
  try {
    return (
      JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
        reducedMotion: false,
        denseMode: false,
        collapseSidebarByDefault: false,
        emailAlerts: true,
        weeklyDigest: true,
        budgetWarnings: true,
        marketingUpdates: false,
        sessionTimeout: "30",
      }
    );
  } catch {
    return {
      reducedMotion: false,
      denseMode: false,
      collapseSidebarByDefault: false,
      emailAlerts: true,
      weeklyDigest: true,
      budgetWarnings: true,
      marketingUpdates: false,
      sessionTimeout: "30",
    };
  }
}

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    document.body.classList.toggle("reduced-motion", settings.reducedMotion);
    document.body.classList.toggle("dense-mode", settings.denseMode);

    localStorage.setItem("pref_sidebar_collapsed", settings.collapseSidebarByDefault ? "1" : "0");
    window.dispatchEvent(new Event("preferences-changed"));
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const signOutEverywhere = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  const replayIntro = () => {
    window.dispatchEvent(new Event(INTRO_REPLAY_EVENT));
    navigate("/");
  };

  return (
    <div className="section-grid">
      <header className="page-head fade-up">
        <div>
          <span className="chip chip-cyan">Settings</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Experience Controls
          </h1>
          <p className="page-subtitle">Customize interface behavior, alerts, and session defaults across the app.</p>
        </div>
      </header>

      <section className="two-col fade-up">
        <article className="glass-card" style={{ padding: 20 }}>
          <div className="inline-split" style={{ marginBottom: 10 }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>Appearance</h3>
            <span className="chip chip-purple">
              <SparkleIcon size={12} />
              UI/UX
            </span>
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Reduce Motion</strong>
              <span>Disable ambient particles and floating transitions.</span>
            </div>
            <button
              className={`switch${settings.reducedMotion ? " is-on" : ""}`}
              onClick={() => toggle("reducedMotion")}
              aria-label="Toggle reduced motion"
              type="button"
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Compact Density</strong>
              <span>Use tighter spacing for data-heavy workflows.</span>
            </div>
            <button
              className={`switch${settings.denseMode ? " is-on" : ""}`}
              onClick={() => toggle("denseMode")}
              aria-label="Toggle compact density"
              type="button"
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Collapse Sidebar by Default</strong>
              <span>Start each session with compact navigation.</span>
            </div>
            <button
              className={`switch${settings.collapseSidebarByDefault ? " is-on" : ""}`}
              onClick={() => toggle("collapseSidebarByDefault")}
              aria-label="Toggle sidebar preference"
              type="button"
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Replay Intro</strong>
              <span>Play the launch animation again and return to dashboard.</span>
            </div>
            <button className="btn-secondary" onClick={replayIntro} type="button">
              Replay
            </button>
          </div>
        </article>

        <article className="glass-card" style={{ padding: 20 }}>
          <div className="inline-split" style={{ marginBottom: 10 }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>Notifications</h3>
            <span className="chip chip-cyan">
              <BellIcon size={12} />
              Alerts
            </span>
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Email Alerts</strong>
              <span>Receive account updates and security notices by email.</span>
            </div>
            <button
              className={`switch${settings.emailAlerts ? " is-on" : ""}`}
              onClick={() => toggle("emailAlerts")}
              aria-label="Toggle email alerts"
              type="button"
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Weekly Digest</strong>
              <span>Get weekly summary of income, expenses, and trends.</span>
            </div>
            <button
              className={`switch${settings.weeklyDigest ? " is-on" : ""}`}
              onClick={() => toggle("weeklyDigest")}
              aria-label="Toggle weekly digest"
              type="button"
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Budget Warnings</strong>
              <span>Show threshold warnings when spending is near limits.</span>
            </div>
            <button
              className={`switch${settings.budgetWarnings ? " is-on" : ""}`}
              onClick={() => toggle("budgetWarnings")}
              aria-label="Toggle budget warnings"
              type="button"
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-copy">
              <strong>Product Updates</strong>
              <span>Get occasional product announcements and new feature notes.</span>
            </div>
            <button
              className={`switch${settings.marketingUpdates ? " is-on" : ""}`}
              onClick={() => toggle("marketingUpdates")}
              aria-label="Toggle product updates"
              type="button"
            />
          </div>
        </article>
      </section>

      <section className="two-col fade-up">
        <article className="glass-card" style={{ padding: 20, display: "grid", gap: 14 }}>
          <div className="inline-split">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>Session</h3>
            <span className="chip chip-purple">
              <SettingsIcon size={12} />
              Security
            </span>
          </div>

          <div className="field" style={{ maxWidth: 240 }}>
            <label className="field-label" htmlFor="session-timeout">
              Auto Logout (minutes)
            </label>
            <select
              id="session-timeout"
              className="select-glass"
              value={settings.sessionTimeout}
              onChange={(event) => setSettings((prev) => ({ ...prev, sessionTimeout: event.target.value }))}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="120">120</option>
            </select>
            <span className="field-hint">Stored locally as a preference for future session policy integration.</span>
          </div>

          <div className="alert alert-info" style={{ marginBottom: 0 }}>
            Settings are saved automatically and applied instantly across your interface.
          </div>
        </article>

        <article className="glass-card" style={{ padding: 20, display: "grid", gap: 12 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>Danger Zone</h3>
          <p className="page-subtitle">
            Sign out now and clear active credentials from this browser session.
          </p>

          <button className="btn-danger" onClick={signOutEverywhere}>
            <LogoutIcon size={14} />
            Sign Out Everywhere
          </button>
        </article>
      </section>
    </div>
  );
}

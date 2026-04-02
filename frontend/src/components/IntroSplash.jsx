import React, { useEffect, useState } from "react";
import { INTRO_REPLAY_EVENT } from "../constants/intro";
import introLogo from "../assets/expensetracker-logo-optimized.jpg";

const INTRO_HOLD_MS = 2800;
const INTRO_EXIT_MS = 820;
const REDUCED_HOLD_MS = 420;
const REDUCED_EXIT_MS = 240;

function useReducedMotion() {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setIsReduced(document.body.classList.contains("reduced-motion") || media.matches);
    };

    sync();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }

    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  return isReduced;
}

export default function IntroSplash({ children }) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const restartIntro = () => {
      setPhase("enter");
    };

    window.addEventListener(INTRO_REPLAY_EVENT, restartIntro);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, restartIntro);
  }, []);

  useEffect(() => {
    if (phase !== "enter") {
      return undefined;
    }

    const holdMs = reducedMotion ? REDUCED_HOLD_MS : INTRO_HOLD_MS;
    const exitTimer = window.setTimeout(() => setPhase("exit"), holdMs);

    return () => {
      window.clearTimeout(exitTimer);
    };
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "exit") {
      return undefined;
    }

    const exitMs = reducedMotion ? REDUCED_EXIT_MS : INTRO_EXIT_MS;
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
    }, exitMs);

    return () => {
      window.clearTimeout(doneTimer);
    };
  }, [phase, reducedMotion]);

  const isActive = phase !== "done";
  const isExiting = phase === "exit";

  return (
    <div className={`intro-transition${isActive ? " is-active" : ""}${isExiting ? " is-exiting" : ""}`}>
      <div className="intro-reveal">{children}</div>

      {isActive && (
        <section className={`intro-splash${isExiting ? " is-exiting" : ""}`} aria-label="Application intro">
          <div className="intro-ambient intro-ambient-left" />
          <div className="intro-ambient intro-ambient-right" />
          <div className="intro-particles" />
          <div className="intro-transition-glow" />

          <div className="intro-panel glass-flat">
            <div className="intro-logo-ring">
              <img className="intro-logo-image" src={introLogo} alt="ExpenseTracker logo" />
              <span className="intro-spark intro-spark-1" />
              <span className="intro-spark intro-spark-2" />
              <span className="intro-spark intro-spark-3" />
              <span className="intro-spark intro-spark-4" />
              <span className="intro-spark intro-spark-5" />
            </div>

            <h1>ExpenseTracker</h1>
            <p className="intro-subtitle">Daily Expense Log</p>
            <p className="intro-tagline">Track smarter. Spend better.</p>

            <div className="intro-loader" role="presentation" aria-hidden="true">
              <span className="intro-loader-fill" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

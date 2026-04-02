import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { NotificationProvider } from "./context/NotificationContext";
import IntroSplash from "./components/IntroSplash";
import NotificationBar from "./components/NotificationBar";

const Layout = lazy(() => import("./components/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Reports = lazy(() => import("./pages/Reports"));
const Budget = lazy(() => import("./pages/Budget"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Support = lazy(() => import("./pages/Support"));

const PREFERENCES_KEY = "expense_tracker_preferences_v1";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

function RouteLoader() {
  return (
    <section className="loading-panel">
      <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <span className="chip chip-cyan">Loading</span>
        <div className="loading-pulse" />
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}");
      document.body.classList.toggle("reduced-motion", Boolean(settings.reducedMotion));
      document.body.classList.toggle("dense-mode", Boolean(settings.denseMode));
    } catch {
      document.body.classList.remove("reduced-motion");
      document.body.classList.remove("dense-mode");
    }
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <NotificationBar />
          <IntroSplash>
            <Routes>
              <Route
              path="/login"
              element={
                <PublicRoute>
                  <Suspense fallback={<RouteLoader />}>
                    <Login />
                  </Suspense>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Suspense fallback={<RouteLoader />}>
                    <Register />
                  </Suspense>
                </PublicRoute>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <Privacy />
                </Suspense>
              }
            />
            <Route
              path="/terms"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <Terms />
                </Suspense>
              }
            />
            <Route
              path="/support"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <Support />
                </Suspense>
              }
            />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Suspense fallback={<RouteLoader />}>
                    <Layout />
                  </Suspense>
                </PrivateRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="transactions"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Transactions />
                  </Suspense>
                }
              />
              <Route
                path="reports"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Reports />
                  </Suspense>
                }
              />
              <Route
                path="budget"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Budget />
                  </Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Profile />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Settings />
                  </Suspense>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IntroSplash>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

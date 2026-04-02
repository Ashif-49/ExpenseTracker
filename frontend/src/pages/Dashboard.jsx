import React, { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { dashboardAPI, transactionAPI } from "../services/api";
import { useAuth } from "../context/useAuth";
import { useNotification } from "../context/NotificationContext";
import { BudgetIcon, DashboardIcon, ReportsIcon, TransactionIcon } from "../components/Icons";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const salaryAlertFired = useRef(false);

  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getSummary(), transactionAPI.getAll()])
      .then(([summaryResponse, transactionResponse]) => {
        setSummary(summaryResponse.data);
        setRecent(transactionResponse.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  const parsed = useMemo(() => {
    const income = Number(summary?.totalIncome || 0);
    const expenses = Number(summary?.totalExpenses || 0);
    const balance = Number(summary?.balance || 0);
    const transactionCount = Number(summary?.transactionCount || 0);
    const spentPercent = income > 0 ? Math.min(100, Math.round((expenses / income) * 100)) : 0;
    const savingsPercent = income > 0 ? Math.max(0, Math.round((balance / income) * 100)) : 0;

    return {
      income,
      expenses,
      balance,
      transactionCount,
      spentPercent,
      savingsPercent,
    };
  }, [summary]);

  // Fire notification when expenses reach 90% of income (salary)
  useEffect(() => {
    if (!loading && parsed.income > 0 && !salaryAlertFired.current) {
      if (parsed.spentPercent >= 90) {
        addNotification(
          `⚡ You've spent ${parsed.spentPercent}% of your income! Only ${currency(parsed.income - parsed.expenses)} remaining. Consider reviewing your budget.`,
          "danger"
        );
        salaryAlertFired.current = true;
      } else if (parsed.spentPercent >= 75) {
        addNotification(
          `You've used ${parsed.spentPercent}% of your income. Keep an eye on your spending.`,
          "warning"
        );
        salaryAlertFired.current = true;
      }
    }
  }, [loading, parsed, addNotification]);

  if (loading) {
    return (
      <section className="loading-panel">
        <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
          <span className="chip chip-cyan">Loading Dashboard</span>
          <div className="loading-pulse" />
        </div>
      </section>
    );
  }

  const cards = [
    {
      title: "Net Balance",
      value: currency(parsed.balance),
      note: `${parsed.savingsPercent}% savings rate`,
      color: parsed.balance >= 0 ? "var(--success)" : "var(--danger)",
      Icon: DashboardIcon,
    },
    {
      title: "Total Income",
      value: currency(parsed.income),
      note: "All-time credited amount",
      color: "var(--success)",
      Icon: BudgetIcon,
    },
    {
      title: "Total Expenses",
      value: currency(parsed.expenses),
      note: "All-time outgoing amount",
      color: "var(--danger)",
      Icon: TransactionIcon,
    },
    {
      title: "Transactions",
      value: String(parsed.transactionCount),
      note: "Total records in your ledger",
      color: "#a4dfff",
      Icon: ReportsIcon,
    },
  ];

  return (
    <div className="section-grid">
      <header className="page-head fade-up">
        <div>
          <span className="chip chip-cyan">Dashboard</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Welcome, {user?.name || "there"}
          </h1>
          <p className="page-subtitle">Your spending pulse and trends in one clear workspace.</p>
        </div>

        <div className="page-actions">
          <button className="btn-secondary" onClick={() => navigate("/reports")}>
            Open Reports
          </button>
          <button className="btn-primary" onClick={() => navigate("/transactions")}>
            Add Transaction
          </button>
        </div>
      </header>

      <section className="four-col fade-up">
        {cards.map((card, index) => (
          <article
            className="glass-card metric-card ambient-float"
            key={card.title}
            style={{ animationDelay: `${index * 0.24}s` }}
          >
            <div className="metric-top">
              <span className="eyebrow">{card.title}</span>
              <span style={{ color: card.color }}>
                <card.Icon size={16} />
              </span>
            </div>
            <strong className="metric-value" style={{ color: card.color }}>
              {card.value}
            </strong>
            <span className="metric-note">{card.note}</span>
          </article>
        ))}
      </section>

      <section className="two-col fade-up">
        <article className="glass-card" style={{ padding: 20, display: "grid", gap: 14 }}>
          <div className="inline-split">
            <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>Budget Health</h3>
            <span className="chip chip-purple">{parsed.spentPercent}% spent</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${parsed.spentPercent}%`,
                background:
                  parsed.spentPercent > 90
                    ? "linear-gradient(90deg, rgba(255,93,125,.8), rgba(255,136,158,.95))"
                    : parsed.spentPercent > 70
                      ? "linear-gradient(90deg, rgba(255,203,111,.84), rgba(162,120,255,.9))"
                      : "linear-gradient(90deg, rgba(57,247,203,.85), rgba(0,255,255,.72))",
              }}
            />
          </div>

          <div className="inline-split">
            <span className="text-success mono">Income: {currency(parsed.income)}</span>
            <span className="text-danger mono">Expenses: {currency(parsed.expenses)}</span>
          </div>

          <p className="page-subtitle" style={{ marginTop: 2 }}>
            Keep this bar below 75% to maintain healthier monthly savings.
          </p>
        </article>

        <article className="glass-card" style={{ padding: 20, display: "grid", gap: 12 }}>
          <div className="inline-split">
            <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>Quick Insights</h3>
            <button className="btn-ghost" onClick={() => navigate("/budget")}>
              Budget Page
            </button>
          </div>

          <div className="list-stack">
            <div className="list-item">
              <div>
                <strong>Cash Flow</strong>
                <p className="field-hint">Difference between total income and total expenses</p>
              </div>
              <span className={parsed.balance >= 0 ? "text-success mono" : "text-danger mono"}>
                {parsed.balance >= 0 ? "+" : ""}
                {currency(parsed.balance)}
              </span>
            </div>

            <div className="list-item">
              <div>
                <strong>Spending Intensity</strong>
                <p className="field-hint">Based on monthly expense-to-income ratio</p>
              </div>
              <span
                className={
                  parsed.spentPercent >= 90
                    ? "text-danger"
                    : parsed.spentPercent >= 70
                      ? "text-warning"
                      : "text-success"
                }
              >
                {parsed.spentPercent >= 90 ? "High" : parsed.spentPercent >= 70 ? "Moderate" : "Healthy"}
              </span>
            </div>

            <div className="list-item">
              <div>
                <strong>Records Logged</strong>
                <p className="field-hint">Total transaction entries tracked so far</p>
              </div>
              <span className="mono">{parsed.transactionCount}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="glass-card fade-up" style={{ padding: 0 }}>
        <div className="inline-split" style={{ padding: 18 }}>
          <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>Recent Transactions</h3>
          <button className="btn-secondary" onClick={() => navigate("/transactions")}>
            View All
          </button>
        </div>

        <div className="data-shell">
          {recent.length === 0 ? (
            <div className="table-empty">No transactions yet. Add your first record to start tracking.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id}>
                    <td className="mono" style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>
                      {format(new Date(item.date), "MMM dd, yyyy")}
                    </td>
                    <td style={{ color: "var(--text-strong)" }}>{item.description || "-"}</td>
                    <td>
                      <span className="badge badge-muted">{item.category}</span>
                    </td>
                    <td>
                      <span className={item.type === "INCOME" ? "badge badge-income" : "badge badge-expense"}>
                        {item.type}
                      </span>
                    </td>
                    <td className={`amount ${item.type === "INCOME" ? "text-success" : "text-danger"}`}>
                      {item.type === "INCOME" ? "+" : "-"}
                      {currency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

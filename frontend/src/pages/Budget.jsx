import React, { useEffect, useMemo, useState } from "react";
import { transactionAPI } from "../services/api";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Others"];
const BUDGET_STORAGE_KEY = "expense_tracker_budgets_v3";
const SALARY_STORAGE_KEY = "expense_tracker_monthly_salary_v1";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const normalizeCategory = (value) => String(value || "").trim().toLowerCase();

function readStoredObject(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getCurrentMonthContext() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const lastDay = String(new Date(year, now.getMonth() + 1, 0).getDate()).padStart(2, "0");

  return {
    key: `${year}-${month}`,
    from: `${year}-${month}-01`,
    to: `${year}-${month}-${lastDay}`,
    label: new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(now),
  };
}

function getBudgetForCategory(budgets, category) {
  const direct = budgets[category];
  if (direct !== undefined && direct !== null && direct !== "") return Number(direct || 0);

  const normalized = budgets[normalizeCategory(category)];
  return Number(normalized || 0);
}

export default function Budget() {
  const month = useMemo(getCurrentMonthContext, []);
  const [budgets, setBudgets] = useState(() => readStoredObject(BUDGET_STORAGE_KEY));
  const [salaryByMonth, setSalaryByMonth] = useState(() => readStoredObject(SALARY_STORAGE_KEY));
  const [salaryInput, setSalaryInput] = useState("");

  const [spending, setSpending] = useState({});
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlySalaryIncome, setMonthlySalaryIncome] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(true);
  const monthlySalary = Number(salaryByMonth[month.key] || 0);

  useEffect(() => {
    setSalaryInput(monthlySalary > 0 ? String(monthlySalary) : "");
  }, [monthlySalary]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    transactionAPI
      .filter({ from: month.from, to: month.to })
      .then((response) => {
        if (!active) return;

        const expenseAggregate = {};
        let incomeTotal = 0;
        let salaryIncome = 0;

        response.data.forEach((item) => {
          const amount = Number(item.amount || 0);
          if (!Number.isFinite(amount)) return;

          if (item.type === "EXPENSE") {
            const categoryKey = normalizeCategory(item.category);
            expenseAggregate[categoryKey] = (expenseAggregate[categoryKey] || 0) + amount;
          }

          if (item.type === "INCOME") {
            incomeTotal += amount;
            if (normalizeCategory(item.category) === "salary") {
              salaryIncome += amount;
            }
          }
        });

        setSpending(expenseAggregate);
        setMonthlyIncome(incomeTotal);
        setMonthlySalaryIncome(salaryIncome);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [month.from, month.to]);

  const totals = useMemo(() => {
    const totalBudget = CATEGORIES.reduce((sum, category) => sum + getBudgetForCategory(budgets, category), 0);
    const totalSpent = Object.values(spending).reduce((sum, value) => sum + Number(value || 0), 0);
    const inferredSalary = monthlySalaryIncome > 0 ? monthlySalaryIncome : monthlyIncome;
    const overallLimit = monthlySalary > 0 ? monthlySalary : inferredSalary > 0 ? inferredSalary : totalBudget;
    const usedPercent = overallLimit > 0 ? Math.min(100, Math.round((totalSpent / overallLimit) * 100)) : 0;
    const remaining = overallLimit - totalSpent;
    const source = monthlySalary > 0 ? "Monthly salary" : inferredSalary > 0 ? "Logged income" : "Category budgets";

    return {
      totalBudget,
      totalSpent,
      overallLimit,
      remaining,
      inferredSalary,
      source,
      usedPercent,
    };
  }, [budgets, monthlyIncome, monthlySalary, monthlySalaryIncome, spending]);

  const saveBudget = (category) => {
    const parsed = Number(editingValue);
    if (!Number.isFinite(parsed) || parsed < 0) return;

    const updated = {
      ...budgets,
      [category]: parsed,
    };
    delete updated[normalizeCategory(category)];

    setBudgets(updated);
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(updated));
    setEditingCategory(null);
    setEditingValue("");
  };

  const removeBudget = (category) => {
    const updated = { ...budgets };
    delete updated[category];
    delete updated[normalizeCategory(category)];

    setBudgets(updated);
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(updated));
  };

  const saveMonthlySalary = () => {
    const parsed = Number(salaryInput);
    if (!Number.isFinite(parsed) || parsed < 0) return;

    const updated = {
      ...salaryByMonth,
      [month.key]: parsed,
    };

    setSalaryByMonth(updated);
    localStorage.setItem(SALARY_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearMonthlySalary = () => {
    const updated = { ...salaryByMonth };
    delete updated[month.key];

    setSalaryByMonth(updated);
    localStorage.setItem(SALARY_STORAGE_KEY, JSON.stringify(updated));
    setSalaryInput("");
  };

  const useLoggedSalary = () => {
    if (totals.inferredSalary <= 0) return;

    const amount = Number(totals.inferredSalary.toFixed(2));
    const updated = {
      ...salaryByMonth,
      [month.key]: amount,
    };

    setSalaryByMonth(updated);
    localStorage.setItem(SALARY_STORAGE_KEY, JSON.stringify(updated));
    setSalaryInput(String(amount));
  };

  const overallColor =
    totals.usedPercent >= 90 ? "var(--danger)" : totals.usedPercent >= 75 ? "var(--warning)" : "var(--success)";

  return (
    <div className="section-grid">
      <header className="page-head fade-up">
        <div>
          <span className="chip chip-cyan">Budget</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Monthly Limits
          </h1>
          <p className="page-subtitle">Set category caps, track consumption, and avoid overspending with live visuals.</p>
        </div>
      </header>

      <section className="glass-card fade-up" style={{ padding: 20 }}>
        <div className="inline-split" style={{ alignItems: "flex-start" }}>
          <div>
            <span className="eyebrow">Monthly Salary ({month.label})</span>
            <h3
              style={{
                marginTop: 6,
                marginBottom: 5,
                fontFamily: "var(--font-display)",
                color: "var(--text-strong)",
                fontSize: "1.45rem",
              }}
            >
              {currency(monthlySalary)}
            </h3>
            <p className="page-subtitle">Set your take-home monthly salary to track remaining balance and usage.</p>
          </div>

          <span className={monthlySalary > 0 ? "badge badge-income" : "badge badge-muted"}>
            {monthlySalary > 0 ? "Salary Set" : "Not Set"}
          </span>
        </div>

        <div className="inline-split" style={{ marginTop: 14 }}>
          <input
            type="number"
            min="0"
            className="input-glass"
            placeholder="Set monthly salary"
            value={salaryInput}
            onChange={(event) => setSalaryInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && saveMonthlySalary()}
          />
          <button className="btn-success" onClick={saveMonthlySalary}>
            Save Salary
          </button>
          {monthlySalary > 0 && (
            <button className="btn-danger" onClick={clearMonthlySalary}>
              Clear
            </button>
          )}
        </div>

        <div className="inline-split" style={{ marginTop: 10 }}>
          <span className="field-hint">
            Income logged this month: {currency(monthlyIncome)}
            {monthlySalaryIncome > 0 ? ` (Salary: ${currency(monthlySalaryIncome)})` : ""}
          </span>
          {totals.inferredSalary > 0 && (
            <button className="btn-ghost" onClick={useLoggedSalary}>
              Use Logged Salary
            </button>
          )}
        </div>
      </section>

      <section className="glass-card fade-up" style={{ padding: 20 }}>
        <div className="inline-split" style={{ alignItems: "flex-start" }}>
          <div>
            <span className="eyebrow">Overall Budget Usage</span>
            <h3
              style={{
                marginTop: 6,
                marginBottom: 5,
                fontFamily: "var(--font-display)",
                color: "var(--text-strong)",
                fontSize: "1.45rem",
              }}
            >
              {currency(totals.totalSpent)} / {currency(totals.overallLimit)}
            </h3>
            <p className="page-subtitle">
              {loading
                ? "Refreshing this month expenses..."
                : totals.overallLimit > 0
                  ? totals.remaining >= 0
                    ? `${currency(totals.remaining)} remaining this month.`
                    : `${currency(Math.abs(totals.remaining))} over your monthly limit.`
                  : "Set monthly salary or category budgets to track usage."}
            </p>
            {!loading && totals.overallLimit > 0 && (
              <p className="field-hint" style={{ marginTop: 4 }}>
                Source: {totals.source}
              </p>
            )}
          </div>

          <div className="kpi-ring">
            <svg viewBox="0 0 80 80" role="img" aria-label="Budget usage">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(190,204,220,0.2)" strokeWidth="7" />
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke={overallColor}
                strokeWidth="7"
                strokeDasharray={`${totals.usedPercent * 2.01} 201`}
                strokeLinecap="round"
              />
            </svg>
            <span>{totals.usedPercent}%</span>
          </div>
        </div>

        <div className="progress-track" style={{ marginTop: 14 }}>
          <div className="progress-fill" style={{ width: `${totals.usedPercent}%`, background: overallColor }} />
        </div>
      </section>

      <section className="three-col fade-up">
        {CATEGORIES.map((category) => {
          const budget = getBudgetForCategory(budgets, category);
          const spent = Number(spending[normalizeCategory(category)] || 0);
          const usage = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
          const isOver = budget > 0 && spent > budget;

          const cardColor = isOver ? "var(--danger)" : usage >= 80 ? "var(--warning)" : "var(--success)";

          return (
            <article className="glass-card" key={category} style={{ padding: 18, display: "grid", gap: 12 }}>
              <div className="inline-split">
                <div>
                  <span className="eyebrow">{category}</span>
                  <p
                    style={{
                      marginTop: 7,
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      color: cardColor,
                    }}
                  >
                    {currency(spent)}
                  </p>
                  {budget > 0 && <p className="field-hint">Budget: {currency(budget)}</p>}
                </div>

                {isOver && <span className="badge badge-expense">Over limit</span>}
              </div>

              {budget > 0 ? (
                <>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${usage}%`, background: cardColor }} />
                  </div>
                  <div className="inline-split">
                    <span className="field-hint">{usage}% used</span>
                    <span className={isOver ? "text-danger mono" : "text-success mono"}>
                      {isOver ? "Exceeded" : `${currency(Math.max(0, budget - spent))} left`}
                    </span>
                  </div>
                </>
              ) : (
                <p className="field-hint">No budget set yet for this category.</p>
              )}

              {editingCategory === category ? (
                <div className="inline-split">
                  <input
                    type="number"
                    min="0"
                    className="input-glass"
                    placeholder="Set monthly limit"
                    value={editingValue}
                    onChange={(event) => setEditingValue(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && saveBudget(category)}
                  />
                  <button className="btn-success" onClick={() => saveBudget(category)}>
                    Save
                  </button>
                  <button className="btn-ghost" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="inline-split">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingCategory(category);
                      setEditingValue(budget ? String(budget) : "");
                    }}
                  >
                    {budget > 0 ? "Edit" : "Set Budget"}
                  </button>

                  {budget > 0 && (
                    <button className="btn-danger" onClick={() => removeBudget(category)}>
                      Remove
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

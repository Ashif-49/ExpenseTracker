import React, { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { dashboardAPI } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_COLORS = [
  "rgba(0,255,255,0.75)",
  "rgba(106,17,203,0.82)",
  "rgba(62,158,184,0.8)",
  "rgba(120,226,255,0.72)",
  "rgba(165,111,255,0.75)",
  "rgba(45,126,164,0.76)",
  "rgba(109,255,226,0.75)",
  "rgba(126,163,255,0.76)",
  "rgba(0,181,255,0.72)",
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getMonthly(year), dashboardAPI.getCategories()])
      .then(([monthlyResponse, categoryResponse]) => {
        setMonthlyData(monthlyResponse.data);
        setCategoryData(categoryResponse.data);
      })
      .finally(() => setLoading(false));
  }, [year]);

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return [current - 2, current - 1, current, current + 1];
  }, []);

  const barChartData = useMemo(
    () => ({
      labels: monthlyData.map((monthItem) => MONTH_NAMES[monthItem.month - 1]),
      datasets: [
        {
          label: "Income",
          data: monthlyData.map((monthItem) => monthItem.income || 0),
          backgroundColor: "rgba(57,247,203,0.45)",
          borderColor: "rgba(57,247,203,0.88)",
          borderWidth: 1,
          borderRadius: 10,
        },
        {
          label: "Expenses",
          data: monthlyData.map((monthItem) => monthItem.expense || 0),
          backgroundColor: "rgba(255,93,125,0.42)",
          borderColor: "rgba(255,93,125,0.84)",
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    }),
    [monthlyData]
  );

  const doughnutChartData = useMemo(
    () => ({
      labels: categoryData.map((item) => item.category),
      datasets: [
        {
          data: categoryData.map((item) => item.amount),
          backgroundColor: CATEGORY_COLORS,
          borderWidth: 2,
          borderColor: "rgba(7,13,24,0.95)",
        },
      ],
    }),
    [categoryData]
  );

  const chartOptionsBase = {
    color: "rgba(220,233,245,0.8)",
    plugins: {
      tooltip: {
        backgroundColor: "rgba(7,14,24,0.95)",
        titleColor: "rgba(241,248,255,0.94)",
        bodyColor: "rgba(220,233,245,0.84)",
        borderColor: "rgba(140,225,255,0.25)",
        borderWidth: 1,
        padding: 12,
      },
      legend: {
        labels: {
          color: "rgba(220,233,245,0.72)",
          boxWidth: 12,
          boxHeight: 12,
          useBorderRadius: true,
          borderRadius: 3,
        },
      },
    },
  };

  const barOptions = {
    ...chartOptionsBase,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "rgba(190,204,220,0.68)" },
        grid: { color: "rgba(190,204,220,0.08)" },
      },
      y: {
        ticks: { color: "rgba(190,204,220,0.68)" },
        grid: { color: "rgba(190,204,220,0.08)" },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptionsBase,
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      ...chartOptionsBase.plugins,
      legend: {
        labels: {
          color: "rgba(220,233,245,0.72)",
          boxWidth: 12,
          boxHeight: 12,
          useBorderRadius: true,
          borderRadius: 3,
          padding: 12,
        },
        position: "right",
      },
    },
  };

  const totalCategoryAmount = categoryData.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="section-grid">
      <header className="page-head fade-up">
        <div>
          <span className="chip chip-cyan">Reports</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Analytics Center
          </h1>
          <p className="page-subtitle">Track monthly movement and category trends with clear visual summaries.</p>
        </div>

        <div className="page-actions">
          <div className="field" style={{ minWidth: 130 }}>
            <label className="field-label" htmlFor="report-year">
              Year
            </label>
            <select
              id="report-year"
              className="select-glass"
              value={year}
              onChange={(event) => {
                setLoading(true);
                setYear(Number(event.target.value));
              }}
            >
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <section className="loading-panel">
          <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
            <span className="chip chip-purple">Loading Reports</span>
            <div className="loading-pulse" />
          </div>
        </section>
      ) : (
        <>
          <section className="glass-card fade-up" style={{ padding: 20 }}>
            <div className="inline-split" style={{ marginBottom: 14 }}>
              <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>
                Monthly Income vs Expenses
              </h3>
              <span className="chip chip-purple">{year}</span>
            </div>

            <div style={{ height: 320 }}>
              {monthlyData.length === 0 ? (
                <div className="table-empty">No monthly data available for {year}.</div>
              ) : (
                <Bar data={barChartData} options={barOptions} />
              )}
            </div>
          </section>

          <section className="two-col fade-up">
            <article className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)", marginBottom: 14 }}>
                Expense by Category
              </h3>

              <div style={{ height: 300 }}>
                {categoryData.length === 0 ? (
                  <div className="table-empty">No category data yet.</div>
                ) : (
                  <Doughnut data={doughnutChartData} options={doughnutOptions} />
                )}
              </div>
            </article>

            <article className="glass-card" style={{ padding: 20, display: "grid", gap: 10 }}>
              <h3 style={{ color: "var(--text-strong)", fontFamily: "var(--font-display)" }}>Category Breakdown</h3>

              {categoryData.length === 0 ? (
                <div className="table-empty">No category distribution available.</div>
              ) : (
                <div className="list-stack">
                  {categoryData.map((item, index) => {
                    const percent = totalCategoryAmount > 0 ? Math.round((item.amount / totalCategoryAmount) * 100) : 0;

                    return (
                      <div key={item.category} className="list-item" style={{ alignItems: "flex-start", flexDirection: "column" }}>
                        <div className="inline-split" style={{ width: "100%" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                width: 9,
                                height: 9,
                                borderRadius: 99,
                                display: "inline-block",
                                background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                              }}
                            />
                            <strong>{item.category}</strong>
                          </div>
                          <span className="mono">{currency(item.amount)}</span>
                        </div>
                        <div className="inline-split" style={{ width: "100%" }}>
                          <span className="field-hint">{percent}% of total expense</span>
                          <span className="field-hint">{currency(totalCategoryAmount)}</span>
                        </div>
                        <div className="progress-track" style={{ width: "100%" }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${percent}%`, background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  );
}

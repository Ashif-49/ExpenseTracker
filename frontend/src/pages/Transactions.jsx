import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import TransactionModal from "../components/TransactionModal";
import { transactionAPI } from "../services/api";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Salary",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Others",
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState({ open: false, transaction: null });
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    from: "",
    to: "",
    keyword: "",
  });

  useEffect(() => {
    let active = true;

    const fetchTransactions = async () => {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.keyword.trim()) params.keyword = filters.keyword.trim();

      const hasFilters = Object.keys(params).length > 0;
      const response = hasFilters ? await transactionAPI.filter(params) : await transactionAPI.getAll();

      if (!active) return;
      setTransactions(response.data);
      setLoading(false);
    };

    fetchTransactions();

    return () => {
      active = false;
    };
  }, [filters]);

  const updateFilters = (updater) => {
    setLoading(true);
    setFilters((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "INCOME")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = transactions
      .filter((item) => item.type === "EXPENSE")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      income,
      expense,
      net: income - expense,
    };
  }, [transactions]);

  const handleSave = async (payload) => {
    if (modal.transaction) {
      await transactionAPI.update(modal.transaction.id, payload);
    } else {
      await transactionAPI.create(payload);
    }
    updateFilters((prev) => ({ ...prev }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await transactionAPI.remove(deleteId);
    setDeleteId(null);
    updateFilters((prev) => ({ ...prev }));
  };

  const exportCSV = () => {
    const rows = [
      ["Date", "Type", "Category", "Description", "Amount"],
      ...transactions.map((transaction) => [
        transaction.date,
        transaction.type,
        transaction.category,
        transaction.description || "",
        transaction.amount,
      ]),
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="section-grid">
      <header className="page-head fade-up">
        <div>
          <span className="chip chip-cyan">Transactions</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Ledger
          </h1>
          <p className="page-subtitle">
            {transactions.length} records |{" "}
            <span className={totals.net >= 0 ? "text-success mono" : "text-danger mono"}>
              Net {totals.net >= 0 ? "+" : ""}
              {currency(totals.net)}
            </span>
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-secondary" onClick={exportCSV}>
            Export CSV
          </button>
          <button className="btn-primary" onClick={() => setModal({ open: true, transaction: null })}>
            New Transaction
          </button>
        </div>
      </header>

      <section className="glass-card fade-up" style={{ padding: 16 }}>
        <div className="filter-grid">
          <div className="field">
            <label className="field-label" htmlFor="filter-type">
              Type
            </label>
            <select
              id="filter-type"
              className="select-glass"
              value={filters.type}
              onChange={(event) => updateFilters((prev) => ({ ...prev, type: event.target.value }))}
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="filter-category">
              Category
            </label>
            <select
              id="filter-category"
              className="select-glass"
              value={filters.category}
              onChange={(event) => updateFilters((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="filter-from">
              From
            </label>
            <input
              id="filter-from"
              type="date"
              className="input-glass"
              value={filters.from}
              onChange={(event) => updateFilters((prev) => ({ ...prev, from: event.target.value }))}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="filter-to">
              To
            </label>
            <input
              id="filter-to"
              type="date"
              className="input-glass"
              value={filters.to}
              onChange={(event) => updateFilters((prev) => ({ ...prev, to: event.target.value }))}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="filter-keyword">
              Keyword
            </label>
            <input
              id="filter-keyword"
              type="text"
              className="input-glass"
              placeholder="Search description"
              value={filters.keyword}
              onChange={(event) => updateFilters((prev) => ({ ...prev, keyword: event.target.value }))}
            />
          </div>

          <div className="field">
            <label className="field-label">Actions</label>
            <button
              className="btn-ghost"
              onClick={() =>
                updateFilters({
                  type: "",
                  category: "",
                  from: "",
                  to: "",
                  keyword: "",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      <section className="glass-card fade-up" style={{ padding: 0 }}>
        <div className="data-shell">
          {loading ? (
            <div className="table-empty">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="table-empty">No transactions found for the current filters.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="mono" style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td style={{ color: "var(--text-strong)" }}>{transaction.description || "-"}</td>
                    <td>
                      <span className="badge badge-muted">{transaction.category}</span>
                    </td>
                    <td>
                      <span
                        className={
                          transaction.type === "INCOME" ? "badge badge-income" : "badge badge-expense"
                        }
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={`amount ${
                        transaction.type === "INCOME" ? "text-success" : "text-danger"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {currency(transaction.amount)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-secondary"
                          style={{ padding: "7px 11px", fontSize: "0.78rem" }}
                          onClick={() => setModal({ open: true, transaction })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          style={{ padding: "7px 11px", fontSize: "0.78rem" }}
                          onClick={() => setDeleteId(transaction.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <TransactionModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, transaction: null })}
        onSave={handleSave}
        transaction={modal.transaction}
      />

      {deleteId && (
        <div className="modal-backdrop" onClick={(event) => event.target === event.currentTarget && setDeleteId(null)}>
          <section className="modal-panel" style={{ maxWidth: 420 }}>
            <span className="chip chip-purple">Confirm Delete</span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-strong)",
                marginTop: 12,
                marginBottom: 8,
              }}
            >
              Delete this transaction?
            </h3>
            <p className="page-subtitle">This action cannot be undone.</p>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

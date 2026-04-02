import React, { useEffect, useState } from "react";

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

export default function TransactionModal({ isOpen, onClose, onSave, transaction }) {
  const [form, setForm] = useState({
    type: "EXPENSE",
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        ...transaction,
        amount: transaction.amount,
      });
    } else {
      setForm({
        type: "EXPENSE",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setError("");
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
      });
      onClose();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-panel">
        <div className="inline-split">
          <div>
            <span className="chip chip-cyan">{transaction ? "Edit Transaction" : "New Transaction"}</span>
            <h3
              style={{
                marginTop: 10,
                marginBottom: 5,
                fontFamily: "var(--font-display)",
                color: "var(--text-strong)",
                fontSize: "1.4rem",
              }}
            >
              {transaction ? "Update Record" : "Add Record"}
            </h3>
            <p className="page-subtitle">
              {transaction ? "Refine the existing entry details." : "Capture your latest income or expense."}
            </p>
          </div>

          <button className="icon-btn" onClick={onClose} type="button" aria-label="Close">
            x
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="section-grid" onSubmit={submit}>
          <div className="two-col" style={{ gap: 10 }}>
            <button
              type="button"
              className={form.type === "INCOME" ? "btn-success" : "btn-ghost"}
              onClick={() => setForm((prev) => ({ ...prev, type: "INCOME" }))}
            >
              Income
            </button>
            <button
              type="button"
              className={form.type === "EXPENSE" ? "btn-danger" : "btn-ghost"}
              onClick={() => setForm((prev) => ({ ...prev, type: "EXPENSE" }))}
            >
              Expense
            </button>
          </div>

          <div className="two-col" style={{ gap: 12 }}>
            <div className="field">
              <label className="field-label" htmlFor="transaction-amount">
                Amount
              </label>
              <input
                id="transaction-amount"
                type="number"
                step="0.01"
                min="0.01"
                className="input-glass"
                placeholder="0.00"
                value={form.amount}
                onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="transaction-date">
                Date
              </label>
              <input
                id="transaction-date"
                type="date"
                className="input-glass"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="transaction-category">
              Category
            </label>
            <select
              id="transaction-category"
              className="select-glass"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="transaction-description">
              Description
            </label>
            <textarea
              id="transaction-description"
              className="textarea-glass"
              rows={3}
              maxLength={255}
              placeholder="Optional note"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className={form.type === "INCOME" ? "btn-success" : "btn-primary"} type="submit" disabled={loading}>
              {loading ? "Saving..." : transaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

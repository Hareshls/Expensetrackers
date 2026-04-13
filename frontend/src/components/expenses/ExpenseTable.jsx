import { Trash2, CreditCard, Wallet } from "lucide-react";

const categoryConfig = {
  food:        { emoji: "🍔", bg: "#e0e7ff", color: "#4338ca" },
  travel:      { emoji: "✈️", bg: "#fef3c7", color: "#d97706" },
  shopping:    { emoji: "🛍️", bg: "#dcfce7", color: "#15803d" },
  rent:        { emoji: "🏠", bg: "#fee2e2", color: "#991b1b" },
  health:      { emoji: "💊", bg: "#fce7f3", color: "#be185d" },
  education:   { emoji: "📚", bg: "#dbeafe", color: "#1d4ed8" },
  entertainment: { emoji: "🎬", bg: "#f3e8ff", color: "#7c3aed" },
  utilities:   { emoji: "⚡", bg: "#fef9c3", color: "#a16207" },
  other:       { emoji: "💰", bg: "#f1f5f9", color: "#475569" },
};

const getCategoryConfig = (category = "") => {
  return categoryConfig[category.toLowerCase()] || categoryConfig.other;
};

const ExpenseTable = ({ expenses, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>💸</div>
        <p style={{ fontWeight: 600, fontSize: "16px", margin: 0 }}>No expenses yet</p>
        <p style={{ fontSize: "14px", marginTop: "4px" }}>Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="expense-card-list">
      {expenses.map((expense) => {
        const cfg = getCategoryConfig(expense.category);
        const date = new Date(expense.date);
        const day = date.toLocaleDateString("en-IN", { day: "2-digit" });
        const month = date.toLocaleDateString("en-IN", { month: "short" });
        const year = date.getFullYear();

        return (
          <div key={expense._id || expense.id} className="expense-card-item">
            {/* Date Badge */}
            <div className="exp-date-badge">
              <span className="exp-day">{day}</span>
              <span className="exp-month">{month}</span>
              <span className="exp-year">{year}</span>
            </div>

            {/* Category Icon */}
            <div
              className="exp-cat-icon"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.emoji}
            </div>

            {/* Info */}
            <div className="exp-info">
              <p className="exp-desc">{expense.description}</p>
              <div className="exp-meta">
                <span className="exp-badge" style={{ background: cfg.bg, color: cfg.color }}>
                  {expense.category}
                </span>
                <span className="exp-payment">
                  {expense.payment === "Card" ? (
                    <CreditCard size={12} style={{ marginRight: 3 }} />
                  ) : (
                    <Wallet size={12} style={{ marginRight: 3 }} />
                  )}
                  {expense.payment}
                </span>
              </div>
            </div>

            {/* Amount + Delete */}
            <div className="exp-right">
              <span className="exp-amount">-₹{expense.amount.toLocaleString()}</span>
              <button
                className="exp-delete-btn"
                onClick={() => onDelete(expense._id)}
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        .expense-card-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .expense-card-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }

        .expense-card-item:last-child {
          border-bottom: none;
        }

        .expense-card-item:hover {
          background: #f8fafc;
          border-radius: 12px;
        }

        .exp-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 36px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 6px 4px;
          line-height: 1.2;
        }

        .exp-day {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
        }

        .exp-month {
          font-size: 10px;
          font-weight: 600;
          color: #6366f1;
          text-transform: uppercase;
        }

        .exp-year {
          font-size: 9px;
          color: #94a3b8;
        }

        .exp-cat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .exp-info {
          flex: 1;
          min-width: 0;
        }

        .exp-desc {
          margin: 0;
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .exp-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .exp-badge {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .exp-payment {
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .exp-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }

        .exp-amount {
          font-size: 15px;
          font-weight: 700;
          color: #ef4444;
          white-space: nowrap;
        }

        .exp-delete-btn {
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          transition: all 0.2s;
        }

        .exp-delete-btn:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        @media (max-width: 480px) {
          .expense-card-item {
            padding: 12px 14px;
            gap: 10px;
          }

          .exp-cat-icon {
            width: 36px;
            height: 36px;
            font-size: 17px;
            border-radius: 10px;
          }

          .exp-desc {
            font-size: 13px;
          }

          .exp-amount {
            font-size: 13px;
          }

          .exp-date-badge {
            min-width: 32px;
          }

          .exp-day {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseTable;

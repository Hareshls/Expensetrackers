import { useState } from "react";
import { X } from "lucide-react";

const ExpenseForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split('T')[0],
    payment: "UPI"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="expense-form-container">
      <div className="form-header">
        <h2>Add New Expense</h2>
        <button className="close-btn" onClick={onCancel}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="e.g. Grocery Shopping"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Food">Food & Drinks</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel</option>
              <option value="Rent">Rent</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Mode</label>
            <select
              value={formData.payment}
              onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary-btn">Save Expense</button>
        </div>
      </form>

      <style>{`
        .expense-form-container {
          padding: 28px;
        }
        @media (max-width: 480px) {
          .expense-form-container {
            padding: 20px 18px;
          }
        }
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .form-header h2 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
        }
        .close-btn {
          background: #f1f5f9;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          color: #64748b;
        }
        .expense-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }
        input, select {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          font-size: 14px;
          background: #ffffff;
          color: #0f172a;
          width: 100%;
          transition: all 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }
        input[type="date"] {
          text-align: left;
          cursor: pointer;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.6;
          cursor: pointer;
        }
        input::placeholder {
          color: #94a3b8;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: #ffffff;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
        }
        @media (max-width: 480px) {
          .form-actions {
            flex-direction: column-reverse;
            gap: 10px;
          }
          .form-actions button {
            width: 100%;
            justify-content: center;
          }
        }
        .secondary-btn {
          padding: 12px 24px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .secondary-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default ExpenseForm;

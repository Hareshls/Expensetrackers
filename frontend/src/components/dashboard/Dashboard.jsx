import StatsCard from "./StatsCard";
import CategoryChart from "./CategoryChart";
import MonthlyTrend from "./MonthlyTrend";
import "../../styles/dashboard.css";
import { Wallet, TrendingUp, CreditCard, ShoppingBag, PiggyBank, Edit3, X, Check, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { expenseAPI, authAPI } from "../../services/api";

const Dashboard = ({ user, onUpdateUser, setPage }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editData, setEditData] = useState({ salary: "", monthlyBudget: "" });

  const handleStartEdit = () => {
    setEditData({
      salary: user?.salary || "",
      monthlyBudget: user?.monthlyBudget || ""
    });
    setIsEditingPlan(true);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expenseAPI.getAll();
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTransactions = expenses.length;
  const uniqueCategories = new Set(expenses.map(exp => exp.category)).size;

  // Calculate this month's total
  const now = new Date();
  const thisMonthTotal = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netSavings = (user?.salary || 0) - totalExpenses;
  const remainingBudget = (user?.monthlyBudget || 0) - thisMonthTotal;
  const budgetProgress = user?.monthlyBudget > 0 ? (thisMonthTotal / user.monthlyBudget) * 100 : 0;
  const progressColor = budgetProgress > 90 ? "#ef4444" : budgetProgress > 70 ? "#f59e0b" : "#6366f1";

  const handleUpdatePlan = async () => {
    try {
      const response = await authAPI.updateProfile(editData);
      onUpdateUser(response.data.user);
      setIsEditingPlan(false);
    } catch (error) {
      console.error("Update plan failed", error);
      alert(error.response?.data?.message || "Failed to update plan");
    }
  };

  if (loading) return <div className="content-body">Loading dashboard...</div>;

  return (
    <div className="content-body">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="primary-btn" onClick={() => setPage && setPage("expenses")}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="dashboard-top">
        <div className="plan-summary-card card animate-in">
          <div className="plan-header">
            <div className="title-with-icon">
              <div className="title-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                <TrendingUp size={18} />
              </div>
              <h3 className="premium-title">Financial Plan</h3>
            </div>
            <button className="edit-btn-pill" onClick={() => isEditingPlan ? setIsEditingPlan(false) : handleStartEdit()}>
              {isEditingPlan ? <X size={14} /> : <Edit3 size={14} />}
              <span>{isEditingPlan ? "Cancel" : "Edit Plan"}</span>
            </button>
          </div>

          {isEditingPlan ? (
            <div className="plan-edit-form premium-form">
              <div className="input-row">
                <div className="input-group-premium">
                  <label>Monthly Salary</label>
                  <div className="input-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      value={editData.salary}
                      onChange={(e) => setEditData({ ...editData, salary: e.target.value === "" ? "" : Number(e.target.value) })}
                      placeholder="Salary"
                    />
                  </div>
                </div>
                <div className="input-group-premium">
                  <label>Budget Limit</label>
                  <div className="input-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      value={editData.monthlyBudget}
                      onChange={(e) => setEditData({ ...editData, monthlyBudget: e.target.value === "" ? "" : Number(e.target.value) })}
                      placeholder="Budget"
                    />
                  </div>
                </div>
              </div>
              <button className="save-plan-btn" onClick={handleUpdatePlan}>
                <Check size={16} /> Save Plan
              </button>
            </div>
          ) : (
            <div className="plan-content">
              <div className="main-plan-stats">
                <div className="stat-unit">
                  <span className="stat-label">Monthly Salary</span>
                  <div className="stat-value">₹{(user?.salary || 0).toLocaleString()}</div>
                </div>
                <div className="stat-unit divider">
                  <span className="stat-label">Net Savings</span>
                  <div className={`stat-value ${netSavings >= 0 ? "text-success" : "text-danger"}`}>
                    ₹{netSavings.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="budget-progress-section">
                <div className="progress-labels">
                  <span className="label-text">Budget Usage</span>
                  <span className="usage-percent">{Math.round(budgetProgress)}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(budgetProgress, 100)}%`,
                      background: progressColor
                    }}
                  />
                </div>
                <div className="progress-details">
                  <span className="spent">₹{thisMonthTotal.toLocaleString()} spent</span>
                  <span className="total">Limit: ₹{(user?.monthlyBudget || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="stats-grid">
          <StatsCard
            title="TOTAL EXPENSES"
            value={`₹${totalExpenses.toLocaleString()}`}
            icon={Wallet}
            color="#6366f1"
          />
          <StatsCard
            title="THIS MONTH"
            value={`₹${thisMonthTotal.toLocaleString()}`}
            icon={TrendingUp}
            color="#10b981"
          />
          <StatsCard
            title="REMAINING BUDGET"
            value={`₹${remainingBudget.toLocaleString()}`}
            icon={PiggyBank}
            color={remainingBudget >= 0 ? "#10b981" : "#ef4444"}
          />
          <StatsCard
            title="TRANSACTIONS"
            value={totalTransactions.toString()}
            icon={CreditCard}
            color="#f59e0b"
          />
        </div>
      </div>

      <div className="charts-grid">
        <CategoryChart expenses={expenses} />
        <MonthlyTrend expenses={expenses} />
      </div>

      <div className="recent-activity-section animate-in" style={{ marginTop: '32px' }}>
        <div className="card">
          <div className="activity-header">
            <h3 style={{ margin: 0, fontSize: '18px' }}>Recent Transactions</h3>
            <button className="text-btn" onClick={() => setPage && setPage("expenses")}>View All</button>
          </div>
          <div className="activity-list">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense._id} className="activity-item">
                <div className="item-left">
                  <div className="item-icon">💰</div>
                  <div className="item-details">
                    <p className="item-name">{expense.description}</p>
                    <p className="item-date">{new Date(expense.date).toLocaleDateString()} • {expense.payment}</p>
                  </div>
                </div>
                <p className="item-amount negative">-₹{expense.amount.toLocaleString()}</p>
              </div>
            ))}
            {expenses.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No transactions yet.</p>}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-top {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
        }
        .plan-summary-card {
          min-width: 400px;
          background: linear-gradient(135deg, #ffffff 0%, #fcfdfe 100%);
          position: relative;
          overflow: hidden;
        }
        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }
        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .title-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .premium-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.01em;
        }
        .edit-btn-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f1f5f9;
          border: none;
          border-radius: 100px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .edit-btn-pill:hover {
          background: #e2e8f0;
          color: #6366f1;
        }
        .main-plan-stats {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }
        .stat-unit {
          flex: 1;
        }
        .stat-unit.divider {
          padding-left: 20px;
          border-left: 1px solid #f1f5f9;
        }
        .stat-label {
          display: block;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .budget-progress-section {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .label-text {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .usage-percent {
          font-size: 12px;
          font-weight: 800;
          color: #1e293b;
        }
        .progress-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 100px;
          margin-bottom: 10px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .progress-details {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }
        .plan-edit-form.premium-form {
          gap: 20px;
        }
        .input-row {
          display: flex;
          gap: 16px;
        }
        .input-group-premium label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .currency-symbol {
          position: absolute;
          left: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
        }
        .input-wrapper input {
          width: 100%;
          padding: 10px 12px 10px 28px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.2s;
        }
        .input-wrapper input:focus {
          outline: none;
          background: #ffffff;
          border-color: #6366f1;
        }
        .save-plan-btn {
          width: 100%;
          margin-top: 8px;
          padding: 12px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-plan-btn:hover {
          background: #4f46e5;
        }
        .text-success { color: #10b981 !important; }
        .text-danger { color: #ef4444 !important; }
        .stats-grid {
          flex: 1;
          margin-bottom: 0 !important;
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 1200px) {
          .dashboard-top {
            flex-direction: column;
          }
          .plan-summary-card {
            width: 100%;
            min-width: unset;
          }
          .stats-grid {
             grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
           .stats-grid {
             grid-template-columns: 1fr 1fr !important;
           }
        }
        @media (max-width: 500px) {
           .stats-grid {
             grid-template-columns: 1fr !important;
           }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

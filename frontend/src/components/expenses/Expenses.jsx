import { useState, useEffect } from "react";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";
import "../../styles/expenses.css";
import { Plus, IndianRupee, CreditCard, Filter } from "lucide-react";
import { expenseAPI } from "../../services/api";

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseAPI.getAll();
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (newExpense) => {
    try {
      const response = await expenseAPI.create(newExpense);
      setExpenses(prev => [response.data, ...prev]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding expense", error);
      alert(error.response?.data?.message || "Failed to add expense. Please try again.");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await expenseAPI.delete(id);
      setExpenses(prev => prev.filter(exp => (exp._id || exp.id) !== id));
    } catch (error) {
      console.error("Error deleting expense", error);
      alert("Failed to delete expense.");
    }
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
    exp.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="content-body">
      <div className="expenses-header">
        <div className="stats-grid">
          <div className="card stat-mini">
            <div className="stat-icon-mini" style={{ background: '#e0e7ff', color: '#4338ca' }}>
              <IndianRupee size={20} />
            </div>
            <div>
              <p>Total Expenses</p>
              <h3>₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h3>
            </div>
          </div>
          <div className="card stat-mini">
            <div className="stat-icon-mini" style={{ background: '#dcfce7', color: '#15803d' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <p>Transactions</p>
              <h3>{expenses.length}</h3>
            </div>
          </div>
        </div>

        <div className="action-bar">
          <div className="search-box">
            <Filter size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Filter by category or description..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Add Expense
          </button>
        </div>
      </div>

      <div className="card animate-in" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading expenses...</div>
        ) : (
          <ExpenseTable expenses={filteredExpenses} onDelete={deleteExpense} />
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <ExpenseForm onSubmit={addExpense} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;

import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Expenses from "./components/expenses/Expenses";
import Analytics from "./components/analytics/Analytics";
import Auth from "./components/auth/Auth";
import Toast, { useToast } from "./components/common/Toast";
import { useState, useEffect, useRef } from "react";
import "./styles/global.css";

import { authAPI, expenseAPI } from "./services/api";

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();
  const budgetNotified = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authAPI.verifySession();
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Check budget after user loads
  useEffect(() => {
    if (!user || budgetNotified.current) return;

    const checkBudget = async () => {
      try {
        const response = await expenseAPI.getAll();
        const expenses = response.data;
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const budget = user?.monthlyBudget || 0;

        if (budget > 0) {
          const usage = Math.round((totalSpent / budget) * 100);

          if (totalSpent > budget) {
            addToast(
              "🚨 Budget Exceeded!",
              `You've spent ₹${totalSpent.toLocaleString()} — ₹${(totalSpent - budget).toLocaleString()} over your ₹${budget.toLocaleString()} budget.`,
              "danger",
              7000
            );
          } else if (usage >= 80) {
            addToast(
              "⚠️ Budget Warning",
              `You've used ${usage}% of your ₹${budget.toLocaleString()} budget. Only ₹${(budget - totalSpent).toLocaleString()} remaining!`,
              "warning",
              6000
            );
          }
          budgetNotified.current = true;
        }
      } catch (err) {
        console.error("Budget check failed", err);
      }
    };

    checkBudget();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    budgetNotified.current = false; // reset so notification fires after login
    localStorage.setItem("user", JSON.stringify(userData));
    addToast("Welcome back! 👋", `Hello ${userData.name}, you're logged in.`, "success", 4000);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
    setUser(null);
    budgetNotified.current = false;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Toast toasts={toasts} removeToast={removeToast} />
        <Auth onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Layout page={page} setPage={setPage} onLogout={handleLogout} user={user}>
        {page === "dashboard" && <Dashboard user={user} onUpdateUser={handleUpdateUser} addToast={addToast} setPage={setPage} />}
        {page === "expenses" && <Expenses user={user} addToast={addToast} />}
        {page === "analytics" && <Analytics user={user} onUpdateUser={handleUpdateUser} addToast={addToast} />}
      </Layout>
    </>
  );
}

export default App;

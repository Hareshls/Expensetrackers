import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Expenses from "./components/expenses/Expenses";
import Analytics from "./components/analytics/Analytics";
import Auth from "./components/auth/Auth";
import { useState, useEffect } from "react";
import "./styles/global.css";

import { authAPI } from "./services/api";

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authAPI.verifySession();
        setUser(response.data.user);
      } catch (err) {
        // Not logged in or session expired
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
    localStorage.removeItem("user");
  };

  if (loading) return null;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout page={page} setPage={setPage} onLogout={handleLogout} user={user}>
      {page === "dashboard" && <Dashboard user={user} onUpdateUser={handleUpdateUser} />}
      {page === "expenses" && <Expenses user={user} />}
      {page === "analytics" && <Analytics user={user} onUpdateUser={handleUpdateUser} />}
    </Layout>
  );
}

export default App;

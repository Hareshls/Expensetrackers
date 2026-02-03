import { LayoutDashboard, IndianRupee, PieChart, LogOut, X, User, ChevronRight } from "lucide-react";
import "../../styles/sidebar.css";

const Sidebar = ({ page, setPage, isOpen, setIsOpen, onLogout, user }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "expenses", label: "Expenses", icon: IndianRupee },
    { id: "analytics", label: "Analytics", icon: PieChart },
  ];

  const handleNavClick = (id) => {
    setPage(id);
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="logo-icon">
              <IndianRupee size={22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h2 className="logo-text">FinTrack<span>Pro</span></h2>
          </div>
          <button className="mobile-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user-card">
          <div className="user-avatar">
            <User size={18} color="#6366f1" />
          </div>
          <div className="user-info">
            <span className="user-welcome">Welcome back,</span>
            <span className="user-name">{user?.name || "Guest User"}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">MAIN NAVIGATION</span>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${page === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <div className="nav-link-content">
                <item.icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </div>
              {page === item.id && <ChevronRight size={14} className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

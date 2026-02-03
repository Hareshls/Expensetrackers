import { Menu } from "lucide-react";

const Header = ({ page, onMenuClick }) => {
  const titles = {
    dashboard: "Expense Tracker",
    expenses: "All Expenses",
    analytics: "Analytics & Reports",
  };

  const subtitles = {
    dashboard: "Track and manage your expenses efficiently",
    expenses: "View and manage all your expense records",
    analytics: "Visualize your spending patterns and trends",
  };

  return (
    <header className="header">
      <div className="header-content-wrapper">
        <div className="header-left">
          <button className="mobile-toggle" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <div>
            <h1>{titles[page]}</h1>
            <p className="mobile-hide">{subtitles[page]}</p>
          </div>
        </div>
        <div className="header-right">
          {/* User profile could go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, page, setPage, onLogout, user }) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        page={page}
        setPage={setPage}
        isOpen={sidebarIsOpen}
        setIsOpen={setSidebarIsOpen}
        onLogout={onLogout}
        user={user}
      />
      <div className="main-content">
        <Header
          page={page}
          onMenuClick={() => setSidebarIsOpen(true)}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;

import { ChevronLeft, Search, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {isOpen && <h1 onClick={()=>handleNavigation('/')} className="logo cursor-pointer">CWTNet</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          <ChevronLeft className={`toggle-icon ${isOpen ? "" : "rotated"}`} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <SidebarItem icon={<Search />} text="Search" isOpen={isOpen} handleClick={() => handleNavigation("/aiguru")} />
        <SidebarItem icon={<Settings />} text="Settings" isOpen={isOpen} handleClick={() => handleNavigation("/aiguru/settings")} />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, text, isOpen, handleClick }) => {
  return (
    <button className="sidebar-item" onClick={handleClick} style={{ all: "unset", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
      {icon}
      {isOpen && <span>{text}</span>}
    </button>
  );
};

export default Sidebar;

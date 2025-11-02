import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="brand">Todo<span>Pro</span></div>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/tasks">Tâches</Link></li>
          <li><Link to="/reports">Rapports</Link></li>
        </ul>
      </nav>
      <div className="sidebar-footer">© {new Date().getFullYear()}</div>
    </aside>
  );
};

export default Sidebar;

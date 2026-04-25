import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>ShopSmart</h2>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
          Products
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
          Users
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
          Orders
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

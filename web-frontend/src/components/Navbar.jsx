import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/log', label: '✏️ Log' },
    { to: '/activities', label: '🏷️ Activities' },
    { to: '/analytics', label: '📊 Analytics' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">📚 ProductivityTracker</div>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

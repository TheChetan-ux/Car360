import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-white" : "muted hover:text-white"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-xl" style={{ background: "var(--surface)" }}>
      <div className="shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-lg font-bold text-white">
            C
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide">Car360</p>
            <p className="text-xs muted">Used cars, elevated.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/browse" className={navClass}>
            Browse
          </NavLink>
          <NavLink to="/auctions" className={navClass}>
            Auctions
          </NavLink>
          <NavLink to="/sell" className={navClass}>
            Sell Car
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:scale-105"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button as={Link} to="/auth">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

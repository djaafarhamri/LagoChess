import { Link } from "react-router";
import { useState } from "react";
import NavbarLogo from "./NavLogo";
import { useUser } from "../context/UserContext";
import github from "../assets/github-mark-white.png";

export default function Navbar() {
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const logoutApi = async () => {
    const res = await fetch(
      `${
        !import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_API_URL === "undefined"
          ? ""
          : import.meta.env.VITE_API_URL
      }/api/auth/logout`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      alert("error");
    } else {
      setIsDropdownOpen(false);
      logout();
    }
  };

  return (
    <nav className="nav-container">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="nav-logo">
          <NavbarLogo />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/puzzles" className="nav-link">
          Puzzles
        </Link>
        <Link to="/analyze" className="nav-link">
          Analyze
        </Link>
        <Link to="https://github.com/djaafarhamri/LagoChess" target="_blank" className="nav-link">
          <img src={github} alt="github" width={20} height={20} className="inline-block" />
        </Link>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button onClick={toggleDropdown} className="nav-link">
              {user.username}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[rgba(50,50,50,0.95)] border border-[rgba(255,215,0,0.3)] rounded-lg shadow-lg min-w-[160px] z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-[#ffd700] hover:bg-[rgba(139,69,19,0.3)] transition-all"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-3 text-[#ffd700] hover:bg-[rgba(139,69,19,0.3)] transition-all"
                >
                  Settings
                </Link>
                <button
                  onClick={logoutApi}
                  className="w-full text-left block px-4 py-3 text-[#ffd700] hover:bg-[rgba(220,53,69,0.3)] transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

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
    <nav className="flex justify-between items-center p-4 text-white">
      {/* Logo */}
      <div className="flex-1">
        <NavbarLogo />
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-2 justify-center items-center space-x-4 list-none">
        <li>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/puzzles"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg"
          >
            Puzzles
          </Link>
        </li>
        <li>
          <Link
            to="/analyze"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg"
          >
            Analyze
          </Link>
        </li>
        <li>
          <Link to="https://github.com/djaafarhamri/LagoChess" target="_blank">
            <div className="px-4 py-2 border border-gray-300 rounded-md shadow-md hover:shadow-lg cursor-pointer">
              <img src={github} alt="github" width={20} height={20} />
            </div>
          </Link>
        </li>
      </ul>

      {/* User Actions */}
      {user ? (
        <div className="flex-1 flex justify-end space-x-4 relative">
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg"
          >
            {user.username}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-11 mt-2 border border-gray-300 rounded-md shadow-lg">
              <Link
                to="/profile"
                className="block px-12 py-4 text-sm text-white  hover:text-gray-300"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-12 py-4 text-sm text-white hover:text-gray-300"
              >
                Settings
              </Link>
              <button
                onClick={logoutApi}
                className="w-full text-left block px-12 py-4 text-sm text-white hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex justify-end space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

import { Link } from "react-router";
import NavbarLogo from "./NavLogo";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 text-white">
      {/* Logo */}
      <div className="flex-1">
        <NavbarLogo />
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-2 justify-center space-x-4 list-none">
        <li><Link to="/" className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg">Home</Link></li>
        <li><Link to="/puzzles" className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg">Puzzles</Link></li>
        <li><Link to="/learn" className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg">Learn</Link></li>
        <li><Link to="/about" className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg">About</Link></li>
      </ul>

      {/* User Actions */}
      <div className="flex-1 flex justify-end space-x-4">
        <Link to="/login" className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg">Login</Link>
        <Link to="/settings" className="px-4 py-2 border border-gray-300 rounded-md shadow-md text-white hover:text-gray-300 hover:shadow-lg">Settings</Link>
      </div>
    </nav>
  );
}
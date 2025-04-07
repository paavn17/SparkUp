import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const logoutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/login");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <nav className="flex items-center justify-between px-4 py-2 h-16 bg-white shadow-md text-gray-800 relative z-50">
      {/* Left - Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Right - Navigation and Auth */}
      <div className="flex items-center space-x-6">
        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          {user && (
            <Link
              to="/create"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Create
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        {user ? (
          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              <img
                src={user.photoURL || ""}
                alt="User"
                className="h-10 w-10 rounded-full object-cover"
              />
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 mt-4 w-32 bg-white rounded-md shadow-lg  text-sm"
                onMouseLeave={closeDropdown}
              >
                <button
                  onClick={() => {
                    logoutUser();
                    closeDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

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
    <nav className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#1A102F] via-[#3C1A5B] to-[#1A102F] shadow-md text-white relative z-50 h-20 rounded">
  {/* Left - Logo */}
  <div className="flex items-center h-full">
    <Link to="/" className="flex items-center h-full">
      <img src="/image.png" alt="Logo" className="h-full w-auto object-contain rounded-full ml-5" />
    </Link>
  </div>

  {/* Right - Navigation and Auth */}
  <div className="flex items-center space-x-6">
    {/* Links */}
    <div className="hidden md:flex space-x-6">
      {user && (
        <Link
          to="/"
          className="text-gray-200 hover:text-white transition-colors duration-200"
        >
          Home
        </Link>
      )}
      {user && (
        <Link
          to="/profile"
          className="text-gray-200 hover:text-white transition-colors duration-200"
        >
          Profile
        </Link>
      )}
      {user && (
        <Link
          to="/create"
          className="text-gray-200 hover:text-white transition-colors duration-200"
        >
          Post my idea
        </Link>
      )}
    </div>

    {/* Auth Buttons */}
    {user ? (
      <div className="relative">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <img
            src={
              user?.photoURL ||
              `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.uid}`
            }
            className="h-10 w-10 rounded-full object-cover"
          />
        </button>

        {showDropdown && (
          <div
            className="absolute right-0 mt-4 w-32 bg-[#1A102F] rounded-md shadow-lg text-sm text-white border border-[#2A2545]"
            onMouseLeave={closeDropdown}
          >
            <button
              onClick={() => {
                logoutUser();
                closeDropdown();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-[#2A2545]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    ) : (
      <Link
        to="/login"
        className="bg-[#3C1A5B] hover:bg-[#4d2074] text-white px-4 py-2 rounded-md transition-colors duration-200"
      >
        Log In
      </Link>
    )}
  </div>
</nav>

  
  );
};

export default Navbar;

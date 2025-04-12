import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const logoutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/login");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <>
      {/* Navbar - hidden when sidebar is open */}
      {!sidebarOpen && (
        <nav className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#1A102F] via-[#3C1A5B] to-[#1A102F] shadow-md text-white relative z-50 h-20 rounded">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link to="/" className="flex items-center h-full">
              <img
                src="/image.png"
                alt="Logo"
                className="h-full w-auto object-contain rounded-full ml-5"
              />
            </Link>
          </div>

          {/* Right - Nav and Hamburger */}
          <div className="flex items-center space-x-6">
            {/* Desktop links */}
            <div className="hidden md:flex space-x-6">
              {user && <Link to="/">Home</Link>}
              {user && <Link to={`/profile/${user.uid}`}>Profile</Link>}
              {user && <Link to="/create">Post my idea</Link>}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button onClick={toggleSidebar}>
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Auth buttons */}
            {user ? (
              <div className="relative hidden md:block">
                <button onClick={toggleDropdown}>
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
                className="bg-[#3C1A5B] hover:bg-[#4d2074] text-white px-4 py-2 rounded-md transition-colors duration-200 hidden md:block"
              >
                Log In
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Sidebar with slide-in animation */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-500 ease-in-out ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      >
        <div
          className={`absolute right-0 top-0 h-full w-4/5 bg-gradient-to-br from-[#1A102F] via-[#3C1A5B] to-[#1A102F] text-white p-6 flex flex-col transition-transform duration-500 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top - Close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleSidebar}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-4 text-lg">
            {user && (
              <Link
                to="/"
                onClick={toggleSidebar}
                className="hover:text-violet-400"
              >
                Home
              </Link>
            )}
            {user && (
              <Link
                to={`/profile/${user.uid}`}
                onClick={toggleSidebar}
                className="hover:text-violet-400"
              >
                Profile
              </Link>
            )}
            {user && (
              <Link
                to="/create"
                onClick={toggleSidebar}
                className="hover:text-violet-400"
              >
                Post my idea
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={toggleSidebar}
                className="hover:text-violet-400"
              >
                Login
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  logoutUser();
                  toggleSidebar();
                }}
                className="text-left hover:text-violet-400"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;

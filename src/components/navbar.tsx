import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {auth} from '../config/firebase'
import {useAuthState} from "react-firebase-hooks/auth"

const Navbar = () => {
   
    const navigate = useNavigate();
    const [user] = useAuthState(auth)
  
  
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
    <nav className="flex items-center justify-between p-4 bg-black-500 shadow-md text-gray-300">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/logo.png" // Replace with your image path
            alt="Logo"
            className="h-8 w-auto" // Adjust height as needed
          />
        </Link>
      </div>

      {/* Right side - Navigation and Sign In */}
      <div className="flex items-center space-x-6">
        {/* Navigation options */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          {user && (
              <Link
                to="/create"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Create
              </Link>
            )}
        </div>

        {/* Sign In button */}
        {user ? (
        // If user is logged in, show Logout button
        <div>
            <img src={user.photoURL || ""} width="50" height={50} />
            <button onClick={logoutUser}>Logout</button>
        </div>
      ) : (
        // If user is logged out, show Login button
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
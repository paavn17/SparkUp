import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Used for navigation
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const registerUser = async (): Promise<void> => {
    setError(null);
    setMessage(null);
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);
      setMessage("User registered successfully! You can now log in.");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const loginUser = async (): Promise<void> => {
    setError(null);
    setMessage(null);
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500); // Redirect after 1.5s
    } catch (error: any) {
      setError(error.message);
    }
  };

  const logoutUser = async (): Promise<void> => {
    setError(null);
    setMessage(null);
    try {
      await signOut(auth);
      console.log("User signed out");
      setMessage("Logged out successfully.");
    } catch (error: any) {
      setError(error.message);
    }
  };

    const signInWithGoogle = async() =>{
         const result =  signInWithPopup(auth, provider)
         console.log(result)
         navigate('/')
        }
  

  return (


    <div className="h-[calc(100vh-150px)] overflow-hidden flex justify-center items-center text-white">
    <div className="p-6 rounded-lg shadow-2xl h-[400px] w-96 flex flex-col justify-between bg-gradient-to-br from-[#140222] via-[#1a032e] to-[#0e011c] border border-[#2c0e3c]">
      <h2 className="text-3xl font-bold text-center text-white drop-shadow">Login</h2>
  
      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-[#4b0c6d] rounded bg-[#1a082d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-[#4b0c6d] rounded bg-[#1a082d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
      </div>
  
      <div className="flex gap-2">
        <button
          onClick={loginUser}
          className="flex-1 bg-violet-700 text-white p-2 rounded hover:bg-violet-900 transition shadow-sm"
        >
          Log In
        </button>
      </div>
  
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Don't have an account?</span>
        <Link to="/signup" className="text-violet-400 hover:underline">
          Register
        </Link>
      </div>
  
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3b2156]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#1a032b] px-2 text-gray-500">OR</span>
        </div>
      </div>
  
      <button className="w-full bg-white text-[#2e1065] p-2 rounded hover:bg-violet-800 hover:text-white flex items-center justify-center gap-2 transition" onClick={signInWithGoogle}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
          <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
        </svg>
        Sign in with Google
      </button>
    </div>
  </div>
  

  );
};

export default Login;

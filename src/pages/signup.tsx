import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithPopup
} from "firebase/auth";
import { auth,provider } from "../config/firebase";
import { Link } from "react-router-dom";




const Signup = () => {


      const [email, setEmail] = useState<string>("");
      const [password, setPassword] = useState<string>("");
      const [error, setError] = useState<string | null>(null);
      const [message, setMessage] = useState<string | null>(null);
      const navigate = useNavigate(); // Used for navigation

      const signInWithGoogle = async() =>{
       const result =  signInWithPopup(auth, provider)
       console.log(result)
       navigate('/')
      }


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
  return (
    <div className="flex justify-center items-center mt-[175px] text-black">
    <div className="p-6 rounded-lg shadow-lg h-[400px] w-96 flex flex-col justify-between">
      <h2 className="text-2xl font-bold text-center">Register</h2>
  
      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
      </div>
  
      <div className="flex gap-2">
        <button onClick={registerUser} className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Register
        </button>
      </div>

        <div className="flex justify-between items-center">
        <span className="text-gray-400">Already have an account?</span>
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
  
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-500"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-950 px-2 text-gray-400">OR</span>
        </div>
      </div>
  
      <button className="w-full bg-white text-black p-2 rounded hover:bg-green-500 hover:text-white flex items-center justify-center gap-2" onClick={signInWithGoogle}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
          <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
        </svg>
        Sign in with Google
      </button>
    </div>
  </div>
  )
}

export default Signup
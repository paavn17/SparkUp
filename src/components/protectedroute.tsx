import { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;

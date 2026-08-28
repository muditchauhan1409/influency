// PASTE PATH: src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export function CreatorRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (user.role === "brand") return <Navigate to="/brand-dashboard" replace />;
  return children;
}

export function BrandRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (user.role === "creator") return <Navigate to="/dashboard" replace />;
  return children;
}

export function AuthRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function SharedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
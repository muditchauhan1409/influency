import { Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoleSelect from "./pages/RoleSelect";
import ProfileSetup from "./pages/ProfileSetup";
import VerifyConnect from "./pages/VerifyConnect";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/verify-connect" element={<VerifyConnect />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
    </Routes>
  );
}
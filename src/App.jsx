// src/App.jsx
import { Routes, Route } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import SignUp from "./pages/SignUp";
import ProfileSetup from "./pages/ProfileSetup";
import VerifyConnect from "./pages/VerifyConnect";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/UserProfile";
import Settings from "./pages/Settings";

function ComingSoon({ title }) {
  return (
    <div style={{ padding: 60, fontFamily: "sans-serif" }}>
      <h2>{title}</h2>
      <p>This page is coming soon.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/verify-connect" element={<VerifyConnect />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/discover" element={<ComingSoon title="Discover" />} />
      <Route path="/collaborations" element={<ComingSoon title="Collaborations" />} />
      <Route path="/messages" element={<ComingSoon title="Messages" />} />
      <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
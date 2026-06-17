// src/App.jsx
import { Routes, Route } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import SignUp from "./pages/SignUp";
import ProfileSetup from "./pages/ProfileSetup";
import VerifyConnect from "./pages/VerifyConnect";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";

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
    </Routes>
  );
}

export default App;
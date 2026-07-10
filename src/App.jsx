// PASTE PATH: src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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
import Messages from "./pages/Messages";
import NotificationsPanel from "./components/NotificationsPanel";
import { useNotificationsPanel } from "./scripts/notifications";
import Discover from "./pages/Discover";
import Collaborations from "./pages/Collaborations";
import Analytics from "./pages/Analytics";
import BrandDashboard from "./pages/BrandDashboard";
import BrandFormCreate from "./pages/BrandFormCreate";
import BrandFormResponses from "./pages/BrandFormResponses"; // ← NEW

function ComingSoon({ title }) {
  return (
    <div style={{ padding: 60, fontFamily: "sans-serif" }}>
      <h2>{title}</h2>
      <p>This page is coming soon.</p>
    </div>
  );
}

function App() {
  const notif = useNotificationsPanel();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/verify-connect" element={<VerifyConnect />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />

        {/* Creator Routes */}
        <Route path="/dashboard" element={
            <Dashboard darkMode={darkMode} setDarkMode={setDarkMode}
              onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          }
        />
        <Route path="/discover" element={<Discover onOpenNotifications={notif.open} />} />
        <Route path="/collaborations" element={<Collaborations onOpenNotifications={notif.open} />} />
        <Route path="/messages" element={
            <Messages onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          }
        />
        <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
        <Route path="/profile" element={
            <Profile darkMode={darkMode} setDarkMode={setDarkMode}
              onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          }
        />
        <Route path="/analytics" element={<Analytics onOpenNotifications={notif.open} />} />
        <Route path="/settings" element={
            <Settings darkMode={darkMode} setDarkMode={setDarkMode}
              onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          }
        />

        {/* Brand Routes */}
        <Route path="/brand-dashboard" element={<BrandDashboard />} />
        <Route path="/brand-forms/create" element={<BrandFormCreate />} />
        <Route path="/brand-forms" element={<ComingSoon title="Brand Forms" />} />
        <Route path="/brand-discover" element={<ComingSoon title="Find Creators" />} />
        <Route path="/brand-analytics" element={<ComingSoon title="Brand Analytics" />} />
        <Route path="/brand-form-responses/:formId" element={<BrandFormResponses />} /> {/* ← NEW */}

      </Routes>
      <NotificationsPanel
        isOpen={notif.isOpen}
        onClose={notif.close}
        activeTab={notif.activeTab}
        setActiveTab={notif.setActiveTab}
        notifications={notif.notifications}
        unreadCount={notif.unreadCount}
        markAllRead={notif.markAllRead}
        markRead={notif.markRead}
      />
    </>
  );
}

export default App;
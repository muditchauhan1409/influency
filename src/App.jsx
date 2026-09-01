// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Onboarding pages (root mein rehte hain)
import RoleSelect from "./pages/RoleSelect";
import SignUp from "./pages/SignUp";
import ProfileSetup from "./pages/ProfileSetup";
import VerifyConnect from "./pages/VerifyConnect";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";

// Creator pages
import Dashboard from "./pages/creator/Dashboard";
import Profile from "./pages/creator/UserProfile";
import Settings from "./pages/creator/Settings";
import Messages from "./pages/creator/Messages";
import Discover from "./pages/creator/Discover";
import Collaborations from "./pages/creator/Collaborations";
import Analytics from "./pages/creator/Analytics";

// Brand pages
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandFormCreate from "./pages/brand/BrandFormCreate";
import BrandFormResponses from "./pages/brand/BrandFormResponses";
import BrandForms from "./pages/brand/BrandForms";
import { CreatorRoute, BrandRoute, SharedRoute } from "./components/ProtectedRoute";
import BrandProfile from "./pages/brand/BrandProfile";
import BrandSettings from "./pages/brand/BrandSettings";
import BrandDiscover from "./pages/brand/BrandDiscover";
import BrandAnalytics from "./pages/brand/BrandAnalytics";

// Components
import NotificationsPanel from "./components/NotificationsPanel";
import { useNotificationsPanel } from "./scripts/notifications";



import { getCurrentUser } from "./scripts/auth";

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
  const currentUser = getCurrentUser(); // { id, role } ya null

  

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
        {/* Onboarding */}
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
          <CreatorRoute>
            <Dashboard darkMode={darkMode} setDarkMode={setDarkMode}
              onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          </CreatorRoute>
        } />
        <Route path="/discover" element={
          <CreatorRoute>
            <Discover onOpenNotifications={notif.open} />
          </CreatorRoute>
        } />
        <Route path="/collaborations" element={
          <CreatorRoute>
            <Collaborations onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          </CreatorRoute>
        } />
        
        <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
        <Route path="/profile" element={
          <CreatorRoute>
            <Profile darkMode={darkMode} setDarkMode={setDarkMode}
              onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          </CreatorRoute>
        } />
        <Route path="/analytics" element={
          <CreatorRoute>
            <Analytics onOpenNotifications={notif.open} />
          </CreatorRoute>
        } />
        <Route path="/settings" element={
          <CreatorRoute>
            <Settings darkMode={darkMode} setDarkMode={setDarkMode}
              onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
          </CreatorRoute>
        } />

        {/* Brand Routes */}
        <Route path="/brand-dashboard" element={
          <BrandRoute>
            <BrandDashboard />
          </BrandRoute>
        } />
        <Route path="/brand-forms/create" element={
          <BrandRoute>
            <BrandFormCreate />
          </BrandRoute>
        } />
        <Route path="/brand-forms" element={
          <BrandRoute>
            <BrandForms />
          </BrandRoute>
        } />
              <Route path="/brand/profile" element={
        <BrandRoute>
          <BrandProfile
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onOpenNotifications={notif.open}
            notifUnreadCount={notif.unreadCount}
          />
        </BrandRoute>
      } />
        <Route path="/brand-form-responses/:formId" element={
          <BrandRoute>
            <BrandFormResponses />
          </BrandRoute>
        } />
        <Route path="/brand-discover" element={
  <BrandRoute>
    <BrandDiscover onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
  </BrandRoute>
} />
        <Route path="/brand-analytics" element={
  <BrandRoute>
    <BrandAnalytics onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
  </BrandRoute>
} />
        <Route path="/messages" element={
  <SharedRoute>
    <Messages onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
  </SharedRoute>
} />

<Route path="/brand-settings" element={
  <BrandRoute>
    <BrandSettings darkMode={darkMode} setDarkMode={setDarkMode}
      onOpenNotifications={notif.open} notifUnreadCount={notif.unreadCount} />
  </BrandRoute>
} />

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
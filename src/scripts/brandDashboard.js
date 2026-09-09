// PASTE PATH: src/scripts/brandDashboard.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";

// ── Existing hook (unchanged) ──
export function useBrandDashboard() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchForms();
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/posts/brand`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCampaigns(data.posts);
    } catch (err) {
      console.error("Fetch campaigns error:", err);
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/my-forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setForms(data.forms);
    } catch (err) {
      console.error("Fetch forms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = () => navigate("/brand-forms/create");
  const handleViewForm = (formId) => navigate(`/brand-form-responses/${formId}`);

  return { forms, loading, user, handleCreateForm, handleViewForm, fetchForms, campaigns, campaignsLoading, fetchCampaigns };
}

// ── New hook for Brand Collaborations ──
export function useBrandCollabs() {
  const [collabs, setCollabs] = useState([]);
  const [collabsLoading, setCollabsLoading] = useState(false);

  // Applicants modal
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Approve modal
  const [approveModal, setApproveModal] = useState(null); // collabId
  const [approveFeedback, setApproveFeedback] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);

  const token = () => localStorage.getItem("token");
  const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

  const fetchCollabs = useCallback(async () => {
    setCollabsLoading(true);
    try {
      const res = await fetch(`${API_URL}/collab/brand`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setCollabs(data.collabs);
    } catch (err) {
      console.error("Fetch brand collabs error:", err);
    } finally {
      setCollabsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCollabs(); }, []);

  // Fetch applicants for a post
  const fetchApplicants = async (postId) => {
    setApplicantsLoading(true);
    try {
      const res = await fetch(`${API_URL}/collab/applicants/${postId}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setApplicants(data.applicants);
    } catch (err) {
      console.error("Fetch applicants error:", err);
    } finally {
      setApplicantsLoading(false);
    }
  };

  // Brand accepts a creator
  const brandAccept = async (postId, creatorId) => {
    try {
      const res = await fetch(`${API_URL}/collab/brand-accept/${postId}/${creatorId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        fetchCollabs();
        fetchApplicants(postId); // refresh applicants modal
      }
    } catch (err) {
      console.error("Brand accept error:", err);
    }
  };

  // Brand rejects a creator (just update applicant status in Post)
  const brandReject = async (postId, creatorId) => {
    try {
      await fetch(`${API_URL}/collab/brand-reject/${postId}/${creatorId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      fetchApplicants(postId);
    } catch (err) {
      console.error("Brand reject error:", err);
    }
  };

  // Brand approves submitted work → Completed
  const approveWork = async (collabId) => {
    setApproveLoading(true);
    try {
      const res = await fetch(`${API_URL}/collab/approve/${collabId}`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: approveFeedback }),
      });
      const data = await res.json();
      if (data.success) {
        setApproveModal(null);
        setApproveFeedback("");
        fetchCollabs();
      }
    } catch (err) {
      console.error("Approve work error:", err);
    } finally {
      setApproveLoading(false);
    }
  };

  return {
    collabs, collabsLoading, fetchCollabs,
    applicants, applicantsLoading, fetchApplicants,
    brandAccept, brandReject,
    approveWork,
    approveModal, setApproveModal,
    approveFeedback, setApproveFeedback,
    approveLoading,
  };
}

// ── Existing useCreateForm hook (unchanged) ──
export function useCreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [includeFixedTemplate, setIncludeFixedTemplate] = useState(true);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      { id: `cq_${Date.now()}`, type: "text", label: "", options: [], required: true, profileField: null },
    ]);
  };

  const updateQuestion = (index, key, value) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [key]: value } : q))
    );
  };

  const removeQuestion = (index) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Form title required"); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, description, includeFixedTemplate,
          customQuestions: customQuestions.filter((q) => q.label.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to create form"); setLoading(false); return; }
      navigate("/brand-dashboard");
    } catch { setError("Cannot connect to server"); setLoading(false); }
  };

  return {
    title, setTitle, description, setDescription,
    includeFixedTemplate, setIncludeFixedTemplate,
    customQuestions, addCustomQuestion, updateQuestion, removeQuestion,
    handleSubmit, loading, error,
  };
}
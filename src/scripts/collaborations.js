// PASTE PATH: src/scripts/collaborations.js
import { useState, useMemo, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api";

export const COLLAB_TABS = ["Active", "Pending", "Completed", "Forms"];

// Map backend status → frontend tab
const STATUS_TAB_MAP = {
  active:         "Active",
  brand_accepted: "Pending",
  submitted:      "Active",   // still active until completed
  completed:      "Completed",
  declined:       null,       // hide declined
};

export function useCollaborations() {
  const [activeTab, setActiveTab] = useState("Active");

  // ── Collabs state ──
  const [collabs, setCollabs] = useState([]);
  const [collabsLoading, setCollabsLoading] = useState(false);

  // ── Forms state ──
  const [forms, setForms] = useState([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [formAnswers, setFormAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Submit work modal state ──
  const [submitWorkModal, setSubmitWorkModal] = useState(null); // collabId
  const [submitWorkUrl, setSubmitWorkUrl] = useState("");
  const [submitWorkNote, setSubmitWorkNote] = useState("");
  const [submitWorkLoading, setSubmitWorkLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  // ── Fetch collabs ──
  const fetchCollabs = useCallback(async () => {
    setCollabsLoading(true);
    try {
      const res = await fetch(`${API_URL}/collab/my`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) setCollabs(data.collabs);
    } catch (err) {
      console.error("Fetch collabs error:", err);
    } finally {
      setCollabsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCollabs(); }, []);

  useEffect(() => {
    if (activeTab === "Forms") fetchForms();
  }, [activeTab]);

  // ── Fetch forms ──
  const fetchForms = async () => {
    setFormsLoading(true);
    try {
      const res = await fetch(`${API_URL}/forms/received`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) setForms(data.forms);
    } catch (err) {
      console.error("Fetch forms error:", err);
    } finally {
      setFormsLoading(false);
    }
  };

  // ── Creator accepts collab (Pending → Active) ──
  const acceptCollab = async (collabId) => {
    try {
      const res = await fetch(`${API_URL}/collab/creator-accept/${collabId}`, {
        method: "POST",
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) fetchCollabs();
    } catch (err) {
      console.error("Accept collab error:", err);
    }
  };

  // ── Creator declines collab ──
  const declineCollab = async (collabId) => {
    try {
      const res = await fetch(`${API_URL}/collab/creator-decline/${collabId}`, {
        method: "POST",
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) fetchCollabs();
    } catch (err) {
      console.error("Decline collab error:", err);
    }
  };

  // ── Creator submits work ──
  const submitWork = async () => {
    if (!submitWorkModal) return;
    setSubmitWorkLoading(true);
    try {
      const res = await fetch(`${API_URL}/collab/submit/${submitWorkModal}`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionUrl: submitWorkUrl,
          submissionNote: submitWorkNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitWorkModal(null);
        setSubmitWorkUrl("");
        setSubmitWorkNote("");
        fetchCollabs();
      }
    } catch (err) {
      console.error("Submit work error:", err);
    } finally {
      setSubmitWorkLoading(false);
    }
  };

  // ── Forms ──
  const openForm = async (formId) => {
    try {
      const res = await fetch(`${API_URL}/forms/${formId}/fill`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) {
        setActiveForm(data.form);
        setFormAnswers(data.form.autoFilledAnswers || {});
        setSubmitSuccess(false);
      }
    } catch (err) { console.error("Open form error:", err); }
  };

  const updateAnswer = (questionId, value) =>
    setFormAnswers((prev) => ({ ...prev, [questionId]: value }));

  const submitForm = async () => {
    if (!activeForm) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/forms/${activeForm._id}/submit`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formAnswers, autoFilled: true }),
      });
      const data = await res.json();
      if (data.success) { setSubmitSuccess(true); setActiveForm(null); fetchForms(); }
    } catch (err) { console.error("Submit form error:", err); }
    finally { setSubmitting(false); }
  };

  const closeForm = () => { setActiveForm(null); setFormAnswers({}); setSubmitSuccess(false); };

  const dismissForm = async (formId) => {
    try {
      await fetch(`${API_URL}/forms/${formId}/dismiss`, { method: "POST", headers: authHeaders });
      fetchForms();
    } catch (err) { console.error("Dismiss error:", err); }
  };

  // ── Map collabs → tabs ──
  const filtered = useMemo(() => {
    return collabs
      .filter((c) => STATUS_TAB_MAP[c.status] === activeTab)
      .map((c) => ({
        _id:       c._id,
        status:    c.status,
        brand:     c.brand?.name || "Brand",
        initials:  (c.brand?.name || "B").substring(0, 2).toUpperCase(),
        bg:        "linear-gradient(135deg,#7a1f33,#c87a4a)",
        campaign:  c.post?.title || "Campaign",
        budget:    c.post?.budget || "—",
        deadline:  c.completedAt
          ? `Completed ${new Date(c.completedAt).toLocaleDateString("en-IN")}`
          : c.creatorAcceptedAt
          ? new Date(c.creatorAcceptedAt).toLocaleDateString("en-IN")
          : "Awaiting your response",
        progress:  c.status === "completed" ? 100 : c.status === "active" ? 50 : 0,
        submissionUrl:  c.submissionUrl,
        submissionNote: c.submissionNote,
        brandFeedback:  c.brandFeedback,
      }));
  }, [collabs, activeTab]);

  const counts = useMemo(() => ({
    Active:    collabs.filter((c) => STATUS_TAB_MAP[c.status] === "Active").length,
    Pending:   collabs.filter((c) => STATUS_TAB_MAP[c.status] === "Pending").length,
    Completed: collabs.filter((c) => STATUS_TAB_MAP[c.status] === "Completed").length,
    Forms:     forms.filter((f) => f.status === "pending").length,
  }), [collabs, forms]);

  return {
    activeTab, setActiveTab,
    filtered, counts,
    collabsLoading,
    acceptCollab, declineCollab,
    submitWorkModal, setSubmitWorkModal,
    submitWorkUrl,  setSubmitWorkUrl,
    submitWorkNote, setSubmitWorkNote,
    submitWorkLoading, submitWork,
    forms, formsLoading,
    activeForm, formAnswers,
    updateAnswer, openForm, submitForm, closeForm,
    submitting, submitSuccess,
    dismissForm,
  };
}
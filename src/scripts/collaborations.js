// PASTE PATH: src/scripts/collaborations.js
import { useState, useMemo, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export const COLLAB_TABS = ["Active", "Pending", "Completed", "Forms"];

export const COLLABORATIONS = [
  {
    id: "col1", brand: "Nike India", initials: "NK", bg: "#000",
    campaign: "Spring '26 Collection Launch", status: "Active",
    budget: "₹2,00,000", deadline: "Jul 12, 2026", progress: 65,
  },
  {
    id: "col2", brand: "boAt Lifestyle", initials: "BT", bg: "rgba(99,102,241,0.85)",
    campaign: "Wireless Earbuds Review Series", status: "Active",
    budget: "₹1,20,000", deadline: "Jun 30, 2026", progress: 30,
  },
  {
    id: "col3", brand: "Nykaa", initials: "NY", bg: "rgba(236,72,153,0.85)",
    campaign: "Monsoon Skincare Edit", status: "Pending",
    budget: "₹80,000", deadline: "Awaiting brand approval", progress: 0,
  },
  {
    id: "col4", brand: "Zomato", initials: "ZM", bg: "rgba(239,68,68,0.85)",
    campaign: "Foodie Friday Series", status: "Pending",
    budget: "₹90,000", deadline: "Awaiting your response", progress: 0,
  },
  {
    id: "col5", brand: "Starbucks", initials: "SB", bg: "rgba(245,158,11,0.85)",
    campaign: "Festive Cup Reveal", status: "Completed",
    budget: "₹60,000", deadline: "Completed May 18, 2026", progress: 100, earnedTrust: 8,
  },
  {
    id: "col6", brand: "Myntra", initials: "MM", bg: "rgba(212,163,115,0.9)",
    campaign: "End of Season Sale Promo", status: "Completed",
    budget: "₹1,50,000", deadline: "Completed Apr 02, 2026", progress: 100, earnedTrust: 12,
  },
];

export function useCollaborations() {
  const [activeTab, setActiveTab] = useState("Active");

  // Forms state
  const [forms, setForms] = useState([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // form to fill
  const [formAnswers, setFormAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (activeTab === "Forms") fetchForms();
  }, [activeTab]);

  const fetchForms = async () => {
    setFormsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/received`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setForms(data.forms);
    } catch (err) {
      console.error("Fetch forms error:", err);
    } finally {
      setFormsLoading(false);
    }
  };

  const openForm = async (formId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/${formId}/fill`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setActiveForm(data.form);
        // Auto-fill answers from profile
        setFormAnswers(data.form.autoFilledAnswers || {});
        setSubmitSuccess(false);
      }
    } catch (err) {
      console.error("Open form error:", err);
    }
  };

  const updateAnswer = (questionId, value) => {
    setFormAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitForm = async () => {
    if (!activeForm) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/${activeForm._id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: formAnswers, autoFilled: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setActiveForm(null);
        fetchForms(); // refresh list
      }
    } catch (err) {
      console.error("Submit form error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setActiveForm(null);
    setFormAnswers({});
    setSubmitSuccess(false);
  };
  const dismissForm = async (formId) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/forms/${formId}/dismiss`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchForms(); // refresh
  } catch (err) {
    console.error("Dismiss error:", err);
  }
};

  const filtered = useMemo(
    () => COLLABORATIONS.filter((c) => c.status === activeTab),
    [activeTab]
  );

  const counts = useMemo(() => {
    const base = COLLAB_TABS.reduce((acc, tab) => {
      acc[tab] = COLLABORATIONS.filter((c) => c.status === tab).length;
      return acc;
    }, {});
    base["Forms"] = forms.filter((f) => f.status === "pending").length;
    return base;
  }, [forms]);

  return {
    activeTab, setActiveTab,
    filtered, counts,
    forms, formsLoading,
    activeForm, formAnswers,
    updateAnswer, openForm, submitForm, closeForm,
    submitting, submitSuccess,
    dismissForm,
  };
}
// PASTE PATH: src/scripts/brandDashboard.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export function useBrandDashboard() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchForms();
  }, []);

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
  const handleViewForm = (formId) => navigate(`/brand-form-responses/${formId}`); // ← FIXED

  return { forms, loading, user, handleCreateForm, handleViewForm, fetchForms };
}

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
      {
        id: `cq_${Date.now()}`,
        type: "text",
        label: "",
        options: [],
        required: true,
        profileField: null,
      },
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
    if (!title.trim()) {
      setError("Form title required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          includeFixedTemplate,
          customQuestions: customQuestions.filter((q) => q.label.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create form");
        setLoading(false);
        return;
      }

      navigate("/brand-dashboard");
    } catch (err) {
      setError("Cannot connect to server");
      setLoading(false);
    }
  };

  return {
    title, setTitle,
    description, setDescription,
    includeFixedTemplate, setIncludeFixedTemplate,
    customQuestions,
    addCustomQuestion,
    updateQuestion,
    removeQuestion,
    handleSubmit,
    loading,
    error,
  };
}
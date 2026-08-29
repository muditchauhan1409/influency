import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export function useAnalytics(role) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/analytics/${role}`, { headers: authHeaders() });
        const json = await res.json();
        if (json.success) setData(json);
        else setError(json.message || "Failed to load analytics");
      } catch (err) {
        setError("Cannot connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [role]);

  return { data, loading, error };
}
// PASTE PATH: src/scripts/feed.js
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export const NICHE_OPTIONS = [
  "Fashion", "Beauty", "Lifestyle", "Food", "Travel",
  "Fitness", "Tech", "Gaming", "Art", "Clothing", "Cafe", "Gym",
];

export function useFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatorNiches, setCreatorNiches] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        setCreatorNiches(data.creatorNiches);
      }
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyToPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/posts/${postId}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: "Cannot connect to server" };
    }
  };

  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, liked: data.liked, likes: Array(data.likesCount).fill(null) }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return { posts, loading, creatorNiches, fetchFeed, applyToPost, toggleLike };
}

export function useBrandPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [niches, setNiches] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleNiche = (niche) => {
    setNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const handleImageChange = (file) => {
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Title required"); return; }
    if (niches.length === 0) { setError("Select at least one niche"); return; }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);
      formData.append("niches", JSON.stringify(niches));
      if (image) formData.append("image", image);

      const res = await fetch(`${API_URL}/posts/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create post");
        return;
      }

      setSuccess(true);
      setTitle(""); setDescription(""); setBudget("");
      setNiches([]); setImage(null); setImagePreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return {
    title, setTitle,
    description, setDescription,
    budget, setBudget,
    niches, toggleNiche,
    image, imagePreview, handleImageChange,
    loading, error, success,
    handleSubmit,
  };
}
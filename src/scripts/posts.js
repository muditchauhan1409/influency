// PASTE PATH: src/scripts/posts.js
import { useState, useEffect } from "react";

import { API_URL } from "../config/api";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/social-posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      console.error("Feed fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async ({ caption, imageFile }) => {
    if (!caption?.trim() && !imageFile) {
      setPostError("Add a caption or a photo");
      return false;
    }
    setPosting(true);
    setPostError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("caption", caption || "");
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/social-posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setPostError(data.message || "Failed to create post");
        return false;
      }

      setPosts((prev) => [data.post, ...prev]);
      return true;
    } catch (err) {
      setPostError("Cannot connect to server");
      return false;
    } finally {
      setPosting(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/social-posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  return { posts, loading, posting, postError, createPost, deletePost, refetch: fetchFeed };
}

export function useUserPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/social-posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      console.error("User posts fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, refetch: fetchUserPosts };
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getAuthHeader, logout } from "./api/auth";

const API_URL = "http://127.0.0.1:8000/api/posts/";
const USER_ME_URL = "http://127.0.0.1:8000/api/auth/users/me/";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);

  // For editing posts
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  // -----------------------------
  // Fetch posts
  // -----------------------------
  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Check if current user is superuser
  // -----------------------------
  const checkSuperuser = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await axios.get(USER_ME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSuperuser(res.data.is_superuser);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchPosts();
      checkSuperuser();
    }
  }, [loggedIn]);

  // -----------------------------
  // Add a new post
  // -----------------------------
  const handleAddPost = async () => {
    if (!newTitle || !newContent) return alert("Fill in both fields");
    try {
      await axios.post(
        API_URL,
        { title: newTitle, content: newContent },
        { headers: getAuthHeader() }
      );
      setNewTitle("");
      setNewContent("");
      fetchPosts();
    } catch (err) {
      alert("Cannot add post: make sure you are logged in.");
    }
  };

  // -----------------------------
  // Delete post (superuser only)
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`, { headers: getAuthHeader() });
      fetchPosts();
    } catch (err) {
      alert("Only superusers can delete posts.");
    }
  };

  // -----------------------------
  // Update post (superuser only)
  // -----------------------------
  const handleUpdate = async (id) => {
    if (!editingTitle || !editingContent) return alert("Fill in both fields");

    try {
      await axios.put(
        `${API_URL}${id}/`,
        { title: editingTitle, content: editingContent },
        { headers: getAuthHeader() }
      );
      setEditingPostId(null);
      setEditingTitle("");
      setEditingContent("");
      fetchPosts();
    } catch (err) {
      alert("Only superusers can edit posts.");
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setIsSuperuser(false);
    setPosts([]);
    setNewTitle("");
    setNewContent("");
    setEditingPostId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  // -----------------------------
  // Render login/signup screen if not logged in
  // -----------------------------
  if (!loggedIn) {
    return showSignup ? (
      <Signup onSignupSuccess={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={() => setLoggedIn(true)}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  // -----------------------------
  // Main app render
  // -----------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>My Blog</h1>

      {isSuperuser && (
        <p style={{ color: "red" }}>
          ⚡ You are logged in as <strong>SUPERUSER</strong>
        </p>
      )}

      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>

      {/* Posts List */}
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "20px" }}>
            {editingPostId === post.id ? (
              <div>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <br />
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <br />
                <button onClick={() => handleUpdate(post.id)}>Save</button>
                <button onClick={() => setEditingPostId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>
                  <em>Author: {post.author || "Guest"}</em>
                </p>
                {isSuperuser && (
                  <div>
                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setEditingTitle(post.title);
                        setEditingContent(post.content);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* New Post Form */}
      {loggedIn && (
        <div style={{ marginTop: "20px" }}>
          <h2>New Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <br />
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <br />
          <button onClick={handleAddPost}>Add Post</button>
        </div>
      )}
    </div>
  );
}

export default App;

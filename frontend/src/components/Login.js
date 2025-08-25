import React, { useState } from "react";
import { login } from "../api/auth"; // adjust path if needed

function Login({ onLogin, onShowSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      alert("Login successful!");
      onLogin(); // optional callback to update app state
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log in</button>
      </form>

      <button onClick={onShowSignup} style={{ marginTop: "10px" }}>
        Create a new account
      </button>
    </div>
  );
}

export default Login;

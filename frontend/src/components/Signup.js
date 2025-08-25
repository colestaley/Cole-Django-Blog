import React, { useState } from "react";
import axios from "axios";

const SIGNUP_URL = "http://127.0.0.1:8000/api/auth/signup/";

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post(SIGNUP_URL, { username, password });
      alert("User created! Please log in.");
      onSignupSuccess(); // switch back to login screen
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;

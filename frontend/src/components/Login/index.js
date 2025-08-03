import React, { useState } from "react";
import "./index.css";

export default function Login({ onLoginSuccess, onCancel }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        onLoginSuccess(data);
      } else {
        setError("Login failed: wrong email or password");
      }
    } catch {
      setError("Login failed: unable to connect");
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>User Login</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        name="email"
        value={form.email}
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={form.password}
        placeholder="Password"
        onChange={handleChange}
      />
      <div className="form-buttons">
        <button type="submit" className="btn-primary">Login</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

import React, { useEffect, useState } from "react";
import "./index.css";

export default function UserForm({ editMode, userId, onCancel, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editMode && userId) {
      fetchUser();
    }
  }, [editMode, userId]);

  async function fetchUser() {
    try {
      const res = await fetch(`http://localhost:5000/user/${userId}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setForm({ name: data.name, email: data.email, password: "" });
    } catch {
      setError("Failed to load user data.");
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || (!editMode && !form.password)) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const url = editMode ? `http://localhost:5000/user/${userId}` : "http://localhost:5000/users";
      const method = editMode ? "PUT" : "POST";
      const body = editMode ? JSON.stringify({ name: form.name, email: form.email }) : JSON.stringify(form);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error submitting form");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{editMode ? "Edit User" : "Create User"}</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        name="name"
        value={form.name}
        placeholder="Name"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={form.email}
        placeholder="Email"
        onChange={handleChange}
      />
      {!editMode && (
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
        />
      )}

      <div className="form-buttons">
        <button type="submit" className="btn-primary">{editMode ? "Update" : "Create"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

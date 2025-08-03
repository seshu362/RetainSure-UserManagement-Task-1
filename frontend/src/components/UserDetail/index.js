import React, { useEffect, useState } from "react";
import "./index.css";

export default function UserDetail({ userId, onBack, onEdit }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  async function fetchUserDetail() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 404) {
        setError("User not found");
      } else {
        setError("Error loading user");
      }
    } catch (err) {
      setError("Error fetching user data");
    }
    setLoading(false);
  }

  async function onDelete() {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`http://localhost:5000/user/${userId}`, { method: "DELETE" });
        if (res.ok) {
          alert("User deleted");
          onBack();
        } else {
          alert("Failed to delete user");
        }
      } catch (err) {
        alert("Error deleting user");
      }
    }
  }

  if (loading) return <p>Loading user details...</p>;
  if (error) return (
    <div>
      <p className="error">{error}</p>
      <button onClick={onBack}>Back</button>
    </div>
  );

  return (
    <div>
      <h2>User Details</h2>
      <p><strong>Name: </strong>{user.name}</p>
      <p><strong>Email: </strong>{user.email}</p>

      <button className="btn-primary" onClick={onEdit}>Edit</button>
      <button className="btn-danger" onClick={onDelete}>Delete</button>
      <button onClick={onBack}>Back to List</button>
    </div>
  );
}

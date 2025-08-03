import React, { useEffect, useState } from "react";
import "./index.css";

export default function UserList({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchName) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchName, users]);

  async function fetchUsers() {
    try {
      const res = await fetch("http://localhost:5000/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  return (
    <div>
      <h2>Users</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Search by name..."
        value={searchName}
        onChange={e => setSearchName(e.target.value)}
      />
      <ul className="user-list">
        {filteredUsers.length === 0 && <li>No users found.</li>}
        {filteredUsers.map(user => (
          <li key={user.id} className="user-item">
            <span>{user.name} ({user.email})</span>
            <button onClick={() => onUserSelect(user.id)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

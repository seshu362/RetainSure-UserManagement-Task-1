import React, { useState } from "react";
import UserList from "../UserList";
import UserDetail from "../UserDetail";
import UserForm from "../UserForm";
import Login from "../Login";
import "./index.css";

export default function Dashboard() {
  const [mode, setMode] = useState("list"); // "list", "detail", "create", "edit", "login"
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);

  const selectUser = (id) => {
    setSelectedUserId(id);
    setMode("detail");
  };

  const startCreateUser = () => setMode("create");
  const startLogin = () => setMode("login");
  const backToList = () => {
    setSelectedUserId(null);
    setMode("list");
  };
  const startEditUser = (id) => {
    setSelectedUserId(id);
    setMode("edit");
  };

  const onLoginSuccess = (info) => {
    setLoginInfo(info);
    setMode("list");
  };

  return (
    <div className="dashboard">
      <header>
        <h1>User Management System</h1>
        <nav>
          <button onClick={backToList}>All Users</button>
          <button onClick={startCreateUser}>Add User</button>
          <button onClick={startLogin}>Login</button>
          {loginInfo && loginInfo.status === "success" && (
            <span className="login-info">Logged in as user ID: {loginInfo.user_id}</span>
          )}
        </nav>
      </header>

      <section className="main-content">
        {mode === "list" && <UserList onUserSelect={selectUser} />}
        {mode === "detail" && selectedUserId && (
          <UserDetail
            userId={selectedUserId}
            onBack={backToList}
            onEdit={() => startEditUser(selectedUserId)}
          />
        )}
        {(mode === "create" || mode === "edit") && (
          <UserForm
            editMode={mode === "edit"}
            userId={selectedUserId}
            onCancel={backToList}
            onSuccess={backToList}
          />
        )}
        {mode === "login" && <Login onLoginSuccess={onLoginSuccess} onCancel={backToList} />}
      </section>
    </div>
  );
}

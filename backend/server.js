const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const path = require("path");

let db;
const app = express();
app.use(express.json());
app.use(cors());

// Insert default users if none exist
const insertDefaultUsers = async () => {
  const defaultUsers = [
    { name: "Ram", email: "ram123@gmail.com", password: "ram123" },
    { name: "Varun", email: "varun123@gmail.com", password: "varun123" },
    { name: "Krishna", email: "krishna@gmail.com.com", password: "krishna123" },
    { name: "Shiva", email: "shiva123@gmail.com.com", password: "shiva123" },
  ];

  for (const user of defaultUsers) {
    await db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [user.name, user.email, user.password]
    );
  }
};

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "users.db"),
      driver: sqlite3.Database,
    });

    // Create users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    // Seed default users if table is empty
    const userCountObj = await db.get("SELECT COUNT(*) as count FROM users;");
    if (userCountObj.count === 0) {
      await insertDefaultUsers();
      console.log("Inserted default users.");
    }

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000/");
    });
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    process.exit(1);
  }
};

// Health check
app.get("/", (req, res) => {
  res.send("User Management System");
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.all("SELECT id, name, email FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get user by ID
app.get("/user/:id", async (req, res) => {
  try {
    const user = await db.get("SELECT id, name, email FROM users WHERE id = ?", req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required: name, email, password" });
  }

  try {
    const ret = await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      name, email, password
    );
    res.status(201).json({ message: "User created", id: ret.lastID });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update user
app.put("/user/:id", async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ error: "Must provide at least one field to update: name or email" });
  }

  try {
    const result = await db.run(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?",
      name, email, req.params.id
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated" });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete user
app.delete("/user/:id", async (req, res) => {
  try {
    const result = await db.run("DELETE FROM users WHERE id = ?", req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search users by name
app.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Please provide a name to search" });
  }

  try {
    const users = await db.all("SELECT id, name, email FROM users WHERE name LIKE ?", `%${name}%`);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await db.get("SELECT id FROM users WHERE email = ? AND password = ?", email, password);

    if (user) {
      res.json({ status: "success", user_id: user.id });
    } else {
      res.status(401).json({ status: "failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

initializeDBandServer();

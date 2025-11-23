// app/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import { authGuard } from "@/app/(utils)/authGuard";

export default function UsersAdminPage() {
  useEffect(() => {
    authGuard(["admin"]);
  }, []);

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Not authorized");
        return;
      }

      setUsers(data);
    } catch (err) {
      setMessage("Error loading users: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(id, newRoleId) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role_id: newRoleId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update role");
      return;
    }

    alert("User role updated!");
    loadUsers();
  }

  async function deleteUser(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Failed to delete user");
      return;
    }

    alert("User deleted");
    loadUsers();
  }

  return (
    <div>
      <h2>Admin – User Management</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table
          style={{
            width: "100%",
            background: "white",
            borderCollapse: "collapse",
            marginTop: "20px",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: 10 }}>ID</th>
              <th style={{ padding: 10 }}>Username</th>
              <th style={{ padding: 10 }}>Role</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 10 }}>{u.id}</td>
                <td style={{ padding: 10 }}>{u.username}</td>
                <td style={{ padding: 10 }}>{u.role_name}</td>

                <td style={{ padding: 10 }}>
                  <select
                    defaultValue={u.role_name}
                    onChange={(e) =>
                      updateRole(u.id, roleNameToID(e.target.value))
                    }
                    style={{ marginRight: "10px", padding: "4px" }}
                  >
                    <option value="admin">admin</option>
                    <option value="advanced_user">advanced_user</option>
                    <option value="simple_user">simple_user</option>
                  </select>

                  <button
                    onClick={() => deleteUser(u.id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      padding: "6px 10px",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function roleNameToID(role) {
  if (role === "admin") return 1;
  if (role === "advanced_user") return 2;
  if (role === "simple_user") return 3;
}

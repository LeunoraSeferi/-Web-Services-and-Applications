// app/(utils)/authGuard.js
"use client";

export function authGuard(allowedRoles = []) {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    alert("You must be logged in.");
    window.location.href = "/login";
    return;
  }

  const user = JSON.parse(userRaw);
  const role = user.role_name || user.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    alert("Access denied.");
    window.location.href = "/products";
  }
}

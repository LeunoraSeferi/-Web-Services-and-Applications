import jwt from "jsonwebtoken";

/* VERIFY TOKEN FROM REQUEST */
export function verifyToken(request) {
  const auth = request.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("Missing or invalid token");
  }

  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

/* ADMIN ONLY */
export function requireAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Access denied: Admins only");
  }
}

/* ADMIN or ADVANCED_USER */
export function requireAdvancedOrAdmin(user) {
  if (user.role !== "admin" && user.role !== "advanced_user") {
    throw new Error("Access denied: Not enough privileges");
  }
}

/* PRODUCT ACCESS (ALL ROLES) */
export function requireProductAccess(user) {
  if (
    user.role !== "admin" &&
    user.role !== "advanced_user" &&
    user.role !== "simple_user"
  ) {
    throw new Error("Access denied: You cannot manage products");
  }
}

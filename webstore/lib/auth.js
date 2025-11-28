import jwt from "jsonwebtoken";

/* ============================================
   VERIFY TOKEN FROM REQUEST HEADER
   - Extracts the Authorization header
   - Ensures it starts with "Bearer "
   - Decodes and verifies the JWT token
   - Returns the decoded user object (id, role)
   ============================================ */
export function verifyToken(request) {
  const auth = request.headers.get("authorization"); // Read Authorization header

  // Token must exist and follow "Bearer <token>" format
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("Missing or invalid token");
  }

  // Extract raw token value
  const token = auth.split(" ")[1];

  // Verify token using secret key → returns decoded user
  return jwt.verify(token, process.env.JWT_SECRET);
}

/* ============================================
   ADMIN ONLY ACCESS
   - Allows only users with role = "admin"
   ============================================ */
export function requireAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Access denied: Admins only");
  }
}

/* ============================================
   ADMIN OR ADVANCED USER ACCESS
   - Allows roles: "admin", "advanced_user"
   ============================================ */
export function requireAdvancedOrAdmin(user) {
  if (user.role !== "admin" && user.role !== "advanced_user") {
    throw new Error("Access denied: Not enough privileges");
  }
}

/* ============================================
   PRODUCT ACCESS (ALL ROLES)
   - Allows: admin, advanced_user, simple_user
   - Denies anyone else
   ============================================ */
export function requireProductAccess(user) {
  if (
    user.role !== "admin" &&
    user.role !== "advanced_user" &&
    user.role !== "simple_user"
  ) {
    throw new Error("Access denied: You cannot manage products");
  }
}

/* ============================================================
   GENERIC ROLE CHECKER (REQUIRED FOR MANY API ROUTES)
   - Verifies token
   - Checks if "user.role" exists in allowedRoles
   - Works with API Routes exactly as needed
   ============================================================ */
export function requireRole(request, allowedRoles = []) {
  try {
    // Decode JWT token
    const user = verifyToken(request);

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
      return {
        error: true,
        response: Response.json(
          { error: "Access denied: insufficient privileges" },
          { status: 403 }
        )
      };
    }

    // User is allowed
    return { error: false, user };

  } catch (err) {
    return {
      error: true,
      response: Response.json(
        { error: "Invalid or missing token" },
        { status: 401 }
      )
    };
  }
}
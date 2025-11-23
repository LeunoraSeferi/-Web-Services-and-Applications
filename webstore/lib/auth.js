import jwt from "jsonwebtoken";

export function getUserFromRequest(request) {
  const header = request.headers.get("authorization") || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireRole(request, roles) {
  const user = getUserFromRequest(request);

  if (!user || !roles.includes(user.role)) {
    return {
      error: true,
      response: new Response(
        JSON.stringify({ message: "Forbidden" }),
        { status: 403 }
      ),
    };
  }

  return { error: false, user };
}

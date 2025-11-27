# Webstore API — Postman Collection

This folder contains a Postman collection JSON you can import into Postman to test the API endpoints.

Files:
- `webstore.postman_collection.json` — Postman v2.1 collection describing all API endpoints included in this project.

Quick steps
1. Open Postman → Import → Choose Files → select `webstore.postman_collection.json`
2. Create an environment or use Globals with variables:
   - `baseUrl` — the base URL of your dev server (default: `http://localhost:3000`)
   - `authToken` — set a JWT token after calling `/api/auth/login` to test protected endpoints

Notes and tips
- Some endpoints require a valid JWT token (set `{{authToken}}` in environment variables and use `Bearer {{authToken}}` in Authorization headers).
- Example request bodies are included in the JSON; adjust values as needed.

If you want, I can also create a Postman environment JSON with the two variables (`baseUrl` and `authToken`) to make import even easier — just tell me and I will add it here.
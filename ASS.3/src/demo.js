// src/demo.js
// Demonstration script (for professor):
// - Normal API consumption
// - Performance optimization (cache + concurrency limit)
// - Delay handling (timeouts)
// - Failure handling (4xx / network)

const { smartFetchJson } = require("./smartFetch");
const { getCache, setCache } = require("./cache");
const { createLimiter } = require("./limiter");

const limit = createLimiter(2); // limit parallel calls

// Cached call wrapper:
// 1) return cached response if available
// 2) otherwise call API using smartFetchJson (robust)
// 3) cache the result
async function cachedCall(url, ttlMs = 120000, timeoutMs = 1) {
  const cached = getCache(url);
  if (cached) {
    console.log(" Using cached data for:", url);
    return cached;
  }

  const data = await smartFetchJson(url, { timeoutMs });
  setCache(url, data, ttlMs);
  console.log(" Fetched fresh data for:", url);
  return data;
}

async function main() {
  console.log("=== DEMO Robust API Consumer ===");

  const entityFactsUrl = "https://hub.culturegraph.org/entityfacts/118540238";
  const openAlexUrl = "https://api.openalex.org/authors/A5023888391";

  // ------------------------------------------------------------
  // DEMO 1: Normal successful calls (with concurrency limiting)
  // ------------------------------------------------------------
  console.log("\n--- DEMO 1: Normal Calls (Concurrency Limited) ---");
  const [goethe, author] = await Promise.all([
    limit(() => cachedCall(entityFactsUrl, 120000, 6000)),
    limit(() => cachedCall(openAlexUrl, 120000, 6000)),
  ]);

  console.log("EntityFacts preferredName:", goethe.preferredName);
  console.log("OpenAlex display_name:", author.display_name);

  // ------------------------------------------------------------
  // DEMO 2: Performance optimization (Caching)
  // ------------------------------------------------------------
  console.log("\n--- DEMO 2: Caching (Performance Optimization) ---");
  await cachedCall(entityFactsUrl); // should use cache
  await cachedCall(openAlexUrl);    // should use cache

  // ------------------------------------------------------------
  // DEMO 3: Delay handling (Timeout)
  // Force extremely small timeout to show graceful handling
  // ------------------------------------------------------------
  console.log("\n--- DEMO 3: Delay Handling (Timeout) ---");
try {
  const notCachedUrl = entityFactsUrl + "?demoTimeout=1";
  await cachedCall(notCachedUrl, 120000, 1);
} catch (e) {
  console.error(" Timeout demo handled:", e.message);
}


  // ------------------------------------------------------------
  // DEMO 4: Failure / downtime handling
  // Use a wrong URL to trigger a 404 (client error)
  // ------------------------------------------------------------
  console.log("\n--- DEMO 4: Failure Handling (Bad URL -> 404) ---");
  try {
    const badUrl = "https://hub.culturegraph.org/entityfacts/118540238X";
    await cachedCall(badUrl, 120000, 6000);
  } catch (e) {
    console.error(" Failure demo handled:", e.message);
  }

  console.log("\n=== DONE ===");
}

main().catch((e) => {
  console.error(" Demo failed but handled:", e.message);
});

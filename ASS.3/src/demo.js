// src/demo.js
// Script demonstrues për profesorin:
// - përdorim normal i API-ve
// - optimizim performance (cache + kufizim paralelizmi)
// - trajtim vonese (timeout)
// - trajtim gabimesh (4xx / network)


// Importojmë funksionin kryesor “smart fetch” që bën request të sigurt
const { smartFetchJson } = require("./smartFetch");

// Importojmë cache (in-memory) me TTL
const { getCache, setCache } = require("./cache");

// Importojmë limiter për të kufizuar sa request-e bëhen njëkohësisht
const { createLimiter } = require("./limiter");


// Krijojmë limiter: maksimum 2 thirrje paralel në të njëjtën kohë
const limit = createLimiter(2); // limit parallel calls


// ===================================================
// Wrapper për thirrje të cache-uar (performancë)
// 1) nëse ka cache -> kthen cache
// 2) përndryshe -> thërret API me smartFetchJson
// 3) ruan rezultatin në cache me TTL
// ===================================================
async function cachedCall(url, ttlMs = 120000, timeoutMs = 1) {

  // Provojmë të marrim rezultatin nga cache
  const cached = getCache(url);

  // Nëse ekziston cache, e përdorim dhe nuk bëjmë request
  if (cached) {
    console.log(" Using cached data for:", url);
    return cached;
  }

  // Nëse s’ka cache, bëjmë request te API me timeout
  const data = await smartFetchJson(url, { timeoutMs });

  // Ruajmë rezultatin në cache për ttlMs milisekonda
  setCache(url, data, ttlMs);

  // Log për të treguar që është fetch i ri
  console.log(" Fetched fresh data for:", url);

  // Kthejmë rezultatet
  return data;
}


// ===================================================
// MAIN DEMO
// ===================================================
async function main() {

  // Titull në console
  console.log("=== DEMO Robust API Consumer ===");

  // URL për API 1 (EntityFacts)
  const entityFactsUrl = "https://hub.culturegraph.org/entityfacts/118540238";

  // URL për API 2 (OpenAlex)
  const openAlexUrl = "https://api.openalex.org/authors/A5023888391";


  // ------------------------------------------------------------
  // DEMO 1: Thirrje normale (me concurrency limiting)
  // Tregon: si kufizohet numri i request-eve paralel
  // ------------------------------------------------------------
  console.log("\n--- DEMO 1: Normal Calls (Concurrency Limited) ---");

  // Promise.all: bëhen dy kërkesa njëkohësisht
  // limit(...) siguron që paralelizmi të mos e kalojë 2
  const [goethe, author] = await Promise.all([
    limit(() => cachedCall(entityFactsUrl, 120000, 6000)),
    limit(() => cachedCall(openAlexUrl, 120000, 6000)),
  ]);

  // Shfaqim disa fusha nga rezultatet për të provuar suksesin
  console.log("EntityFacts preferredName:", goethe.preferredName);
  console.log("OpenAlex display_name:", author.display_name);


  // ------------------------------------------------------------
  // DEMO 2: Performance optimization (Caching)
  // Tregon: thirrja e dytë nuk shkon në rrjet, por kthehet nga cache
  // ------------------------------------------------------------
  console.log("\n--- DEMO 2: Caching (Performance Optimization) ---");

  // Këtu pritet "Using cached data" sepse URL është cache-uar te DEMO 1
  await cachedCall(entityFactsUrl);

  // Edhe kjo duhet të përdor cache
  await cachedCall(openAlexUrl);


  // ------------------------------------------------------------
  // DEMO 3: Delay handling (Timeout)
  // Tregon: kur API është e ngadalshme ose timeout është shumë i vogël,
  // gabimi trajtohet pa e rrëzuar programin
  // ------------------------------------------------------------
  console.log("\n--- DEMO 3: Delay Handling (Timeout) ---");

  try {
    // Ndryshojmë URL që të mos jetë në cache (që të bëjë request real)
    const notCachedUrl = entityFactsUrl + "?demoTimeout=1";

    // timeout 1ms → pritet të dështojë dhe të kapet në catch
    await cachedCall(notCachedUrl, 120000, 1);

  } catch (e) {
    // Kapim gabimin dhe tregojmë që u trajtua mirë
    console.error(" Timeout demo handled:", e.message);
  }


  // ------------------------------------------------------------
  // DEMO 4: Failure handling (404 ose downtime)
  // Tregon: kur URL është gabim, kemi error handling
  // ------------------------------------------------------------
  console.log("\n--- DEMO 4: Failure Handling (Bad URL -> 404) ---");

  try {
    // URL i gabuar → 404 pritet
    const badUrl = "https://hub.culturegraph.org/entityfacts/118540238X";

    // Thirrja duhet të dështojë dhe të kapet
    await cachedCall(badUrl, 120000, 6000);

  } catch (e) {
    // Kapim gabimin në mënyrë të kontrolluar
    console.error(" Failure demo handled:", e.message);
  }


  // Fundi i demos
  console.log("\n=== DONE ===");
}


// Thërrasim main dhe kapim çdo error të papritur
main().catch((e) => {
  console.error(" Demo failed but handled:", e.message);
});

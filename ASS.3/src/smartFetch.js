// =======================================================
// ROBUST JSON FETCH
// Handles:
// - 429 rate limits
// - timeouts
// - retries (5xx / network errors)
// =======================================================


// DEMO ONLY:
// Simulon një 429 një herë që të bësh screenshot
let simulate429Once = true;


// Funksion ndihmës për delay
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}


// Lexon header-in Retry-After (nëse ekziston)
function getRetryAfterMs(res) {
  const ra = res.headers.get("retry-after");

  // Nëse nuk ekziston header
  if (!ra) return null;

  // Konvertojmë në sekonda
  const seconds = Number(ra);

  // Kthejmë milisekonda nëse valid
  return Number.isFinite(seconds) ? seconds * 1000 : null;
}


// =======================================================
// SMART FETCH FUNCTION
// =======================================================
async function smartFetchJson(url, options = {}) {

  // Konfigurime default
  const {
    timeoutMs = 8000,   // maksimumi sa pret request
    maxRetries = 4,     // sa herë retry
    baseDelayMs = 400,  // bazë për exponential backoff
    headers = {},       // headers shtesë
  } = options;


  // Loop për retry attempts
  for (let attempt = 0; attempt <= maxRetries; attempt++) {

    // AbortController për timeout
    const controller = new AbortController();

    // Nëse kalon timeoutMs -> abort request
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {

      // Bëjmë fetch request
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json", ...headers },
      });


      // ==========================================
      // DEMO ONLY: simulim 429 një herë
      // ==========================================
      if (simulate429Once) {
        simulate429Once = false;

        console.log(" Simulating HTTP 429 once for demo...");

        // presim pak sikur serveri të na ketë limituar
        await sleep(1000);

        // vazhdojmë loop (retry)
        continue;
      }


      // ==========================================
      // RATE LIMIT: HTTP 429
      // ==========================================
      if (res.status === 429) {

        // lexojmë Retry-After header
        const retryAfter = getRetryAfterMs(res);

        // nëse ekziston -> përdorim atë
        // përndryshe exponential backoff
        const waitMs = retryAfter ?? baseDelayMs * Math.pow(2, attempt);

        console.log(` 429 rate limited. Waiting ${waitMs}ms then retry...`);

        await sleep(waitMs);
        continue; // retry
      }


      // ==========================================
      // SERVER ERROR: 5xx
      // ==========================================
      if (res.status >= 500) {

        const waitMs = baseDelayMs * Math.pow(2, attempt);

        console.log(` ${res.status} server error. Waiting ${waitMs}ms then retry...`);

        await sleep(waitMs);
        continue; // retry
      }


      // ==========================================
      // CLIENT ERRORS (4xx) – mos bë retry
      // ==========================================
      if (!res.ok) {

        const txt = await res.text().catch(() => "");

        // Hedhim error direkt
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }


      // Nëse gjithçka OK -> kthejmë JSON
      return await res.json();


    } catch (e) {

      // Timeout / network error
      // Bëjmë retry nëse nuk kemi arritur maxRetries
      if (attempt === maxRetries) throw e;

      const waitMs = baseDelayMs * Math.pow(2, attempt);

      console.log(` Network/timeout error. Waiting ${waitMs}ms then retry...`);

      await sleep(waitMs);

    } finally {

      // Pastrojmë timeout timer
      clearTimeout(timer);
    }
  }
}


// Exportojmë funksionin
module.exports = { smartFetchJson };

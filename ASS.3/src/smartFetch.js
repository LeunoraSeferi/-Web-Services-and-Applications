
// Robust JSON fetch: handles 429 rate limits, timeouts, and retries (5xx/network).

//  DEMO ONLY: simulate one 429 so you can screenshot rate-limit handling
let simulate429Once = true;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getRetryAfterMs(res) {
  const ra = res.headers.get("retry-after");
  if (!ra) return null;
  const seconds = Number(ra);
  return Number.isFinite(seconds) ? seconds * 1000 : null;
}

async function smartFetchJson(url, options = {}) {
  const {
    timeoutMs = 8000,
    maxRetries = 4,
    baseDelayMs = 400,
    headers = {},
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json", ...headers },
      });

      //  DEMO ONLY: force a rate-limit scenario once
      // This makes the code "demonstrate" 429 handling even if the real API never rate-limits you.
      if (simulate429Once) {
        simulate429Once = false;
        console.log(" Simulating HTTP 429 once for demo...");
        // wait a bit as if the server told us to slow down
        await sleep(1000);
        continue; // retry the loop
      }

      //  RATE LIMIT: 429 Too Many Requests
      if (res.status === 429) {
        const retryAfter = getRetryAfterMs(res);
        const waitMs = retryAfter ?? baseDelayMs * Math.pow(2, attempt);
        console.log(` 429 rate limited. Waiting ${waitMs}ms then retry...`);
        await sleep(waitMs);
        continue;
      }

      //  API DOWN / SERVER ERROR: retry on 5xx
      if (res.status >= 500) {
        const waitMs = baseDelayMs * Math.pow(2, attempt);
        console.log(` ${res.status} server error. Waiting ${waitMs}ms then retry...`);
        await sleep(waitMs);
        continue;
      }

      //  Other errors (4xx) -> don’t retry
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      return await res.json();
    } catch (e) {
      //  delays/timeouts/network failures -> retry
      if (attempt === maxRetries) throw e;
      const waitMs = baseDelayMs * Math.pow(2, attempt);
      console.log(` Network/timeout error. Waiting ${waitMs}ms then retry...`);
      await sleep(waitMs);
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = { smartFetchJson };

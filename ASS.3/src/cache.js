// ==========================================
// PERFORMANCE: SIMPLE IN-MEMORY CACHE
// ==========================================

// Krijojmë një Map në memorie për të ruajtur cache
// Struktura: key (URL) -> { value, expires }
const cache = new Map();


// ===============================
// GET nga cache
// ===============================
function getCache(key) {

  // Marrim objektin nga Map
  const item = cache.get(key);

  // Nëse nuk ekziston, kthejmë null
  if (!item) return null;

  // Kontrollojmë nëse TTL ka skaduar
  if (Date.now() > item.expires) { // expired

    // Nëse ka skaduar, e fshijmë nga cache
    cache.delete(key);

    return null;
  }

  // Nëse është valid, kthejmë value
  return item.value;
}


// ===============================
// SET në cache
// ===============================
function setCache(key, value, ttlMs = 60_000) {

  // Ruajmë value + expiration time
  cache.set(key, {
    value,
    expires: Date.now() + ttlMs // TTL (default 60 sekonda)
  });
}


// Exportojmë funksionet për përdorim në route/controller
module.exports = { getCache, setCache };

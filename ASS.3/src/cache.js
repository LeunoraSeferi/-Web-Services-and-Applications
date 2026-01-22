//performance: cache
// Simple in-memory cache (URL -> response) with TTL for performance.

const cache = new Map();

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expires) { // expired
    cache.delete(key);
    return null;
  }

  return item.value;
}

function setCache(key, value, ttlMs = 60_000) {
  cache.set(key, { value, expires: Date.now() + ttlMs });
}

module.exports = { getCache, setCache };

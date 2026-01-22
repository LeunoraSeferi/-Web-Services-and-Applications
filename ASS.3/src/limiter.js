// Performance optimization: limit concurrent calls
// Concurrency limiter: prevents too many parallel API calls (perf + rate-limit safety).

function createLimiter(maxConcurrent = 3) {
  let active = 0;
  const queue = [];

  return async function limit(fn) {
    if (active >= maxConcurrent) {
      await new Promise((resolve) => queue.push(resolve)); // wait for a slot
    }

    active++;
    try {
      return await fn();
    } finally {
      active--;
      const next = queue.shift();
      if (next) next(); // release next waiting task
    }
  };
}

module.exports = { createLimiter };

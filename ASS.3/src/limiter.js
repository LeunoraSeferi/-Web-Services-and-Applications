// ===============================================
// PERFORMANCE OPTIMIZATION
// Concurrency limiter
// Parandalon shumë API calls paralel
// ===============================================


// Funksioni krijon një limiter me maksimum
// 'maxConcurrent' thirrje paralel (default 3)
function createLimiter(maxConcurrent = 3) {

  // Numërues për thirrjet aktive
  let active = 0;

  // Rradhë (queue) për thirrjet që presin
  const queue = [];

  // Kthejmë funksionin limit që mbështjell fn()
  return async function limit(fn) {

    // Nëse kemi arritur limitin,
    // presim derisa të lirohet një slot
    if (active >= maxConcurrent) {

      // Shtojmë resolve në queue dhe presim
      await new Promise((resolve) => queue.push(resolve));
    }

    // Rrisim numrin e thirrjeve aktive
    active++;

    try {
      // Ekzekutojmë funksionin real (API call)
      return await fn();

    } finally {

      // Ul numrin e thirrjeve aktive
      active--;

      // Marrim task-un tjetër nga queue
      const next = queue.shift();

      // Nëse ka ndonjë në pritje, e lejojmë të vazhdojë
      if (next) next(); // release next waiting task
    }
  };
}


// Exportojmë funksionin për përdorim në demo ose controller
module.exports = { createLimiter };

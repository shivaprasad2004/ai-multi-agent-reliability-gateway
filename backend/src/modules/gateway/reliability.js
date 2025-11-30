class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = new Map();
    this.state = new Map(); // 'closed', 'open', 'half-open'
  }

  getState(provider) {
    return this.state.get(provider) || 'closed';
  }

  recordSuccess(provider) {
    this.failures.set(provider, 0);
    this.state.set(provider, 'closed');
  }

  recordFailure(provider) {
    const current = this.failures.get(provider) || 0;
    const newCount = current + 1;
    this.failures.set(provider, newCount);

    if (newCount >= this.threshold) {
      this.state.set(provider, 'open');
      setTimeout(() => {
        this.state.set(provider, 'half-open');
      }, this.timeout);
    }
  }

  canAttempt(provider) {
    const state = this.getState(provider);
    return state === 'closed' || state === 'half-open';
  }
}

async function withRetry(fn, options = {}) {
  const maxRetries = options.maxRetries || 3;
  const baseDelay = options.baseDelay || 1000;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

async function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
}

async function withFallback(primaryFn, fallbackFn, options = {}) {
  try {
    return await primaryFn();
  } catch (error) {
    if (fallbackFn) {
      console.log('Primary failed, using fallback:', error.message);
      return await fallbackFn();
    }
    throw error;
  }
}

async function withCircuitBreaker(circuitBreaker, provider, fn) {
  if (!circuitBreaker.canAttempt(provider)) {
    throw new Error(`Circuit breaker is open for ${provider}`);
  }

  try {
    const result = await fn();
    circuitBreaker.recordSuccess(provider);
    return result;
  } catch (error) {
    circuitBreaker.recordFailure(provider);
    throw error;
  }
}

module.exports = {
  CircuitBreaker,
  withRetry,
  withTimeout,
  withFallback,
  withCircuitBreaker
};


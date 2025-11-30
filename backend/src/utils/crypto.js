const crypto = require('crypto');

/**
 * Compute SHA-256 hash of input string
 */
function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Generate API key
 */
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  sha256,
  generateApiKey
};


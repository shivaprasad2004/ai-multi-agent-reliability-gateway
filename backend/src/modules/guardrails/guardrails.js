const { GuardrailViolation } = require('./guardrailModel');

// PII patterns (simple word-based detection)
const PII_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
  /\b\d{3}\.\d{2}\.\d{4}\b/, // SSN
  /\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b/, // Credit card
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
  /\b\d{3}-\d{3}-\d{4}\b/, // Phone
];

// Toxicity keywords (simple filter)
const TOXICITY_KEYWORDS = [
  'hate', 'violence', 'harmful', 'offensive', 'abusive'
];

function validateInput(input, options = {}) {
  const violations = [];

  // Length check
  const maxLength = options.maxLength || 10000;
  if (input.length > maxLength) {
    violations.push({
      type: 'length',
      details: `Input exceeds maximum length of ${maxLength} characters`
    });
  }

  // Pattern check
  if (options.forbiddenPatterns) {
    for (const pattern of options.forbiddenPatterns) {
      if (new RegExp(pattern).test(input)) {
        violations.push({
          type: 'pattern',
          details: `Input contains forbidden pattern: ${pattern}`
        });
      }
    }
  }

  return violations;
}

function checkPII(text) {
  const violations = [];
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(text)) {
      violations.push({
        type: 'pii',
        details: `PII detected: ${pattern.toString()}`
      });
    }
  }
  return violations;
}

function checkToxicity(text) {
  const violations = [];
  const lowerText = text.toLowerCase();
  for (const keyword of TOXICITY_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      violations.push({
        type: 'toxicity',
        details: `Potential toxicity detected: ${keyword}`
      });
    }
  }
  return violations;
}

function validateJSON(text, schema = null) {
  const violations = [];

  try {
    const parsed = JSON.parse(text);
    
    if (schema) {
      // Simple schema validation (can be extended)
      if (schema.type === 'object' && typeof parsed !== 'object') {
        violations.push({
          type: 'json_schema',
          details: 'Expected JSON object'
        });
      }
      
      if (schema.required) {
        for (const field of schema.required) {
          if (!(field in parsed)) {
            violations.push({
              type: 'json_schema',
              details: `Missing required field: ${field}`
            });
          }
        }
      }
    }
  } catch (error) {
    violations.push({
      type: 'json_schema',
      details: `Invalid JSON: ${error.message}`
    });
  }

  return violations;
}

function validateOutput(output, options = {}) {
  const violations = [];

  // PII check
  if (options.checkPII !== false) {
    violations.push(...checkPII(output));
  }

  // Toxicity check
  if (options.checkToxicity !== false) {
    violations.push(...checkToxicity(output));
  }

  // JSON validation
  if (options.expectJson) {
    violations.push(...validateJSON(output, options.jsonSchema));
  }

  return violations;
}

async function logViolations(requestId, violations) {
  if (!violations || violations.length === 0) return;

  for (const violation of violations) {
    await GuardrailViolation.create({
      requestId,
      type: violation.type,
      details: violation.details
    });
  }
}

module.exports = {
  validateInput,
  validateOutput,
  checkPII,
  checkToxicity,
  validateJSON,
  logViolations
};


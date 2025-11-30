const axios = require('axios');

class ProviderAdapter {
  constructor(providerName, config) {
    this.providerName = providerName;
    this.config = config;
  }

  async call(prompt, options = {}) {
    throw new Error('call() must be implemented by subclass');
  }
}

class OpenAIAdapter extends ProviderAdapter {
  constructor(config) {
    super('openai', config);
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  }

  async call(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const model = options.model || 'gpt-3.5-turbo';
    const maxTokens = options.maxTokens || 1000;
    const temperature = options.temperature || 0.7;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: options.timeout || 30000
        }
      );

      const content = response.data.choices[0]?.message?.content || '';
      const inputTokens = response.data.usage?.prompt_tokens || 0;
      const outputTokens = response.data.usage?.completion_tokens || 0;

      return {
        content,
        inputTokens,
        outputTokens,
        model: response.data.model
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

class GeminiAdapter extends ProviderAdapter {
  constructor(config) {
    super('gemini', config);
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY;
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async call(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = options.model || 'gemini-pro';
    const maxTokens = options.maxTokens || 1000;
    const temperature = options.temperature || 0.7;

    try {
      const response = await axios.post(
        `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: options.timeout || 30000
        }
      );

      const content = response.data.candidates[0]?.content?.parts[0]?.text || '';
      const inputTokens = response.data.usageMetadata?.promptTokenCount || 0;
      const outputTokens = response.data.usageMetadata?.candidatesTokenCount || 0;

      return {
        content,
        inputTokens,
        outputTokens,
        model
      };
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}

class MockAdapter extends ProviderAdapter {
  constructor(config) {
    super('mock', config);
  }

  async call(prompt, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    // Simple mock response
    const mockResponses = [
      `This is a mock response to: "${prompt.substring(0, 50)}..."`,
      `Mock AI generated content for your query.`,
      `Generated response: ${prompt.split(' ').slice(0, 5).join(' ')}...`
    ];

    const content = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const inputTokens = Math.floor(prompt.length / 4);
    const outputTokens = Math.floor(content.length / 4);

    return {
      content,
      inputTokens,
      outputTokens,
      model: options.model || 'mock-basic'
    };
  }
}

function createAdapter(providerName, config = {}) {
  switch (providerName.toLowerCase()) {
    case 'openai':
      return new OpenAIAdapter(config);
    case 'gemini':
      return new GeminiAdapter(config);
    case 'mock':
    default:
      return new MockAdapter(config);
  }
}

module.exports = {
  ProviderAdapter,
  OpenAIAdapter,
  GeminiAdapter,
  MockAdapter,
  createAdapter
};


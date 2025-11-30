import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function Playground() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [taskType, setTaskType] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(false);

  // Fetch user's API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoadingKeys(true);
      const response = await axiosInstance.get('/api/admin/api-keys');
      if (response.data.success && response.data.data.length > 0) {
        const keys = response.data.data;
        setApiKeys(keys);
        // Auto-select first active key
        const activeKey = keys.find(k => k.status === 'active');
        if (activeKey) {
          setApiKey(activeKey.key);
        }
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoadingKeys(false);
    }
  };

  const createApiKey = async () => {
    try {
      setLoadingKeys(true);
      const response = await axiosInstance.post('/api/admin/api-keys', {
        dailyLimit: 1000
      });
      if (response.data.success) {
        const newKey = response.data.data.key;
        setApiKey(newKey);
        await fetchApiKeys(); // Refresh list
      }
    } catch (error) {
      setError('Failed to create API key: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    // Ensure we have an API key
    let keyToUse = apiKey;
    if (!keyToUse && apiKeys.length > 0) {
      const activeKey = apiKeys.find(k => k.status === 'active');
      if (activeKey) {
        keyToUse = activeKey.key;
        setApiKey(keyToUse);
      }
    }

    if (!keyToUse) {
      setError('API key is required. Please create one or enter an existing key.');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        '/api/v1/ai/chat',
        {
          prompt,
          taskType: taskType || undefined
        },
        {
          headers: {
            'x-api-key': keyToUse
          }
        }
      );

      setResponse(response.data.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMsg);
      console.error('Playground error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Playground</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Input</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                API Key {apiKey ? '(✓ Set)' : '(Required)'}
              </label>
              {apiKeys.length > 0 ? (
                <select
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                >
                  <option value="">Select API Key</option>
                  {apiKeys
                    .filter(k => k.status === 'active')
                    .map((key) => (
                      <option key={key.id} value={key.key}>
                        {key.key.substring(0, 20)}... (Limit: {key.dailyLimit || 'Unlimited'})
                      </option>
                    ))}
                </select>
              ) : (
                <div>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                    placeholder="Enter API key or create one below"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={createApiKey}
                  disabled={loadingKeys}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loadingKeys ? 'Creating...' : 'Create New API Key'}
                </button>
                <button
                  type="button"
                  onClick={fetchApiKeys}
                  disabled={loadingKeys}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                >
                  Refresh Keys
                </button>
              </div>
              {!apiKey && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ API key is required to use the playground
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Task Type (optional)</label>
              <input
                type="text"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., chat, code, analysis"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-64"
                placeholder="Enter your prompt here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Send'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Response</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {response && (
            <div>
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <h3 className="font-bold mb-2">Content:</h3>
                <p className="whitespace-pre-wrap">{response.content}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>Latency: {response.latencyMs}ms</p>
                <p>Input Tokens: {response.inputTokens || 0}</p>
                <p>Output Tokens: {response.outputTokens || 0}</p>
                <p>Cache Hit: {response.cacheHit ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
          {!response && !error && !loading && (
            <p className="text-gray-500">Enter a prompt and click Send to see the response</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Playground;


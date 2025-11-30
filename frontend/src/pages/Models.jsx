import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function Models() {
  const [models, setModels] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    providerId: '',
    modelName: '',
    costPerToken: 0,
    contextWindow: 4096,
    enabled: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modelsRes, providersRes] = await Promise.all([
        axiosInstance.get('/api/admin/models'),
        axiosInstance.get('/api/admin/providers')
      ]);
      setModels(modelsRes.data.data);
      setProviders(providersRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axiosInstance.put(`/api/admin/models/${editing.id}`, formData);
      } else {
        await axiosInstance.post('/api/admin/models', formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ providerId: '', modelName: '', costPerToken: 0, contextWindow: 4096, enabled: true });
      fetchData();
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  const handleEdit = (model) => {
    setEditing(model);
    setFormData({
      providerId: model.providerId,
      modelName: model.modelName,
      costPerToken: model.costPerToken,
      contextWindow: model.contextWindow,
      enabled: model.enabled
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await axiosInstance.delete(`/api/admin/models/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Models</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ providerId: '', modelName: '', costPerToken: 0, contextWindow: 4096, enabled: true });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Model
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Context Window</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enabled</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {models.map((model) => (
              <tr key={model.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {model.Provider?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.modelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.costPerToken}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.contextWindow}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {model.enabled ? '✓' : '✗'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(model)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(model.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Model</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Provider</label>
                <select
                  value={formData.providerId}
                  onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Provider</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Model Name</label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Cost Per Token</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.costPerToken}
                  onChange={(e) => setFormData({ ...formData, costPerToken: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Context Window</label>
                <input
                  type="number"
                  value={formData.contextWindow}
                  onChange={(e) => setFormData({ ...formData, contextWindow: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="mr-2"
                  />
                  Enabled
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Models;


import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'generator',
    modelId: '',
    orderIndex: 0,
    taskType: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [agentsRes, modelsRes] = await Promise.all([
        axiosInstance.get('/api/admin/agents'),
        axiosInstance.get('/api/admin/models')
      ]);
      setAgents(agentsRes.data.data);
      setModels(modelsRes.data.data);
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
        await axiosInstance.put(`/api/admin/agents/${editing.id}`, formData);
      } else {
        await axiosInstance.post('/api/admin/agents', formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ name: '', role: 'generator', modelId: '', orderIndex: 0, taskType: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const handleEdit = (agent) => {
    setEditing(agent);
    setFormData({
      name: agent.name,
      role: agent.role,
      modelId: agent.modelId,
      orderIndex: agent.orderIndex,
      taskType: agent.taskType || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axiosInstance.delete(`/api/admin/agents/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  const handleReorder = async () => {
    const agentIds = agents.map(a => a.id);
    try {
      await axiosInstance.post('/api/admin/agents/reorder', { agentIds });
      fetchData();
    } catch (error) {
      console.error('Error reordering agents:', error);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newAgents = [...agents];
    [newAgents[index - 1], newAgents[index]] = [newAgents[index], newAgents[index - 1]];
    setAgents(newAgents);
  };

  const moveDown = (index) => {
    if (index === agents.length - 1) return;
    const newAgents = [...agents];
    [newAgents[index], newAgents[index + 1]] = [newAgents[index + 1], newAgents[index]];
    setAgents(newAgents);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <div>
          <button
            onClick={handleReorder}
            className="px-4 py-2 mr-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Order
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({ name: '', role: 'generator', modelId: '', orderIndex: 0, taskType: '' });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Agent
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agents.map((agent, index) => (
              <tr key={agent.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="mr-2">↑</button>
                    <span>{agent.orderIndex}</span>
                    <button onClick={() => moveDown(index)} disabled={index === agents.length - 1} className="ml-2">↓</button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {agent.Model?.modelName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.taskType || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(agent)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id)}
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
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Agent</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="generator">Generator</option>
                  <option value="safety">Safety</option>
                  <option value="quality">Quality</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
                <select
                  value={formData.modelId}
                  onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Model</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.modelName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Order Index</label>
                <input
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Task Type (optional)</label>
                <input
                  type="text"
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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

export default Agents;


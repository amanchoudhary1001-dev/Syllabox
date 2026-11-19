import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const MyUploads = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  const fetchMyMaterials = async () => {
    try {
      const res = await API.get('/materials/user/me');
      console.log('Fetched materials:', res.data); // ✅ Debug log
      setMaterials(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    try {
      console.log('Deleting material with ID:', id); // ✅ Debug log
      
      const res = await API.delete(`/materials/${id}`);
      console.log('Delete response:', res.data); // ✅ Debug log
      
      toast.success('Material deleted successfully! 🗑️');
      setMaterials(materials.filter(m => m._id !== id));
      
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error response:', error.response); // ✅ Debug log
      
      // ✅ Show specific error message
      const errorMsg = error.response?.data?.message || 'Failed to delete material';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-gray-900">📚 My Uploads</h1>
      <p className="text-sm text-gray-500 mb-4">Manage your shared materials</p>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : materials.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl">
          <p className="text-gray-500">No uploads yet</p>
          <p className="text-sm text-gray-400">Start sharing! 📤</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-500">Title</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500">Subject</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500">Branch</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500">Sem</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m._id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">{m.title}</td>
                  <td className="px-4 py-2 text-gray-600">{m.subject}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">
                      {m.branch || (m.branches && m.branches[0]) || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-2">Sem {m.semester}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyUploads;
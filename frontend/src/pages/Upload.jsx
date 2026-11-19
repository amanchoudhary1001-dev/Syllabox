import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    branch: 'CSE',
    semester: 1
  });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const allBranches = ['CSE', 'CSE-AI', 'CSE-DS', 'ECE', 'ME', 'CE', 'EE', 'IT'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchToggle = (branch) => {
    setSelectedBranches(prev =>
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      
      // ✅ Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast.error(`File size must be less than 50MB. Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        e.target.value = '';
        return;
      }
      
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (selectedBranches.length === 0) {
      toast.error('Please select at least one branch');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    data.append('subject', formData.subject);
    data.append('semester', formData.semester);
    data.append('branches', JSON.stringify(selectedBranches));

    setLoading(true);
    try {
      await API.post('/materials/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Material uploaded successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">📤 Upload Material</h1>
        <p className="text-sm text-gray-500 mb-4">Share with fellow students</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., DSA Notes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject *</label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Data Structures"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {allBranches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Applicable Branches *</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {allBranches.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBranchToggle(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedBranches.includes(b)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Selected: <span className="text-indigo-600 font-medium">{selectedBranches.join(', ') || 'None'}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">File * (Max 50MB)</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
              className="mt-1 w-full text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
            {fileName && <p className="text-xs text-green-600 mt-1">📎 {fileName}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Uploading...' : '📤 Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;